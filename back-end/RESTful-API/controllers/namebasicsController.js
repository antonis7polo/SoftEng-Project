const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadNameBasics = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid file type' });
    }

    const batchSize = 300000; // Adjust the batch size as needed
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let names = [];
    let nameProfessions = [];
    let nameKnownForTitles = [];
    let isFirstLine = true;

    const insertData = async () => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('SET FOREIGN_KEY_CHECKS=0');


            // Insert Names
            if (names.length > 0) {
                const namesQuery = 'INSERT INTO Names_ (name_id, name_, birth_year, death_year, image_url) VALUES ?';
                await connection.query(namesQuery, [names.map(name => [name.name_id, name.primary_name, name.birth_year, name.death_year, name.image_url])]);
            }



            // Insert Name Professions
            if (nameProfessions.length > 0) {
                const professionsQuery = 'INSERT INTO Name_worked_as (name_id, profession) VALUES ?';
                await connection.query(professionsQuery, [nameProfessions.map(profession => [profession.name_id, profession.profession])]);
            }



            // Insert Known For Titles
            if (nameKnownForTitles.length > 0) {
                const titlesQuery = 'INSERT INTO Known_for (name_id, title_id) VALUES ?';
                await connection.query(titlesQuery, [nameKnownForTitles.map(title => [title.name_id, title.title_id])]);
            }

            await connection.query('SET FOREIGN_KEY_CHECKS=1');


            await connection.commit();


        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    };

    try {
        for await (const line of rl) {
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const columns = line.split('\t').map(column => column === '\\N' ? null : column);
            
            const name = {
                name_id: columns[0],
                primary_name: columns[1],
                birth_year: columns[2],
                death_year: columns[3],
                image_url: columns[6]
            };
            names.push(name);

            if (columns[4]) {
                const professions = columns[4].split(',');
                professions.forEach(profession => {
                    nameProfessions.push({
                        name_id: columns[0],
                        profession: profession.trim()
                    });
                });
            }

            if (columns[5]) {
                const knownForTitles = columns[5].split(',');
                knownForTitles.forEach(title => {
                    nameKnownForTitles.push({
                        name_id: columns[0],
                        title_id: title.trim()
                    });
                });
            }

            // Insert in batches
            if (names.length >= batchSize) {
                await insertData();
                names = [];
                nameProfessions = [];
                nameKnownForTitles = [];
            }
        }

        // Insert any remaining data that didn't meet the batch size
        if (names.length > 0 || nameProfessions.length > 0 || nameKnownForTitles.length > 0) {
            await insertData();
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'File processed and data inserted successfully' });
    } catch (error) {
        console.error(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'failed', error: error.message });
    }
};
