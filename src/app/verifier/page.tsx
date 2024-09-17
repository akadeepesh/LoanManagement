"use client";

import { withAuth } from "@/components/withAuth";
import React, { useState, useEffect } from "react";
import { Check, X, Filter, Loader2, RefreshCw } from "lucide-react";

interface Application {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  amount: number;
  purpose: string;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

function VerifierPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "verified" | "rejected"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/loan-application");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "verified" | "rejected"
  ) => {
    try {
      const response = await fetch(`/api/loan-application/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updatedApplication = await response.json();
        setApplications(
          applications.map((app) => (app._id === id ? updatedApplication : app))
        );
      } else {
        console.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const filteredApplications = applications.filter(
    (app) => filter === "all" || app.status === filter
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loan Verification</h1>
        <button
          onClick={fetchApplications}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <Filter className="mr-2 text-gray-400" />
        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value as "all" | "pending" | "verified" | "rejected"
            )
          }
          className="bg-gray-800 text-white border border-gray-700 rounded p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 border-b border-gray-600">
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredApplications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="p-3 whitespace-nowrap">
                    <div>{app.userId.name}</div>
                    <div className="text-sm text-gray-400">
                      {app.userId.email}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    ${app.amount.toLocaleString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">{app.purpose}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "verified"
                          ? "bg-green-200 text-green-800"
                          : app.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {app.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(app._id, "verified")
                          }
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          aria-label="Verify application"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(app._id, "rejected")
                          }
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          aria-label="Reject application"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && filteredApplications.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No applications found.</p>
      )}
    </div>
  );
}

export default withAuth(VerifierPanel, ["verifier", "admin"]);
