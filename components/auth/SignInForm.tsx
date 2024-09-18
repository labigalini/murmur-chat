import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { CodeInput } from "./CodeInput";
import { SignInWithEmailCode } from "./SignInWithEmailCode";
import { SignInWithOAuth } from "./SignInWithOAuth";

import { Separator } from "../ui/separator";

const SignInStep = ({
  onCodeSent,
}: {
  onCodeSent: (email: string) => void;
}) => (
  <>
    <Separator label="Sign in with" className="my-3" />
    <SignInWithOAuth />
    <Separator label="Or continue with" className="my-3" />
    <SignInWithEmailCode handleCodeSent={onCodeSent} />
  </>
);

const CodeVerificationStep = ({
  email,
  onCancel,
}: {
  email: string;
  onCancel: () => void;
}) => {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    signIn("resend-otp", formData).catch(() => {
      toast({
        title: "Code could not be verified, try again",
        variant: "destructive",
      });
      setSubmitting(false);
    });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">
        Check your email
      </h2>
      <Separator />
      <p className="text-sm text-muted-foreground">
        Enter the 8-digit code we sent to your email address.
      </p>
      <form
        className="flex flex-col items-center gap-6"
        onSubmit={handleSubmit}
      >
        <CodeInput />
        <input name="email" value={email} type="hidden" />
        <Button type="submit" disabled={submitting} className="w-full">
          Continue
        </Button>
        <Button type="button" variant="link" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </>
  );
};

export function SignInForm() {
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");

  return (
    <div className="mx-auto flex flex-col gap-6 text-center">
      {step === "signIn" ? (
        <SignInStep onCodeSent={(email) => setStep({ email })} />
      ) : (
        <CodeVerificationStep
          email={step.email}
          onCancel={() => setStep("signIn")}
        />
      )}
    </div>
  );
}
