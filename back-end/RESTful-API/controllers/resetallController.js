const { pool } = require('../utils/database');

const resetallController = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Truncate all data from the tables
        await connection.query('DELETE FROM Aliases');
        await connection.query('DELETE FROM Directors');
        await connection.query('DELETE FROM Episode_belongs_to');
        await connection.query('DELETE FROM Had_role');
        await connection.query('DELETE FROM Known_for');
        await connection.query('DELETE FROM Name_worked_as');
        await connection.query('DELETE FROM Principals');
        await connection.query('DELETE FROM Title_genres');
        await connection.query('DELETE FROM User_Title_Ratings');
        await connection.query('DELETE FROM Writers');
        await connection.query('DELETE FROM Names_');
        await connection.query('DELETE FROM Titles');

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
