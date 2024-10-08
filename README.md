# TODOs

The TODOs application is a task management tool designed to help users efficiently organize and track their daily tasks.

## Techstack:
DDD Architecture with:

### Front-End:
- React 
- Redux, Redux Toolkit, Redux RTK Query
- TypeScript
- Webpack
- Material-UI (MUI)
- SCSS
- ESLint + Prettier

### Back-End:
- ASP.NET Core 
- EF Core + MS-SQL
- CQRS + MediatR
- Automapper
- DI
- Swagger
- FluentValidation
- API Versioning
- xUnit


## How to run:

- **Node.js (v14.x or higher)**
- **Docker**
- **.NET Core SDK (v8.0)**


## 1) Clone the Repository:

```
git clone https://github.com/AntonKarpeza/todos.git
cd todos
```

## 2) Set Up Environment Variables:
### For Local Development:
- Create a `.env.local` file in the `src/todos-app` directory for the React front-end:

```
REACT_APP_TODO_API_V1_BASE_URL=http://localhost:5196/v1/
```


- For the .NET Core API, update `appsettings.json` in the `src/Todos.API` directory to include the connection string:

```
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=TodoDb;User=sa;Password=Your_password123;TrustServerCertificate=True;"
}
```


- Update the `docker-compose.db.yml` file to include your database credentials:

```
services:
  mssql:
    environment:
      SA_PASSWORD: "Your_password123"
```


### For Docker Development:
- Create a `.env.docker` file in the `src/todos-app` directory for the React front-end:

```
REACT_APP_TODO_API_V1_BASE_URL=http://localhost:8080/v1/
```


- Update the `docker-compose.yml` file to include your database credentials:
```
services:
  mssql:
    environment:
      SA_PASSWORD: "Your_password123"
  todo-api:
    environment:
      - ConnectionStrings__DefaultConnection=Server=mssql,1433;Database=TodoDb;User=sa;Password=Your_password123;TrustServerCertificate=True;
```


## 3) Install Necessary Software:
Ensure that all dependencies for both the front-end and back-end are installed.

### Front-End:
Navigate to the `src/todos-app` directory and install the Node.js packages:
```
cd src/todos-app
npm install
```


### Back-End:
Restore the .NET dependencies:
```
cd src/Todos.API
dotnet restore
```


## 4) Running the Application Locally:
### Database in Docker:
- From the root directory, run the following command:
```
docker-compose -f docker-compose.db.yml up -d
```


### Back-End:
Navigate to the `src/Todos.API` directory and run the API:
```
cd src/Todos.API
dotnet run
```
- The API should now be running on http://localhost:5196. Check swagger http://localhost:5196/swagger/index.html


### Front-End:
Navigate to the `src/todos-app` directory and start the React development server:
```
cd src/todos-app
npm start
```
- The front-end should now be running on http://localhost:3000.


## 5) Running the Application with Docker:
To run the application with Docker:
### Step 1: Build and Run Docker Containers
- From the root directory, run the following command:
```
docker-compose up --build
```
-This will build and start the SQL Server, .NET Core API, and React front-end services.

### Troubleshooting: TODO API may stop at the beginning of loading containers. You just need to restart it.


### Step 2: Access the Application
- The API will be available at http://localhost:8080. Check swagger http://localhost:8080/swagger/index.html
- The front-end will be available at http://localhost:3000.