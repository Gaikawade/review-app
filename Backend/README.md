# Project - Review_App

### Key points

-   In this project we will work feature wise. That means we pick one object like user, movie and review at a time. We work through it's feature. The steps would be:
    1. We create it's model.
    2. We build it's APIs.
    3. We test these APIs.
    4. We deploy these APIs.
    5. We integrate these APIs with frontend.
    6. We will repeat steps from Step 1 to Step 5 for each feature in this project.
-   This project is divided into 4 features namely User, Product, Cart and Order. You need to work on a single feature at a time. Once that is completed as per above mentioned steps. You will be instructed to move to next Feature.
-   In this project we are changing how we send token with a request. Instead of using a custom header key like x-api-key, you need to use Authorization header and send the JWT token as Bearer token.
-   Follow the naming conventions exactly as instructed.

## Feature I - User

### User Model

```yaml
{
  name: { String, mandatory },
  email: { String, mandatory, Unique },
  password: { String, mandatory },
  isVerified: { Boolean, mandatory, default: false}
}
```

### Verify Email Model

```yaml
{
  owner: {ObjectId, mandatory},
  token: {String, mandatory),
  createdAt: {Date, expires: 1 hour, default: false}
}
```

### Password Reset Model

```yaml
{
  owner: {ObjectId, mandatory},
  token: {String, mandatory),
  createdAt: {Date, expires: 1 hour, default: false}
}
```

## User APIs

### POST /create
- Create a user document from request body.
- Generate a OTP (with minimum of 6 digits) and send it to the user's email address, in order to verify the user's email.
> ** NOTE:_** The verification email will be send through Mailtrap and by using the `nodemailer` package.
- Password and OTP should be encrypted by using BYCRYPT, before saving into database.

### POST /verify-email
- Allow an user to verify their email with the OTP (which is received through mail).
- Once the email is verified, delete the user verify email document form the database and change the user's model `isVerified` key value  to true.

### POST /resend-verification-email
- Allow the user to get another verification email (only if the user is not verified) by providing their `userId` in the request body.
- Generate a OTP (with minimum of 6 digits) and send it to the user's email address, in order to verify the user's email.

### POST /forget-password
- Allow the user to reset their password by providing email as the input in request body.
- Genereate a token by using `CRYPTO` package and update token in password reset document.
- Generate a reset password URL with token and userId in the params.
- Send that URL to the user's email address.

### POST /reset-password
- Allow the user to reset the password by using the `reset-password link`.
- By using the token and user-id from the `reset-password link URL`, we can reset the password.
- Accept the new password from request body and check if the new password matches the old one. If it matches the old password then send a error message like `Your new password matches the old password`.
- Save the new password, and delete the password-reset-token document.
- Send a mail using Mailtrap and nodemailer, and inform the user that the password has been changed.

### POST /signin
- Allow the user to sign in using their email and password.
- After successful login, generate a `jwt-token`.

> ** NOTE:_** For error handeling user ```express-async-errors``` instead of `try & catch` and declare that error handler code as a global middleware.