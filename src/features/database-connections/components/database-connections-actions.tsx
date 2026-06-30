"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { DatabaseConnection } from "../types/database-connection";
import { useDeleteDatabaseConnection } from "../hooks/use-delete-database-connection";
import { UpdateDatabaseConnectionDialog } from "./update-database-connection-dialog";

type DatabaseConnectionActionsProps = {
  connection: DatabaseConnection;
};

export function DatabaseConnectionsActions({
  connection,
}: DatabaseConnectionActionsProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const deleteMutation = useDeleteDatabaseConnection();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => deleteMutation.mutate(connection.id)}
          >
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem>Test Connection</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateDatabaseConnectionDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        connection={connection}
      />
    </>
  );
}
