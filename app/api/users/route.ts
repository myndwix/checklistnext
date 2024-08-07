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

  export async function GET(req: NextRequest){
    try{
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request().execute('sp_getusers')
        return NextResponse.json(result1.recordset)
    }catch(err: any){
      console.log(err.message)
        return NextResponse.json(err.message, {status:404})
    }
  }

  export const dynamic = 'force-dynamic'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'