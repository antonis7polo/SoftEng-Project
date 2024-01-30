const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadTitleAkas = async (req, res) => {
    if(!req.file) {
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

        const titleAkas = [];
        const aliasTypes = [];
        let isFirstLine = true;

        for await (const line of rl) {

            // Skip the header line
            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const columns = line.split('\t').map(column => column === '\\N' ? null : column);
            
            const titleAka = {
                title_id: columns[0] || null,
                ordering: columns[1] || null,
                title: columns[2] || null,
                region: columns[3] || null, 
                language: columns[4] || null,
                types: columns[5] || null,
                attributes: columns[6] || null,
                is_original_title: columns[7] || null
            };
            
            titleAkas.push(titleAka);
        }

        // Insert the data into the database in a single transaction
        await insertData(titleAkas);

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

async function insertData(titleAkas) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertAliasesQuery = 'INSERT INTO Aliases (title_id, ordering, title, region, language, type, attribute, is_original_title) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        for (const titleAka of titleAkas) {
            await connection.query(insertAliasesQuery, [titleAka.title_id, titleAka.ordering, titleAka.title, titleAka.region, titleAka.language, titleAka.types, titleAka.attributes, titleAka.is_original_title]);
        }

        await connection.commit();

    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
