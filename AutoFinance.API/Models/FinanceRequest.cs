using System.Text.Json.Serialization;

namespace AutoFinance.API.Models;

public class FinanceRequest
{
    [JsonPropertyName("monthlySalary")]
    public decimal MonthlySalary { get; set; }

    [JsonPropertyName("otherIncome")]
    public decimal OtherIncome { get; set; } = 0;

    [JsonPropertyName("monthlyExpenses")]
    public decimal MonthlyExpenses { get; set; }

    [JsonPropertyName("existingDebtPayments")]
    public decimal ExistingDebtPayments { get; set; } = 0;

    [JsonPropertyName("carPrice")]
    public decimal CarPrice { get; set; }

    [JsonPropertyName("deposit")]
    public decimal Deposit { get; set; } = 0;

    [JsonPropertyName("interestRate")]
    public decimal InterestRate { get; set; } = 12;

    [JsonPropertyName("loanTermMonths")]
    public int LoanTermMonths { get; set; } = 60;
}