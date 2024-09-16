"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";

function ApplyForLoan() {
  const [formData, setFormData] = useState({
    fullName: "",
    loanAmount: "",
    loanTenure: "",
    employmentStatus: "",
    reasonForLoan: "",
    employmentAddress: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/apply-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard/applications");
      } else {
        const data = await response.json();
        setError(
          data.message || "An error occurred while submitting the application."
        );
      }
    } catch (error) {
      setError("An error occurred while submitting the application.");
    }
  };

  return (
    <div className="max-w-2xl bg-white mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">APPLY FOR A LOAN</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full name as it appears on bank account
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="loanAmount"
              className="block text-sm font-medium text-gray-700"
            >
              How much do you need?
            </label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="loanTenure"
              className="block text-sm font-medium text-gray-700"
            >
              Loan tenure (in months)
            </label>
            <input
              type="number"
              id="loanTenure"
              name="loanTenure"
              value={formData.loanTenure}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="employmentStatus"
              className="block text-sm font-medium text-gray-700"
            >
              Employment status
            </label>
            <input
              type="text"
              id="employmentStatus"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="reasonForLoan"
              className="block text-sm font-medium text-gray-700"
            >
              Reason for loan
            </label>
            <textarea
              id="reasonForLoan"
              name="reasonForLoan"
              value={formData.reasonForLoan}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="employmentAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Employment address
            </label>
            <input
              type="text"
              id="employmentAddress"
              name="employmentAddress"
              value={formData.employmentAddress}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default withAuth(ApplyForLoan, ["user"]);
