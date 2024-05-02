import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: process.env.HOST ?? "",
    port: process.env.PORT_DATABASE ?? "",
    user: process.env.USER ?? "",
    password: process.env.PASSWORD ?? "",
    database: process.env.DATABASE ?? "",
});


