"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DatabaseConnection } from "../types/database-connection";
import { UpdateDatabaseConnectionForm } from "./update-database-connection-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: DatabaseConnection;
};

export function UpdateDatabaseConnectionDialog({
  open,
  onOpenChange,
  connection,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Database Connection</DialogTitle>
        </DialogHeader>

        <UpdateDatabaseConnectionForm
          connection={connection}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
