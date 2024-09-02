"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleFailure } from "@/lib/handleFailure";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useChatContext } from "./chat-context";

const FormSchema = z.object({
  name: z.string().min(4, "Team name must be at least 4 characters long."),
});

type CreateChatDialogProps = Required<
  Pick<DialogProps, "open" | "onOpenChange">
>;

export function ChatCreateDialog({
  open,
  onOpenChange,
}: CreateChatDialogProps) {
  const { onCreateChat } = useChatContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = handleFailure(
    form.handleSubmit(({ name: newChat }) => {
      onCreateChat(newChat);
      onOpenChange(false);
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create chat</DialogTitle>
              <DialogDescription>Create a new chat.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Inc."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
