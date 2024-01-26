const { pool } = require('../utils/database');

const resetallController = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Truncate all data from the tables
        await connection.query('DELETE FROM aliases');
        await connection.query('DELETE FROM directors');
        await connection.query('DELETE FROM episode_belongs_to');
        await connection.query('DELETE FROM had_role');
        await connection.query('DELETE FROM known_for');
        await connection.query('DELETE FROM name_worked_as');
        await connection.query('DELETE FROM principals');
        await connection.query('DELETE FROM title_genres');
        await connection.query('DELETE FROM user_title_ratings');
        await connection.query('DELETE FROM writers');
        await connection.query('DELETE FROM names_');
        await connection.query('DELETE FROM titles');

        await connection.commit();

        res.status(200).json({ status: "OK" });
    } catch (error) {
        console.error("Error in resetallController:", error);
        if (connection) await connection.rollback();
        res.status(500).json({ status: "failed", reason: error.message });
    } finally {
        if (connection) connection.release();
    }
};

exports.resetallController = resetallController;
