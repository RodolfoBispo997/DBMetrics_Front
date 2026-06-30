import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DatabaseProvider } from "../types/database-connection";
import { DatabaseConnectionForm } from "../types/database-connection-form";

type Props = {
  register: UseFormRegister<DatabaseConnectionForm>;
  watch: UseFormWatch<DatabaseConnectionForm>;
  setValue: UseFormSetValue<DatabaseConnectionForm>;
  errors: FieldErrors<DatabaseConnectionForm>;
};

export function DatabaseConnectionFields({
  register,
  watch,
  setValue,
  errors,
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          placeholder="Production Database"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Provider</Label>

        <Select
          value={watch("provider")}
          onValueChange={(value) =>
            setValue("provider", value as DatabaseProvider, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="MYSQL">MySQL</SelectItem>
            <SelectItem value="POSTGRESQL">PostgreSQL</SelectItem>
          </SelectContent>
        </Select>

        {errors.provider && (
          <p className="text-sm text-red-500">{errors.provider.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>

        <Input id="host" placeholder="localhost" {...register("host")} />

        {errors.host && (
          <p className="text-sm text-red-500">{errors.host.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="port">Port</Label>

        <Input
          id="port"
          type="number"
          placeholder="5432"
          {...register("port", {
            valueAsNumber: true,
          })}
        />

        {errors.port && (
          <p className="text-sm text-red-500">{errors.port.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="database">Database</Label>

        <Input id="database" placeholder="postgres" {...register("database")} />

        {errors.database && (
          <p className="text-sm text-red-500">{errors.database.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input id="username" placeholder="postgres" {...register("username")} />

        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          placeholder="********"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
    </>
  );
}
