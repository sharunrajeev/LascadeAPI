# LascadeAPI
API created as part of coding challenge

## API Endpoints 

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
    DB_NAME=<database_name>
    DB_USER=<database_username>
    DB_PASSWORD=<database_password>
    DB_HOSTNAME=<database_hostname>
    ```
5. Unless this is values are not present in the DB, server will not start.
6. Run the server using the command
    ```bash
    npm run dev
    ```
