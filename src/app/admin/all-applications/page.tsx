"use client";
import React, { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import { Loader2, Search, RefreshCw, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Application {
  _id: string;
  userId?: { name: string };
  amount?: number;
  purpose?: string;
  status?: "verified" | "pending" | "rejected";
  verifiedBy?: { name: string };
}

function AllApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredApplications = applications.filter(
    (app) =>
      app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold">All Loan Applications</h1>
        <Button
          onClick={fetchApplications}
          variant="secondary"
          className="flex items-center px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 bg-primary-600 border border-primary-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-300"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" />
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
                  User
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Verified By
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
                    {app.userId?.name || "N/A"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    ${app.amount?.toLocaleString() || 0}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {app.purpose || "N/A"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {app.status === "verified" && !app.verifiedBy
                      ? "Unknown Verifier"
                      : app.verifiedBy?.name || "N/A"}
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

export default withAuth(AllApplications, ["admin"]);
