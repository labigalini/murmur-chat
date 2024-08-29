import { toast } from "@/components/ui/use-toast";
import { ConvexError } from "convex/values";

export function handleFailure<TFailure extends unknown[]>(
  callback: (...args: TFailure) => Promise<unknown>,
) {
  return (...args: TFailure) => {
    void (async () => {
      try {
        await callback(...args);
      } catch (error) {
        toast({
          title:
            error instanceof ConvexError
              ? (error.data as string)
              : "Something went wrong",
          variant: "destructive",
        });
      }
    })();
  };
}
