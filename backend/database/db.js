import mysql from "mysql2/promise";
import config from "./config.js";

const connection = await mysql.createConnection(config.db);

console.log("Connected to MySQL database");

export async function query(sql, parameters = []) {
    const [rows] = await connection.execute(sql, parameters);
    return rows;
}

export default query;
