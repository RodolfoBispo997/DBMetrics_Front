"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { updateDatabaseConnectionSchema } from "../schemas/update-database-connection.schema";

import { useUpdateDatabaseConnection } from "../hooks/use-update-database-connection";

import { DatabaseConnection } from "../types/database-connection";

import { DatabaseConnectionFields } from "./database-connection-fields";
import { DatabaseConnectionForm } from "../types/database-connection-form";
import { UpdateDatabaseConnectionDTO } from "../types/update-database-connection";

type Props = {
  connection: DatabaseConnection;
  onSuccess: () => void;
};

export function UpdateDatabaseConnectionForm({ connection, onSuccess }: Props) {
  const form = useForm<DatabaseConnectionForm>({
    resolver: zodResolver(updateDatabaseConnectionSchema),

    defaultValues: {
      name: connection.name,
      provider: connection.provider,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: "",
    },
  });

  const mutation = useUpdateDatabaseConnection();

  function onSubmit(data: DatabaseConnectionForm) {
    const payload: UpdateDatabaseConnectionDTO = {
      ...data,
    };

    if (!payload.password?.trim()) {
      delete payload.password;
    }

    mutation.mutate(
      {
        id: connection.id,
        data: payload,
      },
      {
        onSuccess,
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <DatabaseConnectionFields
        register={form.register}
        watch={form.watch}
        setValue={form.setValue}
        errors={form.formState.errors}
      />

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Updating..." : "Update Connection"}
      </Button>
    </form>
  );
}
