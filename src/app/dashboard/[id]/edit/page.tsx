"use client";

import React, { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface Application {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
}

function EditApplication({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplication();
    }
  }, [status]);

  const fetchApplication = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/loan-application/${params.id}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setApplication(data);
      } else {
        console.error("Failed to fetch application", {
          status: response.status,
          statusText: response.statusText,
        });
        const errorText = await response.text();
        console.error("Error details:", errorText);
        setError("Failed to fetch application. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      setError("An error occurred while fetching the application.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/loan-application/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
        credentials: "include",
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError("Failed to update application. Please try again.");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      setError("An error occurred while updating the application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="bg-gray-900 flex items-center justify-center text-white">
        You must be logged in to view this page.
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-gray-900 flex items-center justify-center text-white">
        Application not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">
          Edit Application
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="amount" className="sr-only">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={application.amount}
                onChange={(e) =>
                  setApplication({
                    ...application,
                    amount: Number(e.target.value),
                  })
                }
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Amount"
              />
            </div>
            <div>
              <label htmlFor="purpose" className="sr-only">
                Purpose
              </label>
              <input
                type="text"
                id="purpose"
                value={application.purpose}
                onChange={(e) =>
                  setApplication({ ...application, purpose: e.target.value })
                }
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Purpose"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditApplication, ["user"]);
