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

export async function getUser(){
    try{
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request()
        .execute('sp_getusers');
        
        return (result1.recordset)
    }catch(err: any){
        return (err.message, {status: 404})
    }
  }