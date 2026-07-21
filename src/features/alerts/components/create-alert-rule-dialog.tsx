"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateAlertRuleForm } from "./create-alert-rule-form";

type Props = {
  connectionId: string;
};

export function CreateAlertRuleDialog({ connectionId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={!connectionId}>New Alert Rule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
          <DialogDescription>
            Configure the condition and WhatsApp destination for this alert rule.
          </DialogDescription>
        </DialogHeader>
        <CreateAlertRuleForm connectionId={connectionId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
