"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogProps } from "@radix-ui/react-dialog";
import * as z from "zod";

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

import { useChatContext } from "./chat-context";

const FormSchema = z.object({
  email: z.string().min(4, "Team name must be at least 4 characters long."),
});

type ChatInviteDialogProps = Required<Pick<DialogProps, "open">> & {
  onClose: () => void;
};

const ChatInviteDialog = ({ open, onClose }: ChatInviteDialogProps) => {
  const {
    state: { chat },
    onCreateInvite,
  } = useChatContext();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = handleFailure(
    form.handleSubmit(({ email }) => {
      if (!chat || chat === "loading") return;
      onCreateInvite(chat, email);
      onClose();
      form.reset();
    }),
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create invite</DialogTitle>
              <DialogDescription>Create a new incite.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@acmeinc.com"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { ChatInviteDialog };
