const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadTitleBasics = async (req, res) => {
    if (!req.file ) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid file type' });
    }

    try {
        const filePath = req.file.path;
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const titles = [];
        const titleGenres = [];
        let isFirstLine = true;

        for await (const line of rl) {

            // Skip the header line
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const columns = line.split('\t').map(column => column === '\\N' ? null : column);

            const title = {
                title_id: columns[0] || null,
                title_type: columns[1] || null,
                primary_title: columns[2] || null,
                original_title: columns[3] || null, 
                is_adult: columns[4] || null,
                start_year: columns[5] || null,
                end_year: columns[6] || null,
                runtime_minutes: columns[7] || null,
                image_url_poster: columns[9] || null
            };
            
            titles.push(title);

            if (columns[8]) {
                const genres = columns[8].split(',');
                genres.forEach(genre => {
                    titleGenres.push({
                        title_id: columns[0],
                        genre: genre.trim()
                    });
                });
            }
        }

        // Insert the data into the database in a single transaction
        await insertData(titles, titleGenres);

        // Cleanup: delete the uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'File processed and data inserted successfully' });
    } catch (error) {
        console.error(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};



async function insertData(titles, titleGenres) {

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertTitleQuery = `INSERT INTO Titles (title_id, title_type, primary_title, original_title, is_adult, 
                                 start_year, end_year, runtime_minutes, image_url_poster) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;


        for (const title of titles) {
            await connection.query(insertTitleQuery, [
                title.title_id, title.title_type, title.primary_title, 
                title.original_title, title.is_adult, title.start_year, 
                title.end_year, title.runtime_minutes, title.image_url_poster
            ]);
        }

        const insertGenreQuery = `INSERT INTO Title_genres (title_id, genre) VALUES (?, ?)`;



        for (const titleGenre of titleGenres) {
            await connection.query(insertGenreQuery, [
                titleGenre.title_id, titleGenre.genre
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
