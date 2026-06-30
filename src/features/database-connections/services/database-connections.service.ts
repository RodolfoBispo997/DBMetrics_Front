import { api } from "@/lib/api";
import { DatabaseConnection } from "../types/database-connection";
import { CreateDatabaseConnectionDTO } from "../types/create-database-connection";
import { UpdateDatabaseConnectionDTO } from "../types/update-database-connection";

export const databaseConnectionsService = {
  async list() {
    const response = await api.get<DatabaseConnection[]>(
      "/database-connections",
    );

    return response.data;
  },

  async findById(id: string) {
    const response = await api.get<DatabaseConnection>(
      `/database-connections/${id}`,
    );

    return response.data;
  },

  async create(data: CreateDatabaseConnectionDTO): Promise<DatabaseConnection> {
    const response = await api.post("/database-connections", data);

    return response.data;
  },

  async update(
    id: string,
    data: UpdateDatabaseConnectionDTO,
  ): Promise<DatabaseConnection> {
    const response = await api.patch(`/database-connections/${id}`, data);

    return response.data;
  },

  async remove(id: string) {
    const response = await api.delete(`/database-connections/${id}`);

    return response.data;
  },

  async test(id: string) {
    const response = await api.post(`/database-connections/${id}/test`);

    return response.data;
  },

  async metrics(id: string) {
    const response = await api.get(`/database-connections/${id}/metrics`);

    return response.data;
  },
};
