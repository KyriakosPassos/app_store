import { Pool, PoolConfig } from "pg";

// A Map to store the singleton instances, keyed by a user-password combination.
// This allows for different pools for different users, while ensuring only one
// instance per unique user/password pair.
const pools = new Map<string, Pool>();

/**
 * A singleton class to manage PostgreSQL connection pools.
 * It ensures that a new connection pool is created only if a unique
 * user/password combination is provided. Otherwise, it returns the existing pool.
 */
export class DatabasePoolManager {
  /**
   * Generates a unique key for the pool based on the user and password.
   * This is what determines if a new pool needs to be created.
   * @param config The pool configuration object.
   * @returns A unique string key.
   */
  private static getPoolKey(config: PoolConfig): string {
    const user = config.user || "default";
    const password = config.password || "";
    // We combine the user and password to create a unique key.
    // This assumes all other config details (like host, port, database) are
    // constant for a given user/password pair, which is a reasonable assumption
    // for this pattern.
    return `${user}:${password}`;
  }

  /**
   * Retrieves or creates a PostgreSQL connection pool.
   * If a pool for the given user and password already exists, it returns
   * the existing instance. Otherwise, it creates a new one.
   * @param config The PostgreSQL pool configuration.
   * @returns A new or existing PostgreSQL Pool instance.
   */
  public static getPool(config: PoolConfig): Pool {
    const key = this.getPoolKey(config);

    // Check if a pool for this key already exists in our map.
    if (pools.has(key)) return pools.get(key)!;

    const newPool = new Pool(config);
    pools.set(key, newPool);

    return newPool;
  }

  /**
   * Ends an existing connection pool based on the provided configuration.
   * This should be called to properly close the pool before the application exits.
   * @param config The PostgreSQL pool configuration used to identify the pool to end.
   */
  public static async endPool(config: PoolConfig): Promise<void> {
    const key = this.getPoolKey(config);
    const poolToEnd = pools.get(key);

    if (poolToEnd) {
      await poolToEnd.end();
      pools.delete(key);
    }
  }
}

export const query = async <T>(
  schema: string | string[],
  sql: string,
  params: any[]
): Promise<T[]> => {
  const dbConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT!, 10),
    host: process.env.DB_HOST,
  };

  const pool = DatabasePoolManager.getPool(dbConfig);
  const client = await pool.connect();
  try {
    const schemaList = Array.isArray(schema) ? schema.join(", ") : schema;
    // Sets the search path for the current transaction
    await client.query(`SET search_path TO "${schemaList}", core`);
    const result = await client.query(sql, params);
    // The result rows are cast to the generic type T
    return result.rows as T[];
  } catch (error) {
    throw new Error("A database error occurred.");
  } finally {
    // Ensures the connection is always released back to the pool.
    client.release();
  }
};
