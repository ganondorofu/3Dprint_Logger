import { getPrintLogs } from '@/app/actions';
import { PrintLogForm } from '@/components/print-log-form';
import { PrintLogTable } from '@/components/print-log-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, ScrollText } from 'lucide-react';

export default async function Home() {
  const { logs, error } = await getPrintLogs();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-2">
            <Printer className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">PrintLog</h1>
          </div>
        </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1" >
            <CardHeader>
              <CardTitle>新しいログを追加</CardTitle>
              <CardDescription>新しい3Dプリンターの利用セッションを記録します。</CardDescription>
            </CardHeader>
            <CardContent>
              <PrintLogForm />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5" />
                    <CardTitle>利用履歴</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              {error && <p className="text-destructive">{error}</p>}
              <PrintLogTable logs={logs ?? []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
