"use client";
import { withAuth } from "@/components/withAuth";
import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaFilter } from "react-icons/fa";

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

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
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
        setApplications(
          applications.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );
      } else {
        console.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  console.log(applications);

  const filteredApplications = applications.filter(
    (app) => filter === "all" || app.status === filter
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Loan Verification</h1>
      <div className="mb-4 flex items-center">
        <FaFilter className="mr-2 text-gray-500" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded p-2 text-gray-800"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Applicant</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Purpose</th>
              <th className="py-3 px-4 text-left">Date Applied</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app._id} className="border-b text-black">
                <td className="px-4 py-2">
                  {app.userId.name}
                  <br />
                  {app.userId.email}
                </td>
                <td className="px-4 py-2">${app.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{app.purpose}</td>
                <td className="px-4 py-2">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      app.status === "verified"
                        ? "bg-green-500 text-white"
                        : app.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(app._id, "verified")}
                        className="mr-2 text-green-500 hover:text-green-700"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "rejected")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(VerifierPanel, ["verifier", "admin"]);
