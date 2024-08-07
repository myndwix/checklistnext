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

export async function createUser(userDetails: {username: string, firstname: string, lastname: string, role: any, password: string}){
    try{
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userDetails.password, salt);
        console.log('Hashed password::: ',hashedPassword)
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request()
        .input('username',sql.VarChar(50), userDetails.username)
        .input('firstname', sql.VarChar(50), userDetails.firstname)
        .input('lastname', sql.VarChar(50), userDetails.lastname)
        .input('role', sql.VarChar(50), userDetails.role)
        .input('password', sql.NVarChar(500), hashedPassword)
        .execute('sp_createuser');

        console.log(userDetails)
        return (result1.recordset)
    }catch(err: any){
        console.log(err.message)
        return (err.message, {status: 404})
    }
  }