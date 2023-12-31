const fs = require('fs');
const csv = require('csv-parser');
const { pool } = require('../utils/database'); // assuming this is your database pool

exports.uploadTitleBasics = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const filePath = req.file.path;
        const titles = [];
        const tilte_genres = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                // Process each row to match the Titles table structure
                const title = {
                    title_id: row.tconst,
                    title_type: row.titleType,
                    primary_title: row.primaryTitle,
                    original_title: row.originalTitle,
                    is_adult: row.isAdult,
                    start_year: row.startYear,
                    end_year: row.endYear,
                    runtime_minutes: row.runtimeMinutes,
                    img_url_asset: row.img_url_asset,
                };
                titles.push(title);

                //proccess genres 
                if(row.genres) {
                    const genres = row.genres.split(',');
                    for (const genre of genres) {
                     const title_genre = {
                            title_id: row.tconst,
                            genre: genre
                        };
                        tilte_genres.push(title_genre);
                    }
                }
            })
            .on('end', async () => {
                // Insert the data into the database
                await insertTitlesIntoDatabase(titles);
                await insertGenresIntoDatabase(tilte_genres);

            

                // Cleanup: delete the uploaded file
                fs.unlinkSync(filePath);

                res.status(200).json({ message: 'File processed and data inserted successfully' });
            });
    } catch (error) {
        console.error(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};

async function insertTitlesIntoDatabase(titles) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertQuery = `INSERT INTO Titles (title_id, title_type, primary_title, original_title, is_adult, 
                             start_year, end_year,average_rating,num_votes, runtime_minutes, img_url_asset) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        for (const title of titles) {
            await connection.query(insertQuery, [
                title.title_id, title.title_type, title.primary_title, 
                title.original_title, title.is_adult, title.start_year, 
                title.end_year, null, null, title.runtime_minutes, title.img_url_asset
            ]);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function insertGenresIntoDatabase(tilte_genres) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertQuery = `INSERT INTO Title_Genres (title_id, genre) VALUES (?, ?)`;

        for (const title_genre of tilte_genres) {
            await connection.query(insertQuery, [
                title_genre.title_id, title_genre.genre
            ]);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


