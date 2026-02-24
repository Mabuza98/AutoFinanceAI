using AutoFinance.API.Services;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Add services
// --------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddValidatorsFromAssemblyContaining<FinanceRequestValidator>();

// Register AiAdviceService (it now reads the API key safely from IConfiguration)
builder.Services.AddScoped<AiAdviceService>();

builder.Services.AddScoped<IFinancialCalculator, FinancialCalculator>();

// --------------------
// CORS policy
// --------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // fix typo
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --------------------
// Middleware / pipeline
// --------------------


    app.UseSwagger();
    app.UseSwaggerUI();


app.UseHttpsRedirection();

// Enable CORS before Authorization
app.UseCors("AllowReactApp");

app.UseAuthorization();

// Exception middleware
app.UseMiddleware<AutoFinance.API.Middleware.ExceptionMiddleware>();

app.MapControllers();

app.Run();