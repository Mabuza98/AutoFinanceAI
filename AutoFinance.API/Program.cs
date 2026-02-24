using AutoFinance.API.Services;
using FluentValidation;
using Azure.Identity;
using Azure.AI.OpenAI;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddValidatorsFromAssemblyContaining<FinanceRequestValidator>();

// AI Service using Managed Identity
builder.Services.AddScoped<AiAdviceService>();

builder.Services.AddScoped<IFinancialCalculator, FinancialCalculator>();

// CORS
var corsOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(';') ?? new string[] { "http://localhost:3000" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware / pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

// Exception middleware
app.UseMiddleware<AutoFinance.API.Middleware.ExceptionMiddleware>();

app.MapControllers();

app.Run();