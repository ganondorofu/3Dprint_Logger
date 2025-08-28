
'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { updatePrintLog } from '@/app/actions';
import { updateLogSchema, type UpdateLogSchema, type PrintLogSerializable } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format, parse } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditLogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  log: PrintLogSerializable;
}

export function EditLogDialog({ isOpen, onOpenChange, log }: EditLogDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<UpdateLogSchema>({
    resolver: zodResolver(updateLogSchema),
    defaultValues: {
      purpose: log.purpose,
      printer: log.printer,
      studentId: log.studentId,
      userName: log.userName,
      startTime: format(new Date(log.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(log.endTime), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const onSubmit = (data: UpdateLogSchema) => {
    startTransition(async () => {
      const result = await updatePrintLog(log.id, data);
      if (result.success) {
        toast({
          title: '成功しました！',
          description: result.message,
        });
        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: '問題が発生しました。',
          description: result.error,
        });
      }
    });
  };

  const handleDateTimeChange = (field: any, date: Date | undefined, time: string) => {
    if (date) {
      const originalDate = parse(field.value, "yyyy-MM-dd'T'HH:mm", new Date());
      const [hours, minutes] = time.split(':').map(Number);
      const newDateTime = new Date(date);
      if(!isNaN(hours) && !isNaN(minutes)) {
        newDateTime.setHours(hours);
        newDateTime.setMinutes(minutes);
      } else if (originalDate instanceof Date && !isNaN(originalDate.getTime())) {
        newDateTime.setHours(originalDate.getHours());
        newDateTime.setMinutes(originalDate.getMinutes());
      }
      
      field.onChange(format(newDateTime, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ログを編集</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目的</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例：最終プロジェクトのプロトタイプ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="printer"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>プリンター</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="left" />
                        </FormControl>
                        <FormLabel className="font-normal">左</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="right" />
                        </FormControl>
                        <FormLabel className="font-normal">右</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>開始日時</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "yyyy/MM/dd")
                            ) : (
                              <span>日付を選択</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            const time = field.value ? format(new Date(field.value), "HH:mm") : '00:00';
                            handleDateTimeChange(field, date, time);
                          }}
                          initialFocus
                          locale={ja}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormControl>
                      <Input
                        type="time"
                        step="600"
                        value={field.value ? format(new Date(field.value), "HH:mm") : ''}
                        onChange={(e) => {
                          const date = field.value ? new Date(field.value) : new Date();
                          handleDateTimeChange(field, date, e.target.value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>終了日時</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "yyyy/MM/dd")
                            ) : (
                              <span>日付を選択</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            const time = field.value ? format(new Date(field.value), "HH:mm") : '00:00';
                            handleDateTimeChange(field, date, time);
                          }}
                          initialFocus
                          locale={ja}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormControl>
                      <Input
                        type="time"
                        step="600"
                        value={field.value ? format(new Date(field.value), "HH:mm") : ''}
                        onChange={(e) => {
                          const date = field.value ? new Date(field.value) : new Date();
                          handleDateTimeChange(field, date, e.target.value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>学籍番号</FormLabel>
                  <FormControl>
                    <Input placeholder="例：123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>利用者名</FormLabel>
                  <FormControl>
                    <Input placeholder="例：山田太郎" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              変更を保存
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
