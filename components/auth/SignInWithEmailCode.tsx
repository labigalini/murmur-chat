import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function SignInWithEmailCode({
  handleCodeSent,
  provider,
  children,
}: {
  handleCodeSent: (email: string) => void;
  provider?: string;
  children?: React.ReactNode;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn(provider ?? "resend-otp", formData)
          .then(() => handleCodeSent(formData.get("email") as string))
          .catch((error) => {
            console.error(error);
            toast({
              title: "Could not send code",
              variant: "destructive",
            });
            setSubmitting(false);
          });
      }}
    >
      <Input
        name="email"
        id="email"
        className="mb-4"
        autoComplete="email"
        placeholder="Your email"
        aria-label="Email to receive one time login code"
      />
      {children}
      <Button type="submit" disabled={submitting}>
        Send code
      </Button>
    </form>
  );
}
