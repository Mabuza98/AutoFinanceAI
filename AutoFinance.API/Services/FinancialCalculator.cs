using AutoFinance.API.Models;

namespace AutoFinance.API.Services;

public class FinancialCalculator : IFinancialCalculator
{
    public FinanceResponse Analyze(FinanceRequest request)
    {
        var totalIncome = request.MonthlySalary + request.OtherIncome;

        var loanAmount = request.CarPrice - request.Deposit;

        var monthlyRate = (double)(request.InterestRate / 100 / 12);
        var numberOfPayments = request.LoanTermMonths;
        var principal = (double)loanAmount;

        var estimatedInstallment = principal *
                                   (monthlyRate * Math.Pow(1 + monthlyRate, numberOfPayments)) /
                                   (Math.Pow(1 + monthlyRate, numberOfPayments) - 1);

        var totalDebt = request.ExistingDebtPayments + (decimal)estimatedInstallment;

        var debtToIncomeRatio = (totalDebt / totalIncome) * 100;

        string riskLevel;
        int approvalProbability;

        if (debtToIncomeRatio <= 40)
        {
            riskLevel = "Low";
            approvalProbability = 80;
        }
        else if (debtToIncomeRatio <= 50)
        {
            riskLevel = "Medium";
            approvalProbability = 60;
        }
        else
        {
            riskLevel = "High";
            approvalProbability = 20;
        }

        var maxInstallmentAllowed = totalIncome * 0.25m;
        decimal suggestedCarPrice = request.CarPrice;

        if ((decimal)estimatedInstallment > maxInstallmentAllowed)
        {
            suggestedCarPrice = request.CarPrice * 0.85m;
        }

        return new FinanceResponse
        {
            TotalIncome = totalIncome,
            EstimatedInstallment = Math.Round((decimal)estimatedInstallment, 2),
            DebtToIncomeRatio = Math.Round(debtToIncomeRatio, 2),
            RiskLevel = riskLevel,
            ApprovalProbability = approvalProbability,
            SuggestedCarPrice = Math.Round(suggestedCarPrice, 2)
        };
    }
}