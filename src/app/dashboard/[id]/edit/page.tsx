"use client";

import React, { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Application {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
}

function EditApplication({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplication();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You must be logged in to view this page.</div>;
  }

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    try {
      const response = await fetch(`/api/loan-application/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
        credentials: "include", // Add this line
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to update application");
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={application.amount}
            onChange={(e) =>
              setApplication({ ...application, amount: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="block mb-1">
            Purpose
          </label>
          <input
            type="text"
            id="purpose"
            value={application.purpose}
            onChange={(e) =>
              setApplication({ ...application, purpose: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Update Application
        </button>
      </form>
    </div>
  );
}

export default withAuth(EditApplication, ["user"]);
