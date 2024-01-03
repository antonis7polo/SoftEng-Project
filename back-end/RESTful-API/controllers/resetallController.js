const { pool } = require('../utils/database');

const resetallController = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Truncate all data from the tables
        await connection.query('TRUNCATE TABLE aliases');
        await connection.query('TRUNCATE TABLE directors');
        await connection.query('TRUNCATE TABLE episode_belongs_to');
        await connection.query('TRUNCATE TABLE had_role');
        await connection.query('TRUNCATE TABLE known_for');
        await connection.query('TRUNCATE TABLE name_worked_as');
        await connection.query('TRUNCATE TABLE principals');
        await connection.query('TRUNCATE TABLE title_genres');
        await connection.query('TRUNCATE TABLE user_title_ratings');
        await connection.query('TRUNCATE TABLE writers');
        await connection.query('TRUNCATE TABLE names_');
        await connection.query('TRUNCATE TABLE titles');

        await connection.commit();

        res.status(200).json({ status: "OK" });
    } catch (error) {
        console.error("Error in resetallController:", error);
        if (connection) await connection.rollback();