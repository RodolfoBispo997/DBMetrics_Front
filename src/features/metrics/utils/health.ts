import { DatabaseHealth } from "../types/database-metrics";
import { CircleCheckBig, CircleAlert, CircleX } from "lucide-react";

export function getHealthStatus(status: DatabaseHealth["status"]) {
  switch (status) {
    case "ONLINE":
      return {
        title: "Healthy",
        description: "Database is operating normally.",
        icon: CircleCheckBig,
        color: "text-green-500",
      };

    case "WARNING":
      return {
        title: "Warning",
        description: "Database requires attention.",
        icon: CircleAlert,
        color: "text-yellow-500",
      };

    case "CRITICAL":
      return {
        title: "Critical",
        description: "Immediate attention is recommended.",
        icon: CircleAlert,
        color: "text-red-500",
      };

    case "OFFLINE":
      return {
        title: "Offline",
        description: "Unable to connect to the database.",
        icon: CircleX,
        color: "text-red-500",
      };
  }
}
