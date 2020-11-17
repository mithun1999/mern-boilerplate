<img align="left" src="https://github.com/mithun1999/mern-boilerplate/blob/main/assets/mern-boilerplate.png" width="480" height="349" />

<div>
  <p>
    <h1 align="left">MERN Stack Boilerplate
    </h1>
  </p>

  <p>
A complete MERN Stack boilerplate with Redux as stage management library.
  </p>

  ___



  <div>
    <a href="https://mithunkumar.me" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88b9005f9ed382fb2a5_button_get_in_touch.svg" width="121" height="34">
    </a>
    <a href="https://github.com/mithun1999/" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88bb1958c3253756c39_button_follow_on_github.svg" width="168" height="34">
    </a>
  </div>

  ___
</div>

# Features

- Email Sign up
- Email Sign in
- Google Sign in
- Facebook Sign in
- Activate account after email verification
- Forgot Password
- Different Routes for Users and Admin

## Frameworks/Libraries used

- ReactJS
- React Bootstrap
- Redux
- NodeJS
- ExpressJS
- MongoDB

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install this boilerplate.

1. Move to the project directory and run the following commands.
```bash
npm install
npm run client-install
```
2. Create .env file in root directory.
```bash
DATABASE="Your MongoDB URI"
SECRET="Any text"
CLIENT_URL="React app URL(http://localhost:3000)"
JWT_ACCOUNT_ACTIVATION="Any text"
EMAIL_FROM="Email you have registered in SendGrid"
SENDGRID_API="Your SendGrid API"
JWT_RESET_PASSWORD="Any Text"
GOOGLE_CLIENT="Your Google Client API"
````
3. Create .env file in client directory.
```bash
REACT_APP_GOOGLE_CLIENT="Your Google Client API"
REACT_APP_FACEBOOK_CLIENT="Your Facebook App ID"
REACT_APP_BACKEND_URL="URL where backend is running(http://localhost:8000/api)"
````
4. Move to the project root directory and run the following commands to start the app.
```bash
npm run backend
npm run frontend
```

### If you have any queries, feel free to contact me :)
