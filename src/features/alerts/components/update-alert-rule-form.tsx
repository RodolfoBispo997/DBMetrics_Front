"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { alertMetricLabels, alertOperatorLabels } from "../constants/alert-options";
import { useUpdateAlertRule } from "../hooks/use-update-alert-rule";
import { CreateAlertRuleFormData, createAlertRuleSchema } from "../schemas/create-alert-rule.schema";
import { AlertRule } from "../types/alert";

type Props = {
  rule: AlertRule;
  onSuccess: () => void;
};

export function UpdateAlertRuleForm({ rule, onSuccess }: Props) {
  const form = useForm<CreateAlertRuleFormData>({
    resolver: zodResolver(createAlertRuleSchema),
    defaultValues: {
      metric: rule.metric,
      operator: rule.operator,
      threshold: rule.threshold,
      destination: rule.destination,
    },
  });
  const mutation = useUpdateAlertRule();

  function onSubmit(data: CreateAlertRuleFormData) {
    mutation.mutate(
      {
        alertRuleId: rule.id,
        databaseConnectionId: rule.databaseConnectionId,
        ...data,
        channel: "WHATSAPP",
      },
      { onSuccess },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-alert-metric">Metric</Label>
        <Controller control={form.control} name="metric" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
            <SelectTrigger id="edit-alert-metric" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(alertMetricLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
          </Select>
        )} />
        {form.formState.errors.metric && <p className="text-sm text-red-500">{form.formState.errors.metric.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-alert-operator">Operator</Label>
        <Controller control={form.control} name="operator" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
            <SelectTrigger id="edit-alert-operator" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(alertOperatorLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
          </Select>
        )} />
        {form.formState.errors.operator && <p className="text-sm text-red-500">{form.formState.errors.operator.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-alert-threshold">Threshold</Label>
        <Input id="edit-alert-threshold" type="number" min="0" step="any" disabled={mutation.isPending} {...form.register("threshold", { valueAsNumber: true })} />
        {form.formState.errors.threshold && <p className="text-sm text-red-500">{form.formState.errors.threshold.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-alert-destination">WhatsApp destination</Label>
        <Input id="edit-alert-destination" inputMode="numeric" disabled={mutation.isPending} {...form.register("destination")} />
        {form.formState.errors.destination && <p className="text-sm text-red-500">{form.formState.errors.destination.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
