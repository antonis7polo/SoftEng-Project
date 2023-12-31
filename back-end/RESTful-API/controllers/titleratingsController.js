const fs = require('fs');
const csv = require('csv-parser');

exports.uploadTitleRatings = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const filePath = req.file.path;
        const titleRatings = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                if (row.tconst && row.averageRating && row.numVotes) {
                    titleRatings.push({
                        title_id: row.tconst,
                        average_rating: parseFloat(row.averageRating),
                        num_votes: parseInt(row.numVotes, 10)
                    });
                }
            })
            .on('end', async () => {
                await updateTitleRatingsInDatabase(titleRatings);
                fs.unlinkSync(filePath);
                res.status(200).json({ message: 'Ratings updated successfully' });
            });
    } catch (error) {
        console.error(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};

async function updateTitleRatingsInDatabase(titleRatings) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const updateQuery = `UPDATE Titles 
                             SET average_rating = ?, num_votes = ? 
                             WHERE title_id = ? AND average_rating IS NULL`;

        for (const rating of titleRatings) {
            await connection.query(updateQuery, [rating.average_rating, rating.num_votes, rating.title_id]);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

