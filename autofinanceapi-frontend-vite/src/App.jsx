import React, { useState } from "react";

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

    const API_URL = import.meta.env.VITE_API_URL;
    //console.log("API URL:", API_URL);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const analyzeFinance = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, Number(v)])
            );

            const response = await fetch(`${API_URL}/api/Finance/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Failed to connect to backend. Check if API is running.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (num) =>
        typeof num === "number" ? `R${num.toLocaleString()}` : num;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
                🚗 AutoFinance AI - Loan Readiness Analyzer
            </h1>

            <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {/* FORM */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4">Your Information</h2>

                    {Object.keys(formData).map((key) => (
                        <div key={key} className="mb-3">
                            <label className="block text-sm mb-1">{key}</label>
                            <input
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}

                    <button
                        onClick={analyzeFinance}
                        disabled={loading}
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>

                    {error && <p className="mt-2 text-red-400">{error}</p>}
                </div>

                {/* RESULTS */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4">Results</h2>

                    {loading && <p className="animate-pulse">Analyzing... 🚀</p>}

                    {result && (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Total Income:</span>
                                <span>{formatCurrency(result.totalIncome)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Estimated Installment:</span>
                                <span>{formatCurrency(result.estimatedInstallment)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Debt-to-Income Ratio:</span>
                                <span>{result.debtToIncomeRatio}%</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Approval Probability:</span>
                                <span>{result.approvalProbability}%</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Risk Level:</span>
                                <span
                                    className={`px-3 py-1 rounded-full font-bold ${result.riskLevel === "Low"
                                            ? "bg-green-500/20 text-green-300"
                                            : result.riskLevel === "Medium"
                                                ? "bg-yellow-500/20 text-yellow-300"
                                                : "bg-red-500/20 text-red-300"
                                        }`}
                                >
                                    {result.riskLevel}
                                </span>
                            </div>

                            <div className="mt-4 bg-blue-500/10 p-3 rounded-lg border border-blue-400/30">
                                <p>{result.advice}</p>
                            </div>
                        </div>
                    )}

                    {!result && !loading && (
                        <p className="text-white/70">Results will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;