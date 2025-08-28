import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
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
        <h3 className="text-lg font-semibold">ログが見つかりません</h3>
        <p className="text-sm text-muted-foreground">新しいログを追加して、利用履歴をここに表示します。</p>
      </div>
    );
  }

  const formatDate = (timestamp: { toDate: () => Date }) => {
    return format(timestamp.toDate(), 'yyyy/MM/dd HH:mm', { locale: ja });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>目的</TableHead>
            <TableHead className="hidden sm:table-cell">プリンター</TableHead>
            <TableHead className="hidden md:table-cell">開始日時</TableHead>
            <TableHead className="hidden md:table-cell">終了日時</TableHead>
            <TableHead>利用者</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{log.purpose}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={log.printer === 'left' ? 'secondary' : 'outline'}>
                  {log.printer === 'left' ? '左' : '右'}
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
