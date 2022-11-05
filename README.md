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
  password: { String, mandatory }
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

### Verify Email Model

```yaml
{
  owner: {ObjectId, mandatory},
  token: {String, mandatory),
  createdAt: {Date, expires: 1 hour, default: false}
}
```

## User APIs

### POST /create

### POST /verify-email

### POST /resend-verification-email

### POST /forget-password
