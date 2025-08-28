
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { deletePrintLog } from '@/app/actions';
import type { PrintLogSerializable } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { EditLogDialog } from './edit-log-dialog';


interface PrintLogTableProps {
  logs: PrintLogSerializable[];
}

export function PrintLogTable({ logs }: PrintLogTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<PrintLogSerializable | null>(null);
  const [formattedLogs, setFormattedLogs] = useState(logs);
  const { toast } = useToast();

  useEffect(() => {
    setFormattedLogs(
      logs.map((log) => ({
        ...log,
        startTime: format(new Date(log.startTime), 'yyyy/MM/dd HH:mm', { locale: ja }),
        endTime: format(new Date(log.endTime), 'yyyy/MM/dd HH:mm', { locale: ja }),
      }))
    );
  }, [logs]);

  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">ログが見つかりません</h3>
        <p className="text-sm text-muted-foreground">新しいログを追加して、利用履歴をここに表示します。</p>
      </div>
    );
  }
  
  const handleDelete = async () => {
    if (!selectedLog) return;
    const result = await deletePrintLog(selectedLog.id);
    if (result.success) {
      toast({
        title: '成功',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: result.error,
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedLog(null);
  };

  const openDeleteDialog = (log: PrintLogSerializable) => {
    setSelectedLog(log);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (log: PrintLogSerializable) => {
    setSelectedLog(log);
    setIsEditDialogOpen(true);
  };


  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>目的</TableHead>
              <TableHead className="hidden sm:table-cell">プリンター</TableHead>
              <TableHead className="hidden md:table-cell">開始日時</TableHead>
              <TableHead className="hidden md:table-cell">終了日時</TableHead>
              <TableHead>利用者</TableHead>
              <TableHead><span className="sr-only">アクション</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{log.purpose}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={log.printer === 'left' ? 'secondary' : 'outline'}>
                    {log.printer === 'left' ? '左' : '右'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{log.startTime}</TableCell>
                <TableCell className="hidden md:table-cell">{log.endTime}</TableCell>
                <TableCell>
                  <div className="font-medium">{log.userName}</div>
                  <div className="text-xs text-muted-foreground">{log.studentId}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">メニューを開閉する</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditDialog(log)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        編集
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openDeleteDialog(log)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は元に戻せません。ログがサーバーから完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedLog(null)}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedLog && (
        <EditLogDialog
            isOpen={isEditDialogOpen}
            onOpenChange={(isOpen) => {
              setIsEditDialogOpen(isOpen);
              if (!isOpen) {
                setSelectedLog(null);
              }
            }}
            log={selectedLog}
        />
      )}
    </>
  );
}
