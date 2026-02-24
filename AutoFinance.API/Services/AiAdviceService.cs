using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoFinance.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AutoFinance.API.Services
{
    public class AiAdviceService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly ILogger<AiAdviceService> _logger;

        public AiAdviceService(IConfiguration config, ILogger<AiAdviceService> logger)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _logger = logger;
            _httpClient = new HttpClient();
        }

        public async Task<string> GenerateAdvice(FinanceResponse response)
        {
            // ✅ Get API key safely from environment or appsettings.json
            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogWarning("OpenAI API key missing, using mock advice.");
                return "You are financially ready. Maintain your budget and debt levels.";
            }

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            var prompt = $"""
                A client has:
                Total Income: {response.TotalIncome}
                Debt To Income Ratio: {Math.Round(response.DebtToIncomeRatio * 100, 2)}%
                Risk Level: {response.RiskLevel}

                Provide short, simple financial advice in plain language.
            """;

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            try
            {
                var result = await _httpClient.PostAsync(
                    "https://api.openai.com/v1/chat/completions",
                    content
                );

                if (result.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    _logger.LogWarning("OpenAI API rate limited (429), using mock advice.");
                    return "You are financially ready. Maintain your budget and debt levels.";
                }

                result.EnsureSuccessStatusCode();

                var responseString = await result.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseString);

                var advice = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                _logger.LogInformation("AI advice generated successfully.");
                return advice ?? "No advice generated.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI advice could not be generated, returning fallback.");
                return $"AI advice could not be generated. Error: {ex.Message}";
            }
        }
    }
}