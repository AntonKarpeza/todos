using Microsoft.EntityFrameworkCore;
using Todos.API.Configurations;
using Todos.Infrastructure.Data;
using Todos.Infrastructure.IoC;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure API versioning
builder.Services.AddApiVersioningConfigured();

// Configure Swagger
builder.Services.AddSwaggerConfigured();

// Register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly));

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Configure EF Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();

// .NET Native DI Abstraction
NativeInjectorBootStrapper.RegisterServices(builder.Services);

var app = builder.Build();

app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Ensure the database is migrated
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUiConfigured();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();