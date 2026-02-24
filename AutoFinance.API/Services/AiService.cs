using AutoFinance.API.Models;

namespace AutoFinanceAI.Services
{
    public class AiService
    {
        public string GenerateExplanation(FinanceResponse result)
        {
            string message = $"Your estimated monthly installment is R{result.EstimatedInstallment:F2}. ";
            message += $"Your debt-to-income ratio is {result.DebtToIncomeRatio:F1}%, placing you in the {result.RiskLevel} risk category. ";

            if (result.RiskLevel == "High")
            {
                message += "This means approval may be difficult. ";
            }

            message += "To improve your chances: ";
            message += "1) Reduce existing debts. ";
            message += "2) Increase your deposit. ";
            message += "3) Consider a lower-priced vehicle.";

            return message;
        }
    }
}
