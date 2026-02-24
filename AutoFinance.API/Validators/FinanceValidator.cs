using FluentValidation;
using AutoFinance.API.Models;

public class FinanceRequestValidator : AbstractValidator<FinanceRequest>
{
    public FinanceRequestValidator()
    {
        RuleFor(x => x.MonthlySalary).GreaterThan(0);
        RuleFor(x => x.OtherIncome).GreaterThanOrEqualTo(0);
        RuleFor(x => x.MonthlyExpenses).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ExistingDebtPayments).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CarPrice).GreaterThan(0);
        RuleFor(x => x.Deposit).GreaterThanOrEqualTo(0);
        RuleFor(x => x.InterestRate).InclusiveBetween(0.1m, 50m);
        RuleFor(x => x.LoanTermMonths).InclusiveBetween(1, 120); ;
    }
}

