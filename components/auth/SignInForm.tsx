import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { CodeInput } from "./CodeInput";
import { SignInWithEmailCode } from "./SignInWithEmailCode";
import { SignInWithOAuth } from "./SignInWithOAuth";

type SignInFormProps = {
  onSignIn?: () => void;
};

export function SignInForm({ onSignIn }: SignInFormProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className="mx-auto mb-2 flex max-w-[384px] flex-col gap-4">
      {step === "signIn" ? (
        <>
          <SignInWithOAuth />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <SignInWithEmailCode handleCodeSent={(email) => setStep({ email })} />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the 8-digit code we sent to your email address.
          </p>
          <form
            className="flex flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              const formData = new FormData(event.currentTarget);
              signIn("resend-otp", formData)
                .then(onSignIn)
                .catch(() => {
                  toast({
                    title: "Code could not be verified, try again",
                    variant: "destructive",
                  });
                  setSubmitting(false);
                });
            }}
          >
            <div className="my-4">
              <CodeInput />
            </div>
            <input name="email" value={step.email} type="hidden" />
            <Button type="submit" disabled={submitting}>
              Continue
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setStep("signIn")}
            >
              Cancel
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
