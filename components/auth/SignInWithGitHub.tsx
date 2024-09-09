import { useAuthActions } from "@convex-dev/auth/react";

import { GitHubLogo } from "@/components/logos/GitHubLogo";
import { Button } from "@/components/ui/button";

export function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      type="button"
      onClick={() => void signIn("github")}
      disabled={true}
    >
      <GitHubLogo className="mr-2 h-4 w-4" /> GitHub
    </Button>
  );
}
