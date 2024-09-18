"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { Loader2 } from "lucide-react";

function ApplyForLoan() {
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    fullName: "",
    loanTenure: "",
    employmentStatus: "",
    employmentAddress: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/loan-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          purpose: formData.purpose,
          fullName: formData.fullName,
          loanTenure: Number(formData.loanTenure),
          employmentStatus: formData.employmentStatus,
          employmentAddress: formData.employmentAddress,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(
          data.message || "An error occurred while submitting the application."
        );
      }
    } catch (error) {
      setError("An error occurred while submitting the application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">
          Apply for a Loan
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full name as it appears on bank account
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name as it appears on bank account"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="amount" className="sr-only">
                How much do you need?
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="How much do you need?"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="loanTenure" className="sr-only">
                Loan tenure (in months)
              </label>
              <input
                id="loanTenure"
                name="loanTenure"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Loan tenure (in months)"
                value={formData.loanTenure}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="employmentStatus" className="sr-only">
                Employment status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.employmentStatus}
                onChange={handleChange}
              >
                <option value="">Select employment status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div>
              <label htmlFor="employmentAddress" className="sr-only">
                Employment address
              </label>
              <input
                id="employmentAddress"
                name="employmentAddress"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Employment address"
                value={formData.employmentAddress}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="purpose" className="sr-only">
                Purpose of loan
              </label>
              <textarea
                id="purpose"
                name="purpose"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Purpose of loan"
                value={formData.purpose}
                onChange={handleChange}
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
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(ApplyForLoan, ["user"]);
