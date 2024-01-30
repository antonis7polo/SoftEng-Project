const { pool } = require('../utils/database'); 
const { Parser } = require('json2csv');


async function uploadRating(req, res) {
    const {userID,titleID, userRating } = req.body;

    if(!userID || !titleID || !userRating) {
        return res.status(400).json({ message: 'Missing required information' });
    }

    const authenticatedUserID = req.user.userId; 
    if (parseInt(authenticatedUserID, 10) !== parseInt(userID, 10)) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const userRatingInt = parseFloat(userRating);

    if (isNaN(userRatingInt) || userRatingInt < 0 || userRatingInt > 10) {
        return res.status(400).json({ message: 'Invalid rating' });
    }

    const connection = await pool.getConnection();


    try {

        await connection.beginTransaction();

        // Check if the rating already exists
        const existingRatingQuery = `SELECT user_rating FROM User_Title_Ratings WHERE user_id = ? AND title_id = ?`;
        const [existingRating] = await connection.query(existingRatingQuery, [authenticatedUserID, titleID]);

        // Retrieve the current average rating and number of votes
        const currentRatingQuery = `SELECT average_rating, num_votes FROM Titles WHERE title_id = ?`;
        const [currentRatingData] = await connection.query(currentRatingQuery, [titleID]);

        if (currentRatingData.length === 0) {
            return res.status(400).json({ message: 'Invalid title ID' });
        }

        let currentAverage = currentRatingData[0]?.average_rating || 0;
        let currentNumVotes = currentRatingData[0]?.num_votes || 0;

        // Insert or update the rating
        if (existingRating.length > 0) {
            // Rating exists, update it
            const oldUserRating = existingRating[0].user_rating;

            const updateRatingQuery = `UPDATE User_Title_Ratings SET user_rating = ? WHERE user_id = ? AND title_id = ?`;
            await connection.query(updateRatingQuery, [userRatingInt, authenticatedUserID, titleID]);

            // Update the average rating (considering the old rating)
            currentAverage = ((currentAverage * currentNumVotes) - oldUserRating + userRatingInt) / currentNumVotes;
        } else {
            // Rating does not exist, insert new rating
            const insertRatingQuery = `INSERT INTO User_Title_Ratings (user_id, title_id, user_rating) VALUES (?, ?, ?)`;
            await connection.query(insertRatingQuery, [authenticatedUserID, titleID, userRatingInt]);

            // Update the average rating (considering this as a new rating)
            currentNumVotes += 1;
            currentAverage = ((currentAverage * (currentNumVotes - 1)) + userRatingInt) / currentNumVotes;
        }

        // Update the titles table with the new average and new number of votes
        const updateTitleRatingQuery = `UPDATE Titles SET average_rating = ?, num_votes = ? WHERE title_id = ?`;
        await connection.query(updateTitleRatingQuery, [currentAverage.toFixed(2), currentNumVotes, titleID]);

        // Commit the transaction
        await connection.commit();
        connection.release(); // Release the connection back to the pool

        res.status(200).json({ message: 'Rating uploaded successfully' });
    } catch (error) {
        // If an error occurs, roll back the transaction
        await connection.rollback();
        connection.release();
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


exports.uploadRating = uploadRating;

async function getUserRatings(req, res) {
    const { userID } = req.params;
    const format = req.query.format; 
    const authenticatedUserID = req.user.userId;

    if (parseInt(authenticatedUserID, 10) !== parseInt(userID, 10)) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const ratingsQuery = `
            SELECT title_id, CAST(user_rating AS CHAR) AS user_rating
            FROM User_Title_Ratings
            WHERE user_id = ?;
        `;

        const [userRatings] = await pool.query(ratingsQuery, [userID]);

        if (format === 'csv') {
            // Convert to CSV
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(userRatings);

            res.header('Content-Type', 'text/csv');
            res.attachment('userRatings.csv');
            return res.send(csvData);
        } else {
            res.json({ userID, ratings: userRatings });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getUserRatings = getUserRatings;



async function deleteRating(req, res) {
    const { userID, titleID } = req.params;
    const authenticatedUserID = req.user.userId;

    const connection = await pool.getConnection();


    try {
        // Begin database transaction
        await connection.beginTransaction();

        if (parseInt(authenticatedUserID, 10) !== parseInt(userID, 10)) {
            connection.release();
            return res.status(401).json({ message: 'Unauthorized to delete this rating' });
        }

        // Fetch the rating to be deleted
        const ratingQuery = `SELECT user_rating FROM User_Title_Ratings WHERE user_id = ? AND title_id = ?`;
        const [ratingToDelete] = await connection.query(ratingQuery, [userID, titleID]);

        if (!ratingToDelete.length) {
            connection.release();
            return res.status(404).json({ message: 'Rating not found or already deleted' });
        }

        // Delete the rating
        const deleteQuery = `DELETE FROM User_Title_Ratings WHERE user_id = ? AND title_id = ?`;
        await connection.query(deleteQuery, [userID, titleID]);

        // Fetch the current average rating and number of votes
        const currentRatingQuery = `SELECT average_rating, num_votes FROM Titles WHERE title_id = ?`;
        const [currentRatings] = await connection.query(currentRatingQuery, [titleID]);

        if (currentRatings.length) {
            let { average_rating, num_votes } = currentRatings[0];
            const deletedRating = ratingToDelete[0].user_rating;

            // Recalculate the average rating and number of votes
            num_votes = num_votes - 1;
            average_rating = num_votes > 0 ? ((average_rating * (num_votes + 1)) - deletedRating) / num_votes : 0;

            // Update the titles table with the new average rating and number of votes
            const updateRatingQuery = `UPDATE Titles SET average_rating = ?, num_votes = ? WHERE title_id = ?`;
            await connection.query(updateRatingQuery, [average_rating, num_votes, titleID]);
        }

        // Commit transaction
        await connection.commit();
        connection.release();

        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        // Rollback transaction in case of error
        await connection.rollback();
        connection.release();
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


exports.deleteRating = deleteRating;

exports.getMovieRecommendations = async (req, res) => {
    const { genres, actors, director } = req.body;
    const format = req.query.format; 


    if (!genres || !actors || !director) {
        return res.status(400).json({ message: 'Missing required information' });
    }

    // ensure genres and actors are arrays of strings
    if (!Array.isArray(genres) || !Array.isArray(actors)) {
        return res.status(400).json({ message: 'Genres and actors should be arrays of strings' });
    }

    try {
        const allMovies = new Map();

        // Helper function to add movies to the Set
        const addMoviesToMap = (movies) => {
            movies.forEach(movie => {
                if (!allMovies.has(movie.title_id)) {
                    allMovies.set(movie.title_id, movie); // Add movie object with title_id as key
                }
            });
        };

        // For each genre, fetch top 10 movies and add to allMovies
        for (const genre of genres) {
            const genreQuery = `
                SELECT t.title_id, t.original_title, image_url_poster, t.average_rating, CAST(t.num_votes AS CHAR) AS num_votes
                FROM Titles t
                JOIN Title_genres tg ON t.title_id = tg.title_id
                WHERE LOWER(tg.genre) = LOWER(?)
                ORDER BY t.average_rating DESC
                LIMIT 10`;
            const [genreMovies] = await pool.query(genreQuery, [genre]);
            addMoviesToMap(genreMovies);
        }

        // For each actor, fetch top 10 movies and add to allMovies
        for (const actor of actors) {
            const actorQuery = `
                SELECT t.title_id, t.original_title, image_url_poster, t.average_rating, CAST(t.num_votes AS CHAR) AS num_votes
                FROM Titles t
                JOIN Principals p ON t.title_id = p.title_id
                WHERE p.name_id = ?
                ORDER BY t.average_rating DESC
                LIMIT 10`;
            const [actorMovies] = await pool.query(actorQuery, [actor]);
            addMoviesToMap(actorMovies);
        }

        // Fetch top 10 movies by director and add to allMovies
        const directorQuery = `
            SELECT t.title_id, t.original_title, image_url_poster, t.average_rating, CAST(t.num_votes AS CHAR) AS num_votes
            FROM Titles t
            JOIN Directors d ON t.title_id = d.title_id
            WHERE d.name_id = ?
            ORDER BY t.average_rating DESC
            LIMIT 10`;
        const [directorMovies] = await pool.query(directorQuery, [director]);
        addMoviesToMap(directorMovies);

      //if no movies found
        if (allMovies.size === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }

        if (format === 'csv') {
            const movies = Array.from(allMovies.values());
            const fields = ['title_id', 'original_title', 'image_url_poster', 'average_rating', 'num_votes'];
            const json2csvParser = new Parser({ fields });
            const csvData = json2csvParser.parse(movies);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=movies.csv');
            return res.send(csvData);
        } else {
            res.json({ movies: Array.from(allMovies.values()) });
        }    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
