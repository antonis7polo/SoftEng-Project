const pool = require('../utils/database').pool; 
const { Parser } = require('json2csv');

async function getTitleByID(req, res) {
    const { titleID } = req.params;
    const format = req.query.format; 

    try {
        // Main title information query
        const titleQuery = 'SELECT * FROM Titles WHERE title_id = ?';
        const [titleResult] = await pool.query(titleQuery, [titleID]);

        if (titleResult.length === 0) {
            return res.status(404).json({ message: 'Title not found' });
        }

        // Genres related to the title query
        const genresQuery = 'SELECT genre FROM Title_genres WHERE title_id = ?';
        const [genresResult] = await pool.query(genresQuery, [titleID]);

        // Aliases of the title query
        const aliasesQuery = 'SELECT title as akaTitle, region as regionAbbrev FROM Aliases WHERE title_id = ?';
        const [aliasesResult] = await pool.query(aliasesQuery, [titleID]);

        // Principals related to the title query
        const principalsQuery = `
            SELECT p.name_id as nameID, n.name_ as name, p.job_category as category
            FROM Principals AS p 
            JOIN Names_ AS n ON p.name_id = n.name_id 
            WHERE p.title_id = ?
        `;
        const [principalsResult] = await pool.query(principalsQuery, [titleID]);

        const titleObject = {
            titleID: titleResult[0].title_id,
            type: titleResult[0].title_type,
            originalTitle: titleResult[0].original_title,
            titlePoster: titleResult[0].image_url_poster, 
            startYear: titleResult[0].start_year ? titleResult[0].start_year.toString() : null,
            endYear: titleResult[0].end_year ? titleResult[0].end_year.toString() : null,
            genres: genresResult.map(g => ({ genreTitle: g.genre })), 
            titleAkas: aliasesResult, 
            principals: principalsResult, 
            rating: {
                avRating: titleResult[0].average_rating, 
                nVotes: titleResult[0].num_votes ? titleResult[0].num_votes.toString() : "0"
            }
        };

        if (format === 'csv') {
            const csvFriendlyTitleObject = {
                ...titleObject,
                genres: titleObject.genres.map(g => g.genreTitle).join('; '),
                titleAkas: titleObject.titleAkas.map(a => `title: ${a.akaTitle}, region: ${a.regionAbbrev}`).join('; '),
                principals: titleObject.principals.map(p => `nameID: ${p.nameID}, name: ${p.name}, category: ${p.category}`).join('; '),
                avRating: titleObject.rating.avRating,
                nVotes: titleObject.rating.nVotes
            };

            delete csvFriendlyTitleObject.rating;

            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse([csvFriendlyTitleObject]);
        
            res.header('Content-Type', 'text/csv');
            res.attachment('titleObject.csv');
            return res.send(csvData);
        }
        else {
            res.json({ titleObject });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getTitleByID = getTitleByID;

async function searchTitleByPart(req, res) {
    const { titlePart } = req.body; 
    const format = req.query.format;
    
    try {
        if (!titlePart || typeof titlePart !== 'string') {
            return res.status(400).json({ message: 'No title part provided' });
        }

        // Query to search titles by part of their name
        const searchQuery = 'SELECT * FROM Titles WHERE LOWER(original_title) LIKE LOWER(?)';
        const likeTitlePart = `%${titlePart.toLowerCase()}%`; 
        const [searchResults] = await pool.query(searchQuery, [likeTitlePart]);

        if (searchResults.length === 0) {
            return res.status(404).json({ message: 'No titles found' });
        }

        const titleObjects = await Promise.all(searchResults.map(async (title) => {

            const [genresResult] = await pool.query('SELECT genre FROM Title_genres WHERE title_id = ?', [title.title_id]);

            const [aliasesResult] = await pool.query('SELECT title as akaTitle, region as regionAbbrev FROM Aliases WHERE title_id = ?', [title.title_id]);

            const [principalsResult] = await pool.query(`
                SELECT p.name_id as nameID, n.name_ as name, p.job_category as category
                FROM Principals AS p 
                JOIN Names_ AS n ON p.name_id = n.name_id 
                WHERE p.title_id = ?
            `, [title.title_id]);


            return {
                titleID: title.title_id,
                type: title.title_type,
                originalTitle: title.original_title,
                titlePoster: title.image_url_poster, 
                startYear : title.start_year ? title.start_year.toString() : null,
                endYear: title.end_year ? title.end_year.toString() : null,
                genres: genresResult.map(g => ({ genreTitle: g.genre })),
                titleAkas: aliasesResult,
                principals: principalsResult, 
                rating: {
                    avRating: title.average_rating, 
                    nVotes: title.num_votes ? title.num_votes.toString() : "0"
                }
            };
        }));

        const csvFriendlyTitleObjects = titleObjects.map(titleObject => {
            const flattenedObject = {
                ...titleObject,
                genres: titleObject.genres.map(g => g.genreTitle).join('; '),
                titleAkas: titleObject.titleAkas.map(a => `title: ${a.akaTitle}, region: ${a.regionAbbrev}`).join('; '),
                principals: titleObject.principals.map(p => `nameID: ${p.nameID}, name: ${p.name}, category: ${p.category}`).join('; '),
                avRating: titleObject.rating.avRating,
                nVotes: titleObject.rating.nVotes
            };
            delete flattenedObject.rating; // Remove the original rating object here
            return flattenedObject;
        });
        
        if (format === 'csv') {
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(csvFriendlyTitleObjects);
        
            res.header('Content-Type', 'text/csv');
            res.attachment('titleObjects.csv');
            return res.send(csvData);
        }
        else {
            res.json({ titleObjects });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.searchTitleByPart = searchTitleByPart;

async function getTitlesByGenre(req, res) {
    const { qgenre, minrating, yrFrom, yrTo } = req.body;

    if (!qgenre || !minrating) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }

    const minRatingFloat = parseFloat(minrating);
    if (isNaN(minRatingFloat)) {
        return res.status(400).json({ message: 'Invalid minrating' });
    }

    
    const format = req.query.format;
    try {
        const minRatingFloat = parseFloat(minrating);
        let mainQuery = `
            SELECT 
                t.title_id,
                t.title_type,
                t.original_title,
                t.image_url_poster,
                t.start_year,
                t.end_year,
                t.average_rating,
                t.num_votes
            FROM 
                Titles t
            JOIN 
                Title_genres g ON t.title_id = g.title_id
            WHERE 
                LOWER(g.genre) = LOWER(?)
            AND 
                t.average_rating >= ?
        `;

        let mainParams = [qgenre, minRatingFloat];
        
        
        // Add conditions for year range if provided
        if (yrFrom && yrTo) {
            const yrFromInt = parseInt(yrFrom, 10);
            const yrToInt = parseInt(yrTo, 10);
            if (!isNaN(yrFromInt) && !isNaN(yrToInt)) {
                mainQuery += 'AND t.start_year BETWEEN ? AND ? ';
                mainParams.push(yrFromInt, yrToInt);
            }
            else{
                return res.status(400).json({ message: 'Invalid year range' });
            }
        } else if (yrFrom) {
            const yrFromInt = parseInt(yrFrom, 10);
            if (!isNaN(yrFromInt)) {
                mainQuery += 'AND t.start_year >= ? ';
                mainParams.push(yrFromInt);
            }
            else{
                return res.status(400).json({ message: 'Invalid year range' });
            }
        } else if (yrTo) {
            const yrToInt = parseInt(yrTo, 10);
            if (!isNaN(yrToInt)) {
                mainQuery += 'AND t.start_year <= ? ';
                mainParams.push(yrToInt);
            }
            else{
                return res.status(400).json({ message: 'Invalid year range' });
            }
        }

        const [titles] = await pool.query(mainQuery, mainParams);

        if (titles.length === 0) {
            return res.status(404).json({ message: 'No titles found' });
        }

        const titleObjects = await Promise.all(titles.map(async (title) => {
            // Subquery for genres
            const genresQuery = 'SELECT genre FROM Title_genres WHERE title_id = ?';
            const [genresResult] = await pool.query(genresQuery, [title.title_id]);

            // Subquery for aliases
            const aliasesQuery = 'SELECT title as akaTitle, region as regionAbbrev FROM Aliases WHERE title_id = ?';
            const [aliasesResult] = await pool.query(aliasesQuery, [title.title_id]);

            // Subquery for principals
            const principalsQuery = `
                SELECT p.name_id as nameID, n.name_ as name, p.job_category as category
                FROM Principals p
                JOIN Names_ n ON p.name_id = n.name_id
                WHERE p.title_id = ?
            `;
            const [principalsResult] = await pool.query(principalsQuery, [title.title_id]);

            return {
                titleID: title.title_id,
                type: title.title_type,
                originalTitle: title.original_title,
                titlePoster: title.image_url_poster,
                startYear: title.start_year ? title.start_year.toString() : null,
                endYear: title.end_year ? title.end_year.toString() : null,
                genres: genresResult.map(g => ({ genreTitle: g.genre })),
                titleAkas: aliasesResult,
                principals: principalsResult,
                rating: {
                    avRating: title.average_rating,
                    nVotes: title.num_votes ? title.num_votes.toString() : "0"
                }
            };
        }));

        const csvFriendlyTitleObjects = titleObjects.map(titleObject => {
            const flattenedObject = {
                ...titleObject,
                genres: titleObject.genres.map(g => g.genreTitle).join('; '),
                titleAkas: titleObject.titleAkas.map(a => `title: ${a.akaTitle}, region: ${a.regionAbbrev}`).join('; '),
                principals: titleObject.principals.map(p => `nameID: ${p.nameID}, name: ${p.name}, category: ${p.category}`).join('; '),
                avRating: titleObject.rating.avRating,
                nVotes: titleObject.rating.nVotes
            };
            delete flattenedObject.rating; // Remove the original rating object
            return flattenedObject;
        });
        
        if (format === 'csv') {
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(csvFriendlyTitleObjects);
            res.header('Content-Type', 'text/csv');
            res.attachment('titleObjects.csv');
            return res.send(csvData);
        } else {
            res.json({ titleObjects });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getTitlesByGenre = getTitlesByGenre;


exports.getTitleDetails = async (req, res) => {
    const { titleID } = req.params;
    const format = req.query.format;

    try {
        // Query to get the top two genres
        const genresQuery = `
            SELECT genre 
            FROM Title_genres 
            WHERE title_id = ?
            LIMIT 2`;
        const [genresResult] = await pool.query(genresQuery, [titleID]);

        // Query to get the top two actors/actresses based on ordering
        const actorsQuery = `
            SELECT name_id
            FROM Principals 
            WHERE title_id = ? AND job_category IN ('actor', 'actress')
            ORDER BY ordering ASC
            LIMIT 2`;
        const [actorsResult] = await pool.query(actorsQuery, [titleID]);

        const directorsQuery = `
            SELECT name_id 
            FROM Directors 
            WHERE title_id = ?`;
        const [directorsResult] = await pool.query(directorsQuery, [titleID]);

        if (genresResult.length === 0 && actorsResult.length === 0 && directorsResult.length === 0) {
            return res.status(404).json({ message: 'No details found for the specified title or no such title' });
        }

        // Construct the response object
        const titleDetails = {
            titleID,
            genres: genresResult.map(g => ({ genreTitle: g.genre})),
            leadActors: actorsResult.map(a => ({ nameID: a.name_id })),
            directors: directorsResult.map(d => ({ nameID: d.name_id }))
        };
        
        if (format === 'csv') {
            const csvFriendlyTitleDetails = {
                titleID,
                genres: genresResult.map(g => g.genre).join('; '),
                leadActors: actorsResult.map(a => a.name_id).join('; '),
                directors: directorsResult.map(d => d.name_id).join('; ')
            };
        
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse([csvFriendlyTitleDetails]);
            res.header('Content-Type', 'text/csv');
            res.attachment('titleDetails.csv');
            return res.send(csvData);
        } else {
            res.json({ titleDetails });
        }
        

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getHomepageData = async (req, res) => {
    const format = req.query.format;
    try {
        const data = {
            topRatedMovies: [],
            newReleases: [],
            popularInAction: [] ,
            popularInComedy: [],
            popularInDrama: [],
            popularInRomance: [],
            popularInThriller: [],
            popularInHorror: [],
            popularInDocumentary: [],
            popularInAdventure: []

        };

        // Query for top rated movies
        const topRatedMoviesQuery = `
            SELECT title_id as titleID FROM Titles
            WHERE title_type = 'movie' or title_type = 'short'
            ORDER BY average_rating DESC
            LIMIT 20;
        `;
        const [topRatedMovies] = await pool.query(topRatedMoviesQuery);
        data.topRatedMovies = topRatedMovies;


        // Query for new releases
        const newReleasesQuery = `
            SELECT title_id as titleID FROM Titles
            ORDER BY start_year DESC, average_rating DESC
            LIMIT 20;
        `;
        const [newReleases] = await pool.query(newReleasesQuery);
        data.newReleases = newReleases;

        // Query for popular movies in a specific genre (e.g., Action)
        const popularInActionQuery = `
            SELECT t.title_id as titleID FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Action'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;
        const [popularInAction] = await pool.query(popularInActionQuery);
        data.popularInAction = popularInAction;

        const popularInComedyQuery = `
            SELECT t.title_id as titleID  FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Comedy'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;

        const [popularInComedy] = await pool.query(popularInComedyQuery);   
        data.popularInComedy = popularInComedy;

        const popularInDramaQuery = `
            SELECT t.title_id as titleID  FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Drama'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;

        const [popularInDrama] = await pool.query(popularInDramaQuery);
        data.popularInDrama = popularInDrama;

        const popularInRomanceQuery = `
            SELECT t.title_id as titleID  FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Romance'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;

        const [popularInRomance] = await pool.query(popularInRomanceQuery);
        data.popularInRomance = popularInRomance;

        const popularInThrillerQuery = `
            SELECT t.title_id as titleID  FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Thriller'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;

        const [popularInThriller] = await pool.query(popularInThrillerQuery);
        data.popularInThriller = popularInThriller;

        const popularInHorrorQuery = `
            SELECT t.title_id as titleID  FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Horror'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;
        const [popularInHorror] = await pool.query(popularInHorrorQuery);
        data.popularInHorror = popularInHorror;

        const popularInDocumentaryQuery = `
            SELECT t.title_id as titleID FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Documentary'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;

        const [popularInDocumentary] = await pool.query(popularInDocumentaryQuery);
        data.popularInDocumentary = popularInDocumentary;

        const popularInAdventureQuery = `
            SELECT t.title_id as titleID  FROM Titles t
            JOIN Title_genres tg ON t.title_id = tg.title_id
            WHERE tg.genre = 'Adventure'
            ORDER BY t.average_rating DESC
            LIMIT 10;
        `;
        const [popularInAdventure] = await pool.query(popularInAdventureQuery);
        data.popularInAdventure = popularInAdventure;

        if (format === 'csv') {
            const flattenedData = {
                topRatedMovies: data.topRatedMovies.map(movie => movie.titleID).join('; '),
                newReleases: data.newReleases.map(release => release.titleID).join('; '),
                popularInAction: data.popularInAction.map(movie => movie.titleID).join('; '),
                popularInComedy: data.popularInComedy.map(movie => movie.titleID).join('; '),
                popularInDrama: data.popularInDrama.map(movie => movie.titleID).join('; '),
                popularInRomance: data.popularInRomance.map(movie => movie.titleID).join('; '),
                popularInThriller: data.popularInThriller.map(movie => movie.titleID).join('; '),
                popularInHorror: data.popularInHorror.map(movie => movie.titleID).join('; '),
                popularInDocumentary: data.popularInDocumentary.map(movie => movie.titleID).join('; '),
                popularInAdventure: data.popularInAdventure.map(movie => movie.titleID).join('; ')                
            };
        
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse([flattenedData]);
            res.header('Content-Type', 'text/csv');
            res.attachment('homepageData.csv');
            return res.send(csvData);
        } else {
            res.json({ data });
        }
        
        
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getAllTvShowsEpisodes = async (req, res) => {
    const format = req.query.format;

    try {
        // Query to get all episodes along with their TV show and season information
        const episodesQuery = `
            SELECT t.title_id AS episode_title_id, t.original_title AS episode_title, e.parent_tv_show_title_id, CAST(e.season_number AS CHAR) AS season_number, CAST(e.episode_number AS CHAR) AS episode_number
            FROM Episode_belongs_to e
            JOIN Titles t ON e.episode_title_id = t.title_id
            ORDER BY e.parent_tv_show_title_id, e.season_number, e.episode_number;
        `;
        const [episodesResult] = await pool.query(episodesQuery);

        // Grouping episodes by TV show and then by season
        const shows = episodesResult.reduce((acc, episode) => {
            if (!acc[episode.parent_tv_show_title_id]) {
                acc[episode.parent_tv_show_title_id] = {};
            }
            if (!acc[episode.parent_tv_show_title_id][episode.season_number]) {
                acc[episode.parent_tv_show_title_id][episode.season_number] = [];
            }
            acc[episode.parent_tv_show_title_id][episode.season_number].push(episode);
            return acc;
        }, {});

        if (format === 'csv') {
            const flattenedEpisodes = episodesResult.map(episode => ({
                episode_title_id: episode.episode_title_id,
                episode_title: episode.episode_title,
                parent_tv_show_title_id: episode.parent_tv_show_title_id,
                season_number: episode.season_number,
                episode_number: episode.episode_number
            }));
        
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse(flattenedEpisodes);
            res.header('Content-Type', 'text/csv');
            res.attachment('allTvShowsEpisodes.csv');
            return res.send(csvData);
        } else {
            res.json({ shows });
        }
        

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





