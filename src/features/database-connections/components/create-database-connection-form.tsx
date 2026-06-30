"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  createDatabaseConnectionSchema,
  CreateDatabaseConnectionFormData,
} from "../schemas/create-database-connection.schema";

import { useCreateDatabaseConnection } from "../hooks/use-create-database-connection";

import { DatabaseConnectionFields } from "./database-connection-fields";
import { DatabaseConnectionForm } from "../types/database-connection-form";

type Props = {
  onSuccess: () => void;
};

export function CreateDatabaseConnectionForm({ onSuccess }: Props) {
  const form = useForm<DatabaseConnectionForm>({
    resolver: zodResolver(createDatabaseConnectionSchema),

    defaultValues: {
      name: "",
      provider: "MYSQL",
      host: "",
      port: 3306,
      database: "",
      username: "",
      password: "",
    },
  });

  const mutation = useCreateDatabaseConnection();

  function onSubmit(data: CreateDatabaseConnectionFormData) {
    mutation.mutate(data, {
      onSuccess() {
        form.reset();
        onSuccess();
      },
    });
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
        {mutation.isPending ? "Creating..." : "Create Connection"}
      </Button>
    </form>
  );
}
