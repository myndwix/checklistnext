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

export async function GET(req: NextRequest, {params}: {params: {id: string}}){

    try{
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request()
            .input('checklistid', sql.VarChar, params.id)
            .execute('sp_viewchecklist')
        return NextResponse.json(result1.recordset)

    }catch(err: any){
        return NextResponse.json(err.message)
    }

}
