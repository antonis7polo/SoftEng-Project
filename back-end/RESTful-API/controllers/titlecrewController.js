const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadTitleCrew = async (req, res) => {
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

        const directorsData = [];
        const writersData = [];

        let isFirstLine = true;

        for await (const line of rl) {
                
            // Skip the header line
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }
    
            const columns = line.split('\t').map(column => column === '\\N' ? null : column);

    
            if (columns[1]) {
                const directors = columns[1].split(',');
                directors.forEach(director => {
                    directorsData.push({
                        title_id: columns[0],
                        director: director.trim()
                    });
                });
            }
    
            if (columns[2]) {
                const writers = columns[2].split(',');
                writers.forEach(writer => {
                    writersData.push({
                        title_id: columns[0],
                        writer: writer.trim()
                    });
                });
            }
        }

        // Insert the data into the database in a single transaction
        await insertData(directorsData, writersData);

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

async function insertData(directors, writers) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('SET FOREIGN_KEY_CHECKS=0');



        const sql1 = 'INSERT INTO Directors (title_id, name_id) VALUES (?, ?)';

        // Insert Directors
        for (const director of directors) {
            await connection.query(sql1, [director.title_id, director.director]);
        }

        // Insert Writers
        const sql2 = 'INSERT INTO Writers (title_id, name_id) VALUES (?, ?)';

        for (const writer of writers) {
            await connection.query(sql2, [writer.title_id, writer.writer]);
        }

        await connection.query('SET FOREIGN_KEY_CHECKS=1');


        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
