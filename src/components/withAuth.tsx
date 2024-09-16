"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Do nothing while loading
      if (!session) {
        router.push("/auth/signin");
      } else if (
        allowedRoles &&
        session.user.role &&
        !allowedRoles.includes(session.user.role)
      ) {
        router.push("/unauthorized"); // Create this page for unauthorized access
      }
    }, [session, status, router]);

    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (!session) {
      return null;
    }

    if (
      allowedRoles &&
      session.user.role &&
      !allowedRoles.includes(session.user.role)
    ) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
