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

import {
  alertMetricLabels,
  alertOperatorLabels,
  notificationChannelLabels,
} from "../constants/alert-options";
import { useCreateAlertRule } from "../hooks/use-create-alert-rule";
import {
  AlertRuleFormData,
  alertRuleFormSchema,
} from "../schemas/alert-rule-form.schema";

type Props = {
  connectionId: string;
  onSuccess: () => void;
};

export function CreateAlertRuleForm({ connectionId, onSuccess }: Props) {
  const form = useForm<AlertRuleFormData>({
    resolver: zodResolver(alertRuleFormSchema),
    defaultValues: {
      metric: "DATABASE_SIZE",
      operator: "GREATER_THAN",
      threshold: 0,
      cooldownMinutes: 30,
      channel: "WHATSAPP",
      destination: "",
    },
  });
  const mutation = useCreateAlertRule();
  const channel = form.watch("channel");

  function onSubmit(data: AlertRuleFormData) {
    mutation.mutate(
      { connectionId, ...data },
      {
        onSuccess() {
          form.reset();
          onSuccess();
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="alert-metric">Metric</Label>
        <Controller
          control={form.control}
          name="metric"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={mutation.isPending}
            >
              <SelectTrigger
                id="alert-metric"
                className="w-full"
                aria-describedby={form.formState.errors.metric ? "alert-metric-error" : undefined}
                aria-invalid={!!form.formState.errors.metric}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(alertMetricLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.metric && (
          <p id="alert-metric-error" className="text-sm text-red-500" aria-live="polite">
            {form.formState.errors.metric.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-operator">Operator</Label>
        <Controller
          control={form.control}
          name="operator"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={mutation.isPending}
            >
              <SelectTrigger
                id="alert-operator"
                className="w-full"
                aria-describedby={form.formState.errors.operator ? "alert-operator-error" : undefined}
                aria-invalid={!!form.formState.errors.operator}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(alertOperatorLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.operator && (
          <p id="alert-operator-error" className="text-sm text-red-500" aria-live="polite">
            {form.formState.errors.operator.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-threshold">Threshold</Label>
        <Input
          id="alert-threshold"
          type="number"
          min="0"
          step="any"
          disabled={mutation.isPending}
          aria-describedby={form.formState.errors.threshold ? "alert-threshold-error" : undefined}
          aria-invalid={!!form.formState.errors.threshold}
          {...form.register("threshold", { valueAsNumber: true })}
        />
        {form.formState.errors.threshold && (
          <p id="alert-threshold-error" className="text-sm text-red-500" aria-live="polite">
            {form.formState.errors.threshold.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-cooldown-minutes">Cooldown (minutos)</Label>
        <Input
          id="alert-cooldown-minutes"
          type="number"
          min="1"
          max="10080"
          step="1"
          disabled={mutation.isPending}
          {...form.register("cooldownMinutes", { valueAsNumber: true })}
        />
        {form.formState.errors.cooldownMinutes && (
          <p className="text-sm text-red-500" aria-live="polite">
            {form.formState.errors.cooldownMinutes.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-channel">Channel</Label>
        <Controller control={form.control} name="channel" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
            <SelectTrigger id="alert-channel" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(notificationChannelLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-destination">{channel === "EMAIL" ? "Email destination" : "WhatsApp destination"}</Label>
        <Input
          id="alert-destination"
          type={channel === "EMAIL" ? "email" : "text"}
          inputMode={channel === "EMAIL" ? "email" : "numeric"}
          placeholder={channel === "EMAIL" ? "name@example.com" : "5511999999999"}
          disabled={mutation.isPending}
          aria-describedby={form.formState.errors.destination ? "alert-destination-error" : undefined}
          aria-invalid={!!form.formState.errors.destination}
          {...form.register("destination")}
        />
        {form.formState.errors.destination && (
          <p id="alert-destination-error" className="text-sm text-red-500" aria-live="polite">
            {form.formState.errors.destination.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Alert Rule"}
      </Button>
    </form>
  );
}
