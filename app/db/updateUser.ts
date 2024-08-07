'use server';

import sql, { pool } from 'mssql';

const sqlConfig = {
    user: "sa",
    password: "Pass@123",
    database: "chklist",
    server: "localhost",
    pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
    },
    options: {
    encrypt: false,
    trustServerCertificate: false
    }
  };

export async function updateUser(userDetails: {userid: string | number, firstname: string, lastname: string, rolename: any}){
    try{
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request()
        .input('userid', userDetails.userid)
        .input('firstname', userDetails.firstname)
        .input('lastname', userDetails.lastname)
        .input('role', userDetails.rolename)
        .execute('sp_updateuser');

        return (result1.recordset)
    }catch(err: any){
        console.log(err.message)
        return (err.message, {status: 404})
    }
  }