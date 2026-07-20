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
} from "../constants/alert-options";
import { useCreateAlertRule } from "../hooks/use-create-alert-rule";
import {
  CreateAlertRuleFormData,
  createAlertRuleSchema,
} from "../schemas/create-alert-rule.schema";

type Props = {
  connectionId: string;
  onSuccess: () => void;
};

export function CreateAlertRuleForm({ connectionId, onSuccess }: Props) {
  const form = useForm<CreateAlertRuleFormData>({
    resolver: zodResolver(createAlertRuleSchema),
    defaultValues: {
      metric: "DATABASE_SIZE",
      operator: "GREATER_THAN",
      threshold: 0,
      destination: "",
    },
  });
  const mutation = useCreateAlertRule();

  function onSubmit(data: CreateAlertRuleFormData) {
    mutation.mutate(
      { connectionId, ...data, channel: "WHATSAPP" },
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
              <SelectTrigger id="alert-metric" className="w-full">
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
          <p className="text-sm text-red-500">
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
              <SelectTrigger id="alert-operator" className="w-full">
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
          <p className="text-sm text-red-500">
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
          {...form.register("threshold", { valueAsNumber: true })}
        />
        {form.formState.errors.threshold && (
          <p className="text-sm text-red-500">
            {form.formState.errors.threshold.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-destination">WhatsApp destination</Label>
        <Input
          id="alert-destination"
          inputMode="numeric"
          placeholder="5511999999999"
          disabled={mutation.isPending}
          {...form.register("destination")}
        />
        {form.formState.errors.destination && (
          <p className="text-sm text-red-500">
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
