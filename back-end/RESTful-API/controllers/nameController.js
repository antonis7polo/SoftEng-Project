const pool = require('../utils/database').pool;

async function getNameByID(req, res) {
    const { nameID } = req.params;

    try {
        const personQuery = `
            SELECT 
                n.name_id, 
                n.name_, 
                n.image_url as namePoster, 
                n.birth_year as birthYr, 
                n.death_year as deathYr,
                GROUP_CONCAT(nwa.profession ORDER BY nwa.profession SEPARATOR ',') as profession
            FROM 
                names_ n
            LEFT JOIN 
                Name_worked_as nwa ON n.name_id = nwa.name_id
            WHERE 
                n.name_id = ?
            GROUP BY 
                n.name_id;
        `;

        // Query to get the titles related to the person
        const titlesQuery = `
            SELECT 
                p.title_id,
                p.job_category as category
            FROM 
                principals p
            WHERE 
                p.name_id = ?
            ;
        `;

        const [personResult] = await pool.query(personQuery, [nameID]);
        const [titlesResult] = await pool.query(titlesQuery, [nameID]);

        if (personResult.length === 0) {
            return res.status(404).json({ message: 'Person not found' });
        }

        // Construct the nameObject with related titles
        const nameObject = {
            nameID: personResult[0].name_id,
            name: personResult[0].name_,
            namePoster: personResult[0].namePoster,
            birthYr: personResult[0].birthYr,
            deathYr: personResult[0].deathYr,
            profession: personResult[0].profession ? personResult[0].profession : '', // Default to empty string if no professions
            nameTitles: titlesResult.map(title => ({
                titleID: title.title_id,
                category: title.category
            }))
        };

        res.json({ nameObject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getNameByID = getNameByID;

async function searchName(req, res) {
    const { namePart } = req.body;

    try {
        const searchQuery = `
            SELECT 
                n.name_id, 
                n.name_, 
                n.image_url as namePoster, 
                n.birth_year as birthYr, 
                n.death_year as deathYr
            FROM 
                names_ n
            WHERE 
                LOWER(n.name_) LIKE LOWER(?)
        `;

        const likeNamePart = `%${namePart.toLowerCase()}%`;
        const [peopleResults] = await pool.query(searchQuery, [likeNamePart]);

        if (peopleResults.length === 0) {
            return res.status(404).json({ message: 'No matching names found' });
        }

        // For each person found, get their professions and titles
        const nameObjectsPromises = peopleResults.map(async person => {
            // Subquery for professions
            const professionQuery = `
                SELECT 
                    GROUP_CONCAT(profession ORDER BY profession SEPARATOR ',') as profession
                FROM 
                    Name_worked_as
                WHERE 
                    name_id = ?
                GROUP BY 
                    name_id;
            `;
            const [professionResults] = await pool.query(professionQuery, [person.name_id]);

            // Subquery for titles
            const titlesQuery = `
                SELECT 
                    p.title_id,
                    p.job_category as category
                FROM 
                    principals p
                WHERE 
                    p.name_id = ?
            `;
            const [titlesResults] = await pool.query(titlesQuery, [person.name_id]);

            return {
                nameID: person.name_id,
                name: person.name_,
                namePoster: person.namePoster,
                birthYr: person.birthYr,
                deathYr: person.deathYr,
                profession: professionResults[0] ? professionResults[0].profession : '', 
                nameTitles: titlesResults.map(title => ({
                    titleID: title.title_id,
                    category: title.category
                }))
            };
        });

        const nameObjects = await Promise.all(nameObjectsPromises);

        res.json({ nameObjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.searchName = searchName;