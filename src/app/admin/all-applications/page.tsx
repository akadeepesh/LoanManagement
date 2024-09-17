"use client";

import { withAuth } from "@/components/withAuth";
import { useState, useEffect } from "react";

function AllApplications() {
  const [applications, setApplications] = useState([]);

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Loan Applications</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">User</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Purpose</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Verified By</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app: any) => (
            <tr key={app._id}>
              <td className="border p-2">{app.userId?.name || "N/A"}</td>
              <td className="border p-2">${app.amount || 0}</td>
              <td className="border p-2">{app.purpose || "N/A"}</td>
              <td className="border p-2">{app.status || "N/A"}</td>
              <td className="border p-2">{app.verifiedBy?.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withAuth(AllApplications, ["admin"]);
