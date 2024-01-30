const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadTitleEpisode = async (req, res) => {
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

        const titleEpisodes = [];
        let isFirstLine = true;

        for await (const line of rl) {

            // Skip the header line
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const columns = line.split('\t').map(column => column === '\\N' ? null : column);
            const titleEpisode = {
                title_id: columns[0] || null,
                parent_title_id: columns[1] || null,
                season_number: columns[2] || null,
                episode_number: columns[3] || null
            };
            
            titleEpisodes.push(titleEpisode);
        }

        // Insert the data into the database in a single transaction
        await insertData(titleEpisodes);

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

async function insertData(titleEpisodes) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('SET FOREIGN_KEY_CHECKS=0');
        

        const sql = `INSERT INTO Episode_belongs_to
        (episode_title_id, parent_tv_show_title_id, season_number, episode_number)
        VALUES (?, ?, ?, ?)`;

        for (const titleEpisode of titleEpisodes) {
            await connection.query(sql, [titleEpisode.title_id, titleEpisode.parent_title_id, titleEpisode.season_number, titleEpisode.episode_number]);
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