import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DatabaseConnectionsHeader() {
  return (
    <TableHeader className="bg-muted/40">
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Provider</TableHead>
        <TableHead>Host</TableHead>
        <TableHead>Database</TableHead>
        <TableHead>Port</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
