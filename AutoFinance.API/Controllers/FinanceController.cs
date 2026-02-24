using AutoFinance.API.Models;
using AutoFinance.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AutoFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceController : ControllerBase
    {
        private readonly IFinancialCalculator _calculator;
        private readonly AiAdviceService _aiService;
        private readonly ILogger<FinanceController> _logger;

        public FinanceController(
            IFinancialCalculator calculator,
            AiAdviceService aiService,
            ILogger<FinanceController> logger)
        {
            _calculator = calculator;
            _aiService = aiService;
            _logger = logger;
        }

        /// <summary>
        /// Analyzes user's car loan readiness, calculates affordability, and generates AI advice.
        /// </summary>
        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze(FinanceRequest request)
        {
            _logger.LogInformation(
                "Received finance request: Salary={Salary}, CarPrice={CarPrice}",
                request.MonthlySalary, request.CarPrice
            );

            var response = _calculator.Analyze(request);

            _logger.LogInformation("Calculated estimated installment: {Installment}", response.EstimatedInstallment);

            response.Advice = await _aiService.GenerateAdvice(response);

            _logger.LogInformation("Returning response with AI advice.");

            return Ok(response);
        }
    }
}
