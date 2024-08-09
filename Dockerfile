FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TodosAPI/TodosAPI.csproj", "TodosAPI/"]
COPY ["Todos.Application/Todos.Application.csproj", "Todos.Application/"]
COPY ["Todos.Infrastructure/Todos.Infrastructure.csproj", "Todos.Infrastructure/"]
COPY ["Todos.Domain/Todos.Domain.csproj", "Todos.Domain/"]
RUN dotnet restore "API/API.csproj"
COPY . .
WORKDIR "/src/TodosAPI"
RUN dotnet build "TodosAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TodosAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TodosAPI.dll"]