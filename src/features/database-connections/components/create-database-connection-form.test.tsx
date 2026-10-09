import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock("../hooks/use-create-database-connection", () => ({
  useCreateDatabaseConnection: () => ({
    mutate: mocks.mutate,
    isPending: false,
  }),
}));

import { CreateDatabaseConnectionForm } from "./create-database-connection-form";

describe("CreateDatabaseConnectionForm", () => {
  it("seleciona PostgreSQL visivelmente e envia POSTGRESQL no payload", async () => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    render(<CreateDatabaseConnectionForm onSuccess={vi.fn()} />);

    const provider = screen.getByRole("combobox");
    expect(provider.textContent).toContain("MySQL");

    fireEvent.click(provider);
    const postgresOption = screen.getByRole("option", { name: "PostgreSQL" });
    fireEvent.click(postgresOption);

    expect(provider.textContent).toContain("PostgreSQL");
    fireEvent.click(provider);
    expect(
      screen
        .getByRole("option", { name: "PostgreSQL" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    fireEvent.keyDown(provider, { key: "Escape" });

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Postgres test" },
    });
    fireEvent.change(screen.getByLabelText("Host"), {
      target: { value: "localhost" },
    });
    fireEvent.change(screen.getByLabelText("Database"), {
      target: { value: "postgres" },
    });
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "postgres" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Create Connection" }));

    await waitFor(() => expect(mocks.mutate).toHaveBeenCalledOnce());
    expect(mocks.mutate.mock.calls[0][0]).toMatchObject({
      provider: "POSTGRESQL",
    });
  });
});
