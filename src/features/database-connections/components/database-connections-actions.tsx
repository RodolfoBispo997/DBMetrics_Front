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
import { useTestDatabaseConnection } from "../hooks/use-test-database-connection";
import { UpdateDatabaseConnectionDialog } from "./update-database-connection-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

type DatabaseConnectionActionsProps = {
  connection: DatabaseConnection;
};

export function DatabaseConnectionsActions({
  connection,
}: DatabaseConnectionActionsProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const deleteMutation = useDeleteDatabaseConnection();
  const testMutation = useTestDatabaseConnection();

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
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={testMutation.isPending}
            onClick={() => testMutation.mutate(connection.id)}
          >
            {testMutation.isPending ? "Testing..." : "Test Connection"}
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/database-connections/${connection.id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateDatabaseConnectionDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        connection={connection}
      />
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete database connection?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => deleteMutation.mutate(connection.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
