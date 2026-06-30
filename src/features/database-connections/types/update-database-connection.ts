import { DatabaseProvider } from "./database-connection";

export interface UpdateDatabaseConnectionDTO {
  name: string;
  provider: DatabaseProvider;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
}
