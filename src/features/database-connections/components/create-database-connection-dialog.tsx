"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateDatabaseConnectionForm } from "./create-database-connection-form";

export function CreateDatabaseConnectionDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Connection</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Database Connection</DialogTitle>
        </DialogHeader>

        <CreateDatabaseConnectionForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
