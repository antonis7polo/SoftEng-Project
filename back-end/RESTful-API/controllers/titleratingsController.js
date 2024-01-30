const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadTitleRatings = async (req, res) => {
    if (!req.file) {
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

        const titleRatings = [];
        let isFirstLine = true;

        for await (const line of rl) {

            // Skip the header line
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const columns = line.split('\t').map(column => column === '\\N' ? null : column);
            const titleRating = {
                title_id: columns[0] || null,
                average_rating: columns[1] || null,
                num_votes: columns[2] || null
            };
            
            titleRatings.push(titleRating);
        }

        // Insert the data into the database in a single transaction
        await insertData(titleRatings);

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

async function insertData(titleRatings) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert the title ratings
        const sql = 'UPDATE Titles SET average_rating = ?, num_votes = ? WHERE title_id = ?';

        for (const titleRating of titleRatings) {
            await connection.query(sql, [titleRating.average_rating, titleRating.num_votes, titleRating.title_id]);
        }

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}