# Voucher Pool API

## Overview
A voucher pool is a collection of voucher codes that can be used by customers to get discounts on website. Each code may only be used once, and we would like to know when it was used by the customer. Since there can be many customers in a voucher pool, we need a call that auto-generates voucher codes for each customer. Here’s a screenshot to give you an idea what it looks like:

### Core Functionality
* Generate Voucher Code for each customer for a given Special Offer and expiration data
* Provide an endpoint, reachable via HTTP, which receives a Voucher Code and Email and
  validates the Voucher Code. In Case it is valid, return the Percentage Discount and set the
  date of usage
* For a given Email return all its valid Voucher Codes with the Name of the Special Offer


### Validation & Error Handling
- DTO-based validation using `class-validator`.
- Global exception handling for proper error messaging.

  
## Installation
### 1. Clone the repository:
   ```bash
git clone https://github.com/devabdallahragheb/holo-voucherpool.git
cd holo-voucherpool
   ```
### 2. Create a .env file
Create a .env file in the root directory based on the .env.example file:
 ```bash
cp .env.example .env
```
### 3. Run with Docker (Optional)
   
If you do not have PostgreSQL you can run the application with Docker, which will automatically set up PostgreSQL,  and the application container:
 ```bash
docker-compose up --build
```

Note: If you use Docker, skip steps 4 and 5.

### 4. Install dependencies:
     npm install
   
### 5. Start the server:
 ```bash
   npm run start:dev
   ```
### 6. Access the application:

API: http://localhost:3000
Swagger: http://localhost:3000/api-docs
OpenAPI :http://localhost:3000/api-docs-json
##API Documentation
The API documentation is available via Swagger. Once the server is running, navigate to:

## API Endpoints

### **Customer**
#### Create a New customer
- **POST** `/api/v1/customer`
  - **Request Body** *(JSON)*:
    ```json
    {
      "name": "abdullah abdelglil",
      "email": "aabdelglil4@gmail.com"
    }
    ```
#### Get all customers
- **GET** `/api/v1/customer`
  
### **Offer**
#### Create a New Offer
- **POST** `/api/v1/offer`
  - **Request Body** *(JSON)*:
    ```json
    {
      "name": "black friday",
      "discountPercentage": 10
    }
    ```
#### Get all Offer
- **GET** `/api/v1/offer`
### **Voucher**
#### Generate a voucher code for a customer and offer
- **POST** `/api/v1/voucher/generate`
  - **Request Body** *(JSON)*:
    ```json
    {
      "offerId": "9128b69c-5e0b-40b3-953d-5750e53fd5d5",
      "customerId": "6b69f0e2-c215-4939-af23-acbfaa482309",
      "expirationDate": "2024-12-26T01:10:55.522Z" 
    }
    ```
#### Redeem a voucher
- **POST** `/api/v1/voucher/redeem-voucher`
    - **Request Body** *(JSON)*:
    ```json
    {
      "code": "9128b69c-5e0b-40b3-953d-5750e53fd5d5",
      "email": "6b69f0e2-c215-4939-af23-acbfaa482309"
    ```
#### List of valid voucher codes for a customer
- **GET** `/api/v1/voucher/get-valid-vouchers-by-email?email=aabdelglil4@gmail.com`
#### List of voucher codes for a customer
- **GET** `/api/v1/voucher/get-vouchers-by-email?email=aabdelglil4@gmail.com`
## Design

    Entity Relationship Diagram (ERD), class diagrams, and requirements are available in the design folder at the root of the repository.
    
##Postman Collection

Access the Postman collection [here](https://www.postman.com/orange-satellite-870733/workspace/public/collection/27835951-33adba73-5bd3-4af0-a7ad-af78d4185cd9?action=share&creator=27835951)
 ### Tasks
* [*] Design a database schema
* [*] Write an application
* [*] API endpoint for verifying and redeeming vouchers
* [*] Implement API Rate Limiting: Protect the API from abuse by implementing rate limiting on the endpoints.
* [*] Use Database Transactions: Ensure data consistency by implementing use of transactions in your application.
* [*] Write unit tests
* [*] Using Typescript
* [*] A nice little Readme on how to run
* [*] ***PLUS POINT:*** Writing swagger for the API
* [*] ***PLUS POINT:*** Docker file to setup the whole application with all the dependencies (database, nodejs)
