const { pool } = require('../utils/database'); 
const { Parser } = require('json2csv');


async function uploadRating(req, res) {
    const {userID,titleID, userRating } = req.body;
    const authenticatedUserID = req.user.userId; 
    if (parseInt(authenticatedUserID, 10) !== parseInt(userID, 10)) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if the rating already exists
        const existingRatingQuery = `SELECT user_rating FROM user_title_ratings WHERE user_id = ? AND title_id = ?`;
        const [existingRating] = await connection.query(existingRatingQuery, [authenticatedUserID, titleID]);

        // Retrieve the current average rating and number of votes
        const currentRatingQuery = `SELECT average_rating, num_votes FROM titles WHERE title_id = ?`;
        const [currentRatingData] = await connection.query(currentRatingQuery, [titleID]);
        let currentAverage = currentRatingData[0]?.average_rating || 0;
        let currentNumVotes = currentRatingData[0]?.num_votes || 0;

        // Insert or update the rating
        if (existingRating.length > 0) {
            // Rating exists, update it
            const oldUserRating = existingRating[0].user_rating;
            const updateRatingQuery = `UPDATE user_title_ratings SET user_rating = ? WHERE user_id = ? AND title_id = ?`;
            await connection.query(updateRatingQuery, [userRating, authenticatedUserID, titleID]);

            // Update the average rating (considering the old rating)
            currentAverage = ((currentAverage * currentNumVotes) - oldUserRating + userRating) / currentNumVotes;
        } else {
            // Rating does not exist, insert new rating
            const insertRatingQuery = `INSERT INTO user_title_ratings (user_id, title_id, user_rating) VALUES (?, ?, ?)`;
            await connection.query(insertRatingQuery, [authenticatedUserID, titleID, userRating]);

            // Update the average rating (considering this as a new rating)
            currentNumVotes += 1;
            currentAverage = ((currentAverage * (currentNumVotes - 1)) + userRating) / currentNumVotes;
        }

        // Update the titles table with the new average and new number of votes
        const updateTitleRatingQuery = `UPDATE titles SET average_rating = ?, num_votes = ? WHERE title_id = ?`;
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
            FROM user_title_ratings
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

    try {
        // Begin database transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        if (parseInt(authenticatedUserID, 10) !== parseInt(userID, 10)) {
            connection.release();
            return res.status(401).json({ message: 'Unauthorized to delete this rating' });
        }

        // Fetch the rating to be deleted
        const ratingQuery = `SELECT user_rating FROM user_title_ratings WHERE user_id = ? AND title_id = ?`;
        const [ratingToDelete] = await connection.query(ratingQuery, [userID, titleID]);

        if (!ratingToDelete.length) {
            connection.release();
            return res.status(404).json({ message: 'Rating not found or already deleted' });
        }

        // Delete the rating
        const deleteQuery = `DELETE FROM user_title_ratings WHERE user_id = ? AND title_id = ?`;
        await connection.query(deleteQuery, [userID, titleID]);

        // Fetch the current average rating and number of votes
        const currentRatingQuery = `SELECT average_rating, num_votes FROM titles WHERE title_id = ?`;
        const [currentRatings] = await connection.query(currentRatingQuery, [titleID]);

        if (currentRatings.length) {
            let { average_rating, num_votes } = currentRatings[0];
            const deletedRating = ratingToDelete[0].user_rating;

            // Recalculate the average rating and number of votes
            num_votes = num_votes - 1;
            average_rating = num_votes > 0 ? ((average_rating * (num_votes + 1)) - deletedRating) / num_votes : 0;

            // Update the titles table with the new average rating and number of votes
            const updateRatingQuery = `UPDATE titles SET average_rating = ?, num_votes = ? WHERE title_id = ?`;
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
                FROM titles t
                JOIN title_genres tg ON t.title_id = tg.title_id
                WHERE tg.genre = ?
                ORDER BY t.average_rating DESC
                LIMIT 10`;
            const [genreMovies] = await pool.query(genreQuery, [genre]);
            addMoviesToMap(genreMovies);
        }

        // For each actor, fetch top 10 movies and add to allMovies
        for (const actor of actors) {
            const actorQuery = `
                SELECT t.title_id, t.original_title, image_url_poster, t.average_rating, CAST(t.num_votes AS CHAR) AS num_votes
                FROM titles t
                JOIN principals p ON t.title_id = p.title_id
                WHERE p.name_id = ?
                ORDER BY t.average_rating DESC
                LIMIT 10`;
            const [actorMovies] = await pool.query(actorQuery, [actor]);
            addMoviesToMap(actorMovies);
        }

        // Fetch top 10 movies by director and add to allMovies
        const directorQuery = `
            SELECT t.title_id, t.original_title, image_url_poster, t.average_rating, CAST(t.num_votes AS CHAR) AS num_votes
            FROM titles t
            JOIN directors d ON t.title_id = d.title_id
            WHERE d.name_id = ?
            ORDER BY t.average_rating DESC
            LIMIT 10`;
        const [directorMovies] = await pool.query(directorQuery, [director]);
        addMoviesToMap(directorMovies);

      res.json({ movies: Array.from(allMovies.values()) });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
