
## About this project

This is a Node.js-based cloud storage platform, which uses Express.js for the backend, Next.js for the frontend, and MongoDB for storing user data.

### Prerequisites
Before working with this project:
- Install Node.js version 16 or higher.
- Create a MongoDB cluster at [MongoDB](https://www.mongodb.com/).

### Development
1. Clone the project repository and navigate to its root directory:
```bash
git clone https://github.com/sweet-peach/vault.git
```
```bash
cd ./vault
```
2. Navigate to the backend folder:
```bash
cd ./backend
``` 
3. Install dependencies:
```bash
npm i
``` 
3. Create a file named `.env` and copy the contents of `env.template` into it.

4. Configure the following fields in the `.env` file:

- `PORT`: Specify the port for the backend server.
- `MONGODB_URL`: URL to your MongoDB cluster.
- `JWT_SECRET`: Generated a JWT secret key of 64 length or above. You can use a tool like [jwtsecret.com](https://jwtsecret.com/generate)

5. Start the development backend server:

```bash
npm run dev
``` 
6. Navigate to the frontend folder:
```bash
cd ./../frontend
``` 
7. Install dependencies:
```bash
npm i
``` 
8. Create a file named ```.env``` and copy the contents of ```env.template``` into it.

9. Configure the following fields in the ```.env``` file:

- ```NEXT_PUBLIC_BACKEND_BASE_URL```: URL to your backend server. Modify only if the backend server's port is different from the default.

10. Start the development frontend  server:
 ```bash
npm run dev
``` 

### Deployment
Backend server almost all endpoints start with `/api/` besides from `/avatar/`. Use a reverse proxy (e.g., Nginx) to deploy the server on a domain. Ensure your domain is correctly configured to point to your server before deployment.

1. Clone the project repository and navigate to its root directory
```bash
git clone https://github.com/sweet-peach/vault.git
```
```bash
cd ./vault
```

2. Navigate to the backend folder:
```bash
cd ./backend
``` 

3. Install dependencies:
```bash
npm i
``` 

4. Create a file named .env and copy the contents of env.template into it.

5. Configure the following fields in the `.env` file:

- `PORT`: Specify the port for the backend server.
- `MONGODB_URL`: URL to your MongoDB cluster.
- `JWT_SECRET`: Generated a JWT secret key of 64 length or above. You can use a tool like [jwtsecret.com](https://jwtsecret.com/generate)

6. Start the production backend server:
```bash
npm run start
``` 
7. Navigate to the frontend folder:
```bash
cd ..
cd ./frontend
``` 
8. Install dependencies:
```bash
npm i
``` 
9. Create a file named `.env` and copy the contents of `env.template` into it.

10. Configure the following fields in the `.env` file:

- `NEXT_PUBLIC_BACKEND_BASE_URL`: Add your domain name here.

Example .env file:
```
NEXT_PUBLIC_BACKEND_BASE_URL=https://example.com
```

11. Build the frontend:
 ```bash
npm run build
```

12. Start the frontend server:
 ```bash
npm run start
```
13. Configure a reverse proxy to redirect requests:
- Redirect all requests with the `/api/` endpoint to your backend server.
- Redirect all requests with the `/avatar/` endpoint to your backend server.
- Redirect other requests to your frontend server.

### Other configuration
The backend includes a configuration file located at `/core/config.js`, which allows you to customize the following settings:
- `avatar_maximum_size`: Specifies the maximum allowable size for a user's avatar upload, measured in bytes.
- `files_directory`: Defines the directory path where all user files are stored.
- `avatars_directory`: Sets the directory path for storing user avatars.
- `jwt_expiration_in_ms`: Determines the expiration time for JSON Web Tokens (JWTs), specified in milliseconds.


