import mysql from "mysql2/promise";
console.log(process.env);
export const pool = mysql.createPool({
    host: process.env.HOST ?? "",
    port: process.env.PORT_DATABASE ?? "",
    user: process.env.USER_DATABASE ?? "",
    password: process.env.PASSWORD ?? "",
    database: process.env.DATABASE ?? "",
});


