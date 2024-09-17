"use client";

import React from "react";
import { withAuth } from "@/components/withAuth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, Edit, Trash2, PlusCircle } from "lucide-react";

interface Application {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  verifiedBy?: {
    name: string;
    email: string;
  };
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(`/api/loan-application/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setApplications(applications.filter((app) => app._id !== id));
        } else {
          console.error("Failed to delete application");
        }
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard/apply">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <PlusCircle className="w-5 h-5 mr-2" />
              Apply for a Loan
            </button>
          </Link>
          <button
            onClick={fetchApplications}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
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
                  Verified By
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-gray-700 transition-colors"
                >
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
                          : app.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {app.verifiedBy ? app.verifiedBy.name : "N/A"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/${app._id}/edit`}>
                        <button className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && applications.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No applications found.</p>
      )}
    </div>
  );
}

export default withAuth(Applications, ["user"]);
