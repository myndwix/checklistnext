'use server';

import sql, { pool } from 'mssql';
import bcrypt from 'bcryptjs'

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

export async function updatePassword(userDetails: {userid: string | number, password: string}){
    try{
      const salt =  await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userDetails.password, salt);
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request()
        .input('userid', userDetails.userid)
        .input('password', hashedPassword)
        .execute('sp_updatepassword');

        return (result1.recordset)
    }catch(err: any){
        console.log(err.message)
        return (err.message, {status: 404})
    }
  }