const fs = require('fs');
const readline = require('readline');
const { pool } = require('../utils/database');

exports.uploadTitlePrincipals = async (req, res) => {
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

        const principals = [];
        const hadRoles = [];
        let isFirstLine = true;


        for await (const line of rl) {

            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            const columns = line.split('\t').map(column => column === '\\N' ? null : column);


            const principal = {
                title_id: columns[0] || null,
                ordering: columns[1] || null,
                name_id: columns[2] || null,
                job_category: columns[3] || null,
                job: columns[4] || null,
                image_url: columns[6] || null // assuming the sixth column is image_url
            };

            principals.push(principal);

            if (columns[5]) {
                const characterNamesString = columns[5].slice(1, -1).replace(/""/g, '"').split(',');

                try {
                    // Parsing the string as JSON
                    const characterNamesArray = JSON.parse(characterNamesString);
        
                    characterNamesArray.forEach(characterNames => {
                        // Handling multiple names separated by comma in each JSON array element
                        characterNames.split(',').forEach(name => {
                            hadRoles.push({
                                title_id: columns[0],
                                name_id: columns[2],
                                role_: name.trim()
                            });
                        });
                    });
                } catch (error) {
                    console.error(`Error parsing character names: ${error.message}`);
                }
            }
        }

        await insertData(principals, hadRoles);

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

async function insertData(principals, hadRoles) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertPrincipalQuery = `INSERT INTO Principals (title_id, ordering, name_id, job_category, job, image_url) 
                                      VALUES (?, ?, ?, ?, ?, ?)`;
        for (const principal of principals) {
            await connection.query(insertPrincipalQuery, [
                principal.title_id, principal.ordering, principal.name_id, 
                principal.job_category, principal.job, principal.image_url
            ]);
        }

        const insertHadRoleQuery = `INSERT INTO Had_role (title_id, name_id, role_) VALUES (?, ?, ?)`;
        for (const role of hadRoles) {
            await connection.query(insertHadRoleQuery, [
                role.title_id, role.name_id, role.role_
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
