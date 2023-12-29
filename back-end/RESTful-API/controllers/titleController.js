const pool = require('../utils/database').pool; 

async function getTitleByID(req, res) {
    const { titleID } = req.params;

    try {
        // Main title information query
        const titleQuery = 'SELECT * FROM titles WHERE title_id = ?';
        const [titleResult] = await pool.query(titleQuery, [titleID]);

        if (titleResult.length === 0) {
            return res.status(404).json({ message: 'Title not found' });
        }

        // Genres related to the title query
        const genresQuery = 'SELECT genre FROM title_genres WHERE title_id = ?';
        const [genresResult] = await pool.query(genresQuery, [titleID]);

        // Aliases of the title query
        const aliasesQuery = 'SELECT title as akaTitle, region as regionAbbrev FROM aliases WHERE title_id = ?';
        const [aliasesResult] = await pool.query(aliasesQuery, [titleID]);

        // Principals related to the title query
        const principalsQuery = `
            SELECT p.name_id, n.name_ as name, p.job_category as category
            FROM principals AS p 
            JOIN names_ AS n ON p.name_id = n.name_id 
            WHERE p.title_id = ?
        `;
        const [principalsResult] = await pool.query(principalsQuery, [titleID]);

        const titleObject = {
            titleID: titleResult[0].title_id,
            type: titleResult[0].title_type,
            originalTitle: titleResult[0].original_title,
            titlePoster: titleResult[0].image_url_poster, 
            startYear : titleResult[0].start_year,
            endYear: titleResult[0].end_year,
            genres: genresResult.map(g => ({ genreTitle: g.genre })), 
            titleAkas: aliasesResult, 
            principals: principalsResult, 
            rating: {
                avRating: titleResult[0].average_rating, 
                nVotes: titleResult[0].num_votes 
            }
        };

        res.json({ titleObject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTitleByID = getTitleByID;

async function searchTitleByPart(req, res) {
    const { titlePart } = req.body; 

    try {
        if (!titlePart) {
            return res.status(400).json({ message: 'No title part provided' });
        }

        // Query to search titles by part of their name
        const searchQuery = 'SELECT * FROM titles WHERE LOWER(original_title) LIKE LOWER(?)';
        const likeTitlePart = `%${titlePart.toLowerCase()}%`; 
        const [searchResults] = await pool.query(searchQuery, [likeTitlePart]);

        if (searchResults.length === 0) {
            return res.status(404).json({ message: 'No titles found' });
        }

        const titleObjects = await Promise.all(searchResults.map(async (title) => {

            const [genresResult] = await pool.query('SELECT genre FROM title_genres WHERE title_id = ?', [title.title_id]);

            const [aliasesResult] = await pool.query('SELECT title as akaTitle, region as regionAbbrev FROM aliases WHERE title_id = ?', [title.title_id]);

            const [principalsResult] = await pool.query(`
                SELECT p.name_id, n.name_ as name, p.job_category as category
                FROM principals AS p 
                JOIN names_ AS n ON p.name_id = n.name_id 
                WHERE p.title_id = ?
            `, [title.title_id]);


            return {
                titleID: title.title_id,
                type: title.title_type,
                originalTitle: title.original_title,
                titlePoster: title.image_url_poster, 
                startYear : title.start_year,
                endYear: title.end_year,
                genres: genresResult.map(g => ({ genreTitle: g.genre })),
                titleAkas: aliasesResult,
                principals: principalsResult, 
                rating: {
                    avRating: title.average_rating, 
                    nVotes: title.num_votes
                }
            };
        }));

        res.json({ titleObjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.searchTitleByPart = searchTitleByPart;


