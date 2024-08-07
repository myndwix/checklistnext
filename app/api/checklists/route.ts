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

  export async function GET(req: NextRequest, res: NextResponse){
    try{
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request().execute('sp_getchecklists')
        return NextResponse.json(result1, {status: 200})
    }catch(err: any){
        return NextResponse.json(err.message)
    }
  }

  export async function POST(req: NextRequest, {params}: {params: {id: string}}){
    try{
      const body = await req.json();
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request().input('userid', body.userid).execute('sp_clonechecklist')
        return NextResponse.json(result1)
    }catch(err: any){
      console.log(err.message)
        return NextResponse.json(err.message, {status:404})
    }
  }