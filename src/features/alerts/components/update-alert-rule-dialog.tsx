"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { AlertRule } from "../types/alert";
import { UpdateAlertRuleForm } from "./update-alert-rule-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AlertRule;
};

export function UpdateAlertRuleDialog({ open, onOpenChange, rule }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Alert Rule</DialogTitle></DialogHeader>
        <UpdateAlertRuleForm key={rule.id} rule={rule} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
