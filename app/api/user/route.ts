import {NextRequest, NextResponse} from 'next/server'
import sql from 'mssql';

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
    encrypt: true,
    trustServerCertificate: true
    }
  };

  export async function POST(req: NextRequest, {params}: {params: {id: string}}){
    try{
      const body = await req.json();
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request().input('username', body.username).execute('sp_getuser')
        return NextResponse.json(result1.recordset)
    }catch(err: any){
      console.log(err.message)
        return NextResponse.json(err.message, {status:404})
    }
  }