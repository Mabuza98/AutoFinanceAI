namespace AutoFinance.API.Models
{
    public class FinanceResponse
    {
        public decimal TotalIncome { get; set; }          // e.g., 27000
        public decimal EstimatedInstallment { get; set; } // e.g., 6228.45

        // Debt-to-Income ratio as a percentage (0–100)
        public decimal DebtToIncomeRatio { get; set; }

        public string RiskLevel { get; set; } = string.Empty;
        public int ApprovalProbability { get; set; }      // e.g., 80
        public decimal SuggestedCarPrice { get; set; }    // e.g., 300000
        public string Advice { get; set; } = string.Empty;

        // Optional: helper to format DTI nicely
        public string DebtToIncomeRatioFormatted => $"{Math.Round(DebtToIncomeRatio, 2)}%";

        // Optional: helper to format installment nicely
        public string EstimatedInstallmentFormatted => $"{Math.Round(EstimatedInstallment, 2)}";
    }
}

