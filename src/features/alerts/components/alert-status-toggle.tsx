"use client";

import { Button } from "@/components/ui/button";

import { useDisableAlertRule } from "../hooks/use-disable-alert-rule";
import { useEnableAlertRule } from "../hooks/use-enable-alert-rule";
import { AlertRule } from "../types/alert";

type Props = {
  rule: AlertRule;
};

export function AlertStatusToggle({ rule }: Props) {
  const enableMutation = useEnableAlertRule();
  const disableMutation = useDisableAlertRule();
  const isPending = enableMutation.isPending || disableMutation.isPending;

  const input = {
    alertRuleId: rule.id,
    databaseConnectionId: rule.databaseConnectionId,
  };

  if (rule.enabled) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => disableMutation.mutate(input)}
      >
        {disableMutation.isPending ? "Disabling..." : "Disable"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => enableMutation.mutate(input)}
    >
      {enableMutation.isPending ? "Enabling..." : "Enable"}
    </Button>
  );
}
