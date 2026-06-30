export type DatabaseProvider = "POSTGRESQL" | "MYSQL";

export interface DatabaseConnection {
  id: string;
  name: string;
  provider: DatabaseProvider;
  host: string;
  port: number;
  database: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
