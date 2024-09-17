"use client";

import { withAuth } from "@/components/withAuth";
import { useState, useEffect } from "react";
import { Loader2, Search, RefreshCw } from "lucide-react";

interface Application {
  _id: string;
  userId?: { name: string };
  amount?: number;
  purpose?: string;
  status?: string;
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

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Loan Applications</h1>
        <button
          onClick={fetchApplications}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" />
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
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredApplications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-gray-700 transition-colors"
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
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === "verified"
                          ? "bg-green-200 text-green-900"
                          : app.status === "pending"
                          ? "bg-yellow-200 text-yellow-900"
                          : "bg-red-200 text-red-900"
                      }`}
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
        </div>
      )}
      {!loading && filteredApplications.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No applications found.</p>
      )}
    </div>
  );
}

export default withAuth(AllApplications, ["admin"]);
