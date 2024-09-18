"use client";

import { Loader2 } from "lucide-react";
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
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-primary-700 p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="w-8 h-8 animate-spin text-secondary-500 mr-4" />
            <span className="text-white text-lg font-semibold">Loading...</span>
          </div>
        </div>
      );
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
