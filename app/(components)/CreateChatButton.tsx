"use client";

import { handleFailure } from "@/app/(helpers)/handleFailure";
import { Button } from "@/components/ui/button";
import {
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
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(4, "Team name must be at least 4 characters long."),
  // TODO if you want plans:
  // plan: z.enum(["free", "pro"]),
});

export function CreateChatButton() {
  const [open, setOpen] = useState(false);

  const createChat = useMutation(api.chats.create);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = handleFailure(
    form.handleSubmit(async ({ name }) => {
      await createChat({ name });
      setOpen(false);
    }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Chat</Button>
      </DialogTrigger>
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
