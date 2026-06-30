import { z } from "zod";
import { DatabaseConnectionForm } from "../types/database-connection-form";

export const createDatabaseConnectionSchema = z.object({
  name: z.string().min(1, "Name is required"),

  provider: z.enum(["MYSQL", "POSTGRESQL"]),

  host: z.string().min(1, "Host is required"),

  port: z.number(),

  database: z.string().min(1, "Database is required"),

  username: z.string().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});

export type CreateDatabaseConnectionFormData = DatabaseConnectionForm;
