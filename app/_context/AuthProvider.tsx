import { AuthClientProvider } from "./AuthClientProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ConvexServerProvider } from "./ConvexServerProvider";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexServerProvider>
      <ConvexClientProvider>
        <AuthClientProvider>
          <>{children}</>
        </AuthClientProvider>
      </ConvexClientProvider>
    </ConvexServerProvider>
  );
}
