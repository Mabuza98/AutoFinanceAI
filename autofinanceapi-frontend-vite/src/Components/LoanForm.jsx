import React, { useState } from "react";

export default function LoanForm({ onAnalyze }) {
  const initialState = {
    monthlySalary: "",
    otherIncome: "",
    monthlyExpenses: "",
    existingDebt: "",
    carPrice: "",
    deposit: "",
    interestRate: "",
    loanTerm: ""
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData); // send data to parent (App.jsx)
  };

  return (
    <form
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold mb-6">
        Enter Your Financial Details
      </h3>

      {[
        { label: "Monthly Salary", name: "monthlySalary" },
        { label: "Other Income", name: "otherIncome" },
        { label: "Monthly Expenses", name: "monthlyExpenses" },
        { label: "Existing Debt Payments", name: "existingDebt" },
        { label: "Car Price", name: "carPrice" },
        { label: "Deposit", name: "deposit" },
        { label: "Interest Rate (%)", name: "interestRate" },
        { label: "Loan Term (Months)", name: "loanTerm" },
      ].map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-sm mb-1 text-white/80">
            {field.label}
          </label>
          <input
            type="number"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/50"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition transform duration-300 py-3 rounded-xl font-semibold shadow-lg"
      >
        Analyze 🚀
      </button>
    </form>
  );
}