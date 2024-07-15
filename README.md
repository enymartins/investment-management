
# Investment-Management

This project allows you to create one or more investments, search for them, and make withdrawals.

# How to Run 
1. Clone the repository:
```
git clone <repository-url>
cd <repository-name>
```
2. Switch to the develop branch to test or run the latest implementations:
```
git checkout develop
```
3. Install dependencies with the command:
```
yarn

```
4. Create a `.env` file in the root directory with the necessary configurations. You can follow `.env.example` in the project for guidance.

5. Run migrations:
```
yarn migration:run
````

7. Start the server:

```
yarn start:dev
```
## Testing Endpoints

You can test the endpoints using Swagger. Open your browser and navigate to:

```
http://localhost:3000/api

```

## Endpoints

## Users
```
POST /users
```
Description: Create new user to create investments

## Authentication
```
POST /auth/login
```
Description: Authenticate a user and obtain a JWT token.

## Investments

`GET /investments/:investmentId`

Description: Get an investment by ID.

```
GET /investments
```
Description: Get all investments from one user

```
POST /investments
```
Description: Create a new investment

## Withdrawals
```
GET /withdrawals/:investmentId
```
Description: View a withdrawal from a specific investment

```
POST /withdrawals/:investmentId
```
Description: Create a withdrawal for an investment
