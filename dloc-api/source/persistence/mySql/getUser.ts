import { PersistenceResult } from "../../models/PersistenceResult";

const getUser = async (id: number) : Promise<PersistenceResult> => { 
  // const params: any[] = [id];

  // const sql = `SELECT * FROM user WHERE id = ?;`;
               
  // /** Execute query */
  // const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
  //   /** Check for errors */
  //   if (response.error) return { error: response.error, results: [] };
  //   /** Return results */
  //   return { results: response?.results ?? [], error: null };
  // });

  // return response;

  return { results: [{ message: "not implemented" }], error: null };
};

export { getUser };
