import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DatabaseConnection } from "../types/database-connection";

const mocks = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock("../hooks/use-update-database-connection", () => ({
  useUpdateDatabaseConnection: () => ({
    mutate: mocks.mutate,
    isPending: false,
  }),
}));

import { UpdateDatabaseConnectionForm } from "./update-database-connection-form";

const connection: DatabaseConnection = {
  id: "connection-1",
  name: "MySQL production",
  provider: "MYSQL",
  host: "mysql.example.com",
  port: 3306,
  database: "app",
  username: "app-user",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

describe("UpdateDatabaseConnectionForm", () => {
  it("seleciona PostgreSQL e envia o ID e provider atualizado", async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    render(<UpdateDatabaseConnectionForm connection={connection} onSuccess={vi.fn()} />);

    const provider = screen.getByRole("combobox");
    expect(provider.textContent).toContain("MySQL");

    fireEvent.click(provider);
    fireEvent.click(screen.getByRole("option", { name: "PostgreSQL" }));

    expect(provider.textContent).toContain("PostgreSQL");

    fireEvent.submit(screen.getByRole("button", { name: "Update Connection" }));

    await waitFor(() => expect(mocks.mutate).toHaveBeenCalledOnce());
    expect(mocks.mutate).toHaveBeenCalledWith(
      {
        id: connection.id,
        data: expect.objectContaining({
          provider: "POSTGRESQL",
        }),
      },
      expect.anything(),
    );
  });
});
