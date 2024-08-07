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

  export async function getLastChecklist(){
    try{
        let pool = await sql.connect(sqlConfig)
        let result1 = await pool.request().execute('sp_getlastchecklist');
        return (result1.recordset)
    }catch(err: any){
        return (err.message, {status: 404})
    }
  }

  export async function createIssue(data:any, userid: number) {
      try {
        let pool = await sql.connect(sqlConfig);
        let transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
          let result1 = await transaction.request().query`SELECT 'NOCCL' + CONVERT(VARCHAR(11),RIGHT((SELECT MAX(checklistid) FROM checklistheader),6) +1 ) as id`;
          const listId = result1.recordset[0].id;
          let result2 = await transaction.request().query`INSERT INTO checklistheader VAlUES (${listId}, GETDATE(), GETDATE(), 0, ${userid}, null, null, 0 );`
          
          for (let item of data) {
              let result3 = await transaction.request().query`
                INSERT INTO checklistdetail (checklistid, name, model, status, type, remarks) VALUES
              (${listId}, ${item.name}, ${item.model}, ${item.status}, ${item.type}, ${item.remarks})
              `;
            }
          
          for (let item of data) {
          let result4 = await transaction.request().query`
            UPDATE appliances
            SET status = ${item.status}, remarks = ${item.remarks}
            WHERE name = ${item.name};
          `;
          }
    
          // Commit the transaction if all updates succeed
          await transaction.commit();
          console.log('Bulk update committed successfully.');
        } catch (err) {
          // Rollback the transaction in case of any error
          await transaction.rollback();
          throw err;
        } finally {
          // Release the transaction
          // transaction.release();
        }
      } catch (err:any) {
        console.error('Database connection error:', err.message);
        throw err;
     
  }
}



export async function editIssue(data:any, checklistid:any) {
  console.log(checklistid)
  try {
    let pool = await sql.connect(sqlConfig);
    let transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      
      for (let item of data) {
          let result3 = await transaction.request().query`
            update checklistdetail set status=${item.status}, remarks=${item.remarks} where name=${item.name} and checklistid=${checklistid};
            update appliances set status=${item.status}, remarks=${item.remarks} where name=${item.name};
          
          `;
          console.log(result3)
        }
      

      // Commit the transaction if all updates succeed
      await transaction.commit();
      console.log('Bulk update committed successfully.');
    } catch (err) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      throw err;
    } finally {
      // Release the transaction
      // transaction.release();
    }
  } catch (err:any) {
    console.error('Database connection error:', err.message);
    throw err;
 
  }
}


export async function confirmChecklist(checklistid: string, userid: number){
  console.log('Printing user id from backend: ',userid)
  try{
      let pool = await sql.connect(sqlConfig)
      let result1 = await pool.request()
      .input('checklistid', checklistid)
      .input('userid', userid)
      .execute('sp_confirmchecklist');
      
      return (result1.recordset)
  }catch(err: any){
      return (err.message, {status: 404})
  }
}

export async function getUser(username: string){
  try{
      // let pool = await sql.connect(sqlConfig)
      // let result1 = await pool.request()
      // .input('username', username)
      // .execute('sp_getuser');
      
      // return (result1.recordset)
      return({username: 'Sameen'})
  }catch(err: any){
      return (err.message, {status: 404})
  }
}

