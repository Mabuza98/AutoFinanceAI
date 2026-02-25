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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const analyzeFinance = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const API_URL = process.env.REACT_APP_API_URL;

            if (!API_URL) {
                throw new Error("API URL not configured.");
            }

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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

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
        <div className="App">
            <h1>AutoFinance AI - Loan Readiness Analyzer</h1>

            <div className="form">
                {Object.keys(formData).map((key) => (
                    <div key={key} style={{ marginBottom: "10px" }}>
                        <label>{key}:</label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <button onClick={analyzeFinance} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze"}
                </button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            {result && (
                <div className="results" style={{ marginTop: "20px" }}>
                    <h2>Results:</h2>
                    <p>Total Income: {result.totalIncome}</p>
                    <p>
                        Estimated Installment:{" "}
                        {result.estimatedInstallmentFormatted ||
                            result.estimatedInstallment}
                    </p>
                    <p>
                        Debt-to-Income Ratio:{" "}
                        {result.debtToIncomeRatioFormatted ||
                            result.debtToIncomeRatio}
                    </p>
                    <p>Risk Level: {result.riskLevel}</p>
                    <p>Approval Probability: {result.approvalProbability}%</p>
                    <p>Suggested Car Price: {result.suggestedCarPrice}</p>
                    <p>Advice: {result.advice}</p>
                </div>
            )}
        </div>
    );
}

export default App;