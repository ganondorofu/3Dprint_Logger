import { format } from 'date-fns';
import type { PrintLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PrintLogTableProps {
  logs: PrintLog[];
}

export function PrintLogTable({ logs }: PrintLogTableProps) {
  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No Logs Found</h3>
        <p className="text-sm text-muted-foreground">Add a new log to see usage history here.</p>
      </div>
    );
  }

  const formatDate = (timestamp: { toDate: () => Date }) => {
    return format(timestamp.toDate(), 'MM/dd HH:mm');
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Purpose</TableHead>
            <TableHead className="hidden sm:table-cell">Printer</TableHead>
            <TableHead className="hidden md:table-cell">Start Time</TableHead>
            <TableHead className="hidden md:table-cell">End Time</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{log.purpose}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={log.printer === 'left' ? 'secondary' : 'outline'}>
                  {log.printer.charAt(0).toUpperCase() + log.printer.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(log.startTime)}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(log.endTime)}</TableCell>
              <TableCell>
                <div className="font-medium">{log.userName}</div>
                <div className="text-xs text-muted-foreground">{log.studentId}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
