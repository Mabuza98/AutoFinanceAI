using AutoFinance.API.Models;


namespace AutoFinance.API.Services;

public interface IFinancialCalculator
{
    FinanceResponse Analyze(FinanceRequest request);
}
