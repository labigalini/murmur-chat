import { ReactNode, useMemo } from "react";

import { Permission } from "@/convex/permissions";

import { Member } from "./chat-types";

type AccessControlProps = {
  viewer: Member;
  permission: Permission;
  fallback?: ReactNode;
  component: ReactNode;
};

export function AccessControl({
  viewer,
  permission,
  fallback: Fallback,
  component: Component,
}: AccessControlProps) {
  const isAllowed = useMemo(
    () => viewer.permissions.includes(permission),
    [viewer, permission],
  );

  if (!isAllowed) {
    return Fallback;
  }

  return Component;
}
