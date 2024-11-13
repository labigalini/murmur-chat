"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { handleFailure } from "@/lib/handleFailure";

import { useChatContext } from "./chat-context";

const FormSchema = z.object({
  name: z.string().min(4, "Chat name must be at least 4 characters long."),
});

const ChatDialogChangeName = () => {
  const {
    state: { chat },
    onChatNameChange,
  } = useChatContext();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = handleFailure(
    form.handleSubmit(({ name }) => {
      if (!chat || chat === "loading") return;
      onChatNameChange(chat, name);
      setIsOpen(false);
      form.reset();
    }),
  );

  if (!chat || chat === "loading") return;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" className="flex w-full gap-4">
          Change Chat Name
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Change Chat Name</DialogTitle>
              <DialogDescription>Current name: {chat.name}</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="New chat name"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Change Name</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { ChatDialogChangeName };
