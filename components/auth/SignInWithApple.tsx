import { useAuthActions } from "@convex-dev/auth/react";

import { AppleLogo } from "@/components/logos/AppleLogo";
import { Button } from "@/components/ui/button";

export function SignInWithApple() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      type="button"
      onClick={() => void signIn("apple")}
      disabled={true}
    >
      <AppleLogo className="mr-2 h-4 w-4" /> Apple
    </Button>
  );
}
