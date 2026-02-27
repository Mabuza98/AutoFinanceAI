import React, { useState } from "react";
import "./App.css";

function App() {
    const [formData, setFormData] = useState({
        monthlySalary: "",
        otherIncome: "",
        monthlyExpenses: "",
        existingDebtPayments: "",
        carPrice: "",
        deposit: "",
        interestRate: "",
        loanTermMonths: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Format numbers as South African Rands
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
        }).format(amount);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const analyzeFinance = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            if (!API_URL) throw new Error("API URL not configured.");

            const payload = {
                monthlySalary: Number(formData.monthlySalary),
                otherIncome: Number(formData.otherIncome),
                monthlyExpenses: Number(formData.monthlyExpenses),
                existingDebtPayments: Number(formData.existingDebtPayments),
                carPrice: Number(formData.carPrice),
                deposit: Number(formData.deposit),
                interestRate: Number(formData.interestRate),
                loanTermMonths: Number(formData.loanTermMonths),
            };

            const response = await fetch(`${API_URL}/api/Finance/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch AI advice. Check backend or CORS.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-100">

            {/* Floating background blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative max-w-6xl w-full bg-white rounded-2xl shadow-xl p-6 md:p-12 grid md:grid-cols-2 gap-8">

                {/* Left: Form */}
                <div className="space-y-5 overflow-y-auto max-h-[80vh] pr-2">
                    <h1 className="text-3xl font-bold text-indigo-700">
                        AutoFinance AI
                    </h1>

                    <p className="text-gray-600">
                        Enter your financial details to analyze loan readiness and get AI advice
                    </p>

                    {Object.keys(formData).map((key) => (
                        <div key={key} className="flex flex-col items-start">
                            <label className="text-gray-700 font-medium mb-1 capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                            </label>

                            <input
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-3 py-2 
                                           w-full max-w-sm 
                                           focus:outline-none focus:ring-2 
                                           focus:ring-indigo-400 focus:border-indigo-400 
                                           transition"
                            />
                        </div>
                    ))}

                    <button
                        onClick={analyzeFinance}
                        disabled={loading}
                        className="mt-6 w-full max-w-sm bg-indigo-600 text-white 
                                   font-semibold py-3 rounded-lg 
                                   hover:bg-indigo-700 active:scale-95 
                                   transition duration-200 shadow-md"
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>

                    {error && <p className="text-red-500 mt-3">{error}</p>}
                </div>

                {/* Right: Results */}
                <div className="bg-indigo-50 rounded-xl p-6 max-h-[80vh] overflow-y-auto shadow-inner">
                    {result ? (
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-indigo-700 mb-3">
                                Results
                            </h2>

                            <p>Total Income: {formatCurrency(result.totalIncome)}</p>

                            <p>
                                Estimated Installment:{" "}
                                {formatCurrency(result.estimatedInstallment)}
                            </p>

                            <p>
                                Debt-to-Income Ratio:{" "}
                                {result.debtToIncomeRatioFormatted ||
                                    result.debtToIncomeRatio}
                            </p>

                            <p>Risk Level: {result.riskLevel}</p>

                            <p>
                                Approval Probability: {result.approvalProbability}%
                            </p>

                            <p>
                                Suggested Car Price:{" "}
                                {formatCurrency(result.suggestedCarPrice)}
                            </p>

                            <p className="mt-3 font-semibold text-indigo-800 bg-white p-3 rounded-lg shadow-sm">
                                Advice: {result.advice}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 mt-10">
                            Your AI advice will appear here after analyzing.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;