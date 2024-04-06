To test the APIs one by one, you can use a tool like Postman or cURL. Here's how you can test each API endpoint:

1. **Register a New User (Local Authentication)**:
   - Send a POST request to `http://localhost:3000/api/auth/register` with the following JSON body:
     ```json
     {
         "username": "example_user",
         "password": "example_password"
     }
     ```
   - You should receive a response with a JWT token if the registration is successful.

2. **Login (Local Authentication)**:
   - Send a POST request to `http://localhost:3000/api/auth/login` with the same JSON body used for registration.
   - You should receive a response with a JWT token if the login is successful.

3. **Register/Login with GitHub OAuth**:
   - Navigate to `http://localhost:3000/api/auth/github`. This will redirect you to GitHub's authentication page.
   - After authentication on GitHub, you'll be redirected back to your application with a JWT token appended to the URL (e.g., `http://localhost:3000/api/auth/github/callback?token=YOUR_JWT_TOKEN`).
   - You can extract the JWT token from the URL and use it for subsequent requests.

4. **Get User Profile**:
   - Send a GET request to `http://localhost:3000/api/profile` with the JWT token in the Authorization header (`Authorization: Bearer YOUR_JWT_TOKEN`).
   - This will return the profile details of the authenticated user.

5. **Update User Profile**:
   - Send a PUT request to `http://localhost:3000/api/profile` with the updated profile data in the request body and the JWT token in the Authorization header.
   - Ensure that the JWT token corresponds to the user whose profile you want to update.

6. **Get All User Profiles (Admin Only)**:
   - Send a GET request to `http://localhost:3000/api/profiles` with the JWT token of an admin user in the Authorization header.
   - This will return the profiles of all users if the authenticated user is an admin.

Ensure to include the JWT token in the Authorization header for authenticated routes, and adjust the request payloads as needed based on the requirements of each endpoint.
