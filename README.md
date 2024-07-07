# Lascade API

## Overview

This API allows you to perform user authentication and CSV data processing to database. Below are the details of the available endpoints, including their request methods, parameters, and example responses.

## How to start with the project
1. Clone this project.
2. Install all the dependencies using the command
    
    ```bash
    npm i
    ```
3. Install postgreSQL and Redis locally
4. Create an `.env` file in the project folder with the following secrets
    
    ```env
    DATABASE_URL=postgres://username:password@localhost:5432/<database_name>
    JWT_SECRET=<>
    REDIS_HOST=<localhost>
    REDIS_PORT=<6379>
    PORT=<3000>
    ```
5. Unless this is values are not present in the DB, server will not start.
6. Run the server using the command
    ```bash
    npm run dev
    ```

## Authentication

CSV data processor endpoint require authentication via an bearer token. Include the following header in your requests:

Authorization: Bearer YOUR_API_KEY

To generate this token, you need to sign in to the service through login endpoint

## Endpoints

### 1. Register user

#### Request

- **Method**: POST
- **URL**: `/api/user/register`

#### Parameters

- **Body Parameters**:
  - `email` (string) - The email of the user.
  - `password` (string) - A password of the user.

### 2. Login user

#### Request

- **Method**: POST
- **URL**: `/api/user/login`

#### Parameters

- **Body Parameters**:
  - `email` (string) - The email of the user.
  - `password` (string) - A password of the user.

### 3. Upload CSV file

#### Request

- **Method**: POST
- **URL**: `/api/csv/upload`

#### Parameters

- **Body Parameters**:
  - `file` (File) - CSV file.

### Detailed Documentation
[Postman Documentation](https://documenter.getpostman.com/view/28230659/2sA3e1Bq4K)

## Error Handling

All errors follow the same format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Error message detailing what went wrong"
  }
}
```

## To View the CSV upload queue
Visit [CSV Queue UI](http://128.199.19.207/api/queue/queue/csvQueue)

## Support

If you encounter any issues or have any suggestions, please contact our me at [sharunpublic@gmail.com](mailto:sharunpublic@gmail.com).

