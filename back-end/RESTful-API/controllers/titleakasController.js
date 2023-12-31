const fs = require('fs');
const csv = require('csv-parser');

exports.uploadTitleAkas = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const filePath = req.file.path;
        const aliases = [];
        const aliasAttributes = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                const alias = {
                    title_id: row.titleId,
                    ordering: row.ordering,
                    title: row.title,
                    region: row.region,
                    language: row.language,
                    is_original_title: row.isOriginalTitle
                };
                aliases.push(alias);

                if (row.attributes) {
                    const attribute = {
                        title_id: row.titleId,
                        ordering: row.ordering,
                        attribute: row.attributes
                    };
                    aliasAttributes.push(attribute);
                }
            })
            .on('end', async () => {
                await insertAliasesIntoDatabase(aliases);
                await insertAliasAttributesIntoDatabase(aliasAttributes);

                fs.unlinkSync(filePath);

                res.status(200).json({ message: 'Title Akas processed and data inserted successfully' });
            });
    } catch (error) {
        console.error(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};

async function insertAliasesIntoDatabase(aliases) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertAliasQuery = `INSERT INTO Aliases (title_id, ordering, title, region, language, is_original_title) VALUES (?, ?, ?, ?, ?, ?)`;

        for (const alias of aliases) {
            await connection.query(insertAliasQuery, [
                alias.title_id, 
                alias.ordering, 
                alias.title, 
                alias.region, 
                alias.language, 
                alias.is_original_title === '1' ? true : false // Assuming is_original_title is a boolean in the database
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

async function insertAliasAttributesIntoDatabase(aliasAttributes) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const insertAttributeQuery = `INSERT INTO Alias_attributes (title_id, ordering, attribute) VALUES (?, ?, ?)`;

        for (const attribute of aliasAttributes) {
            await connection.query(insertAttributeQuery, [
                attribute.title_id, 
                attribute.ordering, 
                attribute.attribute
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
