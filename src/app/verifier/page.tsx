"use client";
import React, { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import {
  Check,
  X,
  Filter,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-200 text-green-900";
      case "pending":
        return "bg-yellow-200 text-yellow-900";
      case "rejected":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-primary-700 to-primary-800 text-gray-100 rounded-lg shadow-xl min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loan Verification</h1>
        <Button
          onClick={fetchApplications}
          variant="secondary"
          className="flex items-center px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
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
          className="bg-primary-600 text-white border border-primary-500 rounded-md focus:ring-2 focus:ring-secondary-500 transition-all duration-300"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <ScrollArea className="flex-grow rounded-md border border-primary-600">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-600 border-b border-primary-500">
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
            <tbody className="bg-primary-700 divide-y divide-primary-600">
              {filteredApplications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-primary-600 transition-colors duration-300"
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
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {app.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleStatusChange(app._id, "verified")
                          }
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          aria-label="Verify application"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusChange(app._id, "rejected")
                          }
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                          aria-label="Reject application"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>
      {!loading && filteredApplications.length === 0 && (
        <div className="text-center text-gray-400 mt-4 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          No applications found.
        </div>
      )}
    </div>
  );
}

export default withAuth(VerifierPanel, ["verifier", "admin"]);
