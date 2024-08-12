# Base image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Todos.API/Todos.API.csproj", "Todos.API/"]
COPY ["src/Todos.Application/Todos.Application.csproj", "Todos.Application/"]
COPY ["src/Todos.Infrastructure/Todos.Infrastructure.csproj", "Todos.Infrastructure/"]
COPY ["src/Todos.Infrastructure.IoC/Todos.Infrastructure.IoC.csproj", "Todos.Infrastructure.IoC/"]
COPY ["src/Todos.Domain/Todos.Domain.csproj", "Todos.Domain/"]
RUN dotnet restore "Todos.API/Todos.API.csproj"
COPY . .
WORKDIR "/src/src/Todos.API"
RUN dotnet build "Todos.API.csproj" -c Release -o /app/build

# Publish image
FROM build AS publish
RUN dotnet publish "Todos.API.csproj" -c Release -o /app/publish

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Todos.API.dll"]