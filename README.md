# Summary
 A full-stack MERN boilerplate app

# Demo

Coming soon!

# Technologies Used
* Mongodb
* Express
* React
* Node

## React Components
* Auth components: success redirects to profile page
  * Login
  * Signup
* Layout components
  * Nav
  * Footer
* Home (stub)
* Profile: Authorized route - logged in users only

## Technical Notes

A single page application (SPA) that uses react-router and axios to interact with a very loosely coupled back-end. The back-end can sign up, log in, or verify a user using JSON web tokens (JWTs). 

### Decoupling Instructions
* Enable CORS on back-end routes
* Delete /* route from app.js
* In React, use full links instead of relative links in axios calls
* Consider moving client and server to separate locations

# Backend Routes
METHOD | URL | Purpose
--- | --- | ---
POST | /auth/signup | Adds new user to user database
POST | /auth/login | Authenticates login details
POST | /auth/current/user | If token present, refresh user data

## Still To Do
* Make detailed and user-friendly alerts for error/success messages 
* Make more authorized pages
* Use cookies instead of localStorage


