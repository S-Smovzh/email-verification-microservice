# Verification service (NestJS)

This service is responsible for sending verification emails.

---

## Responsibilities

- Verify registration
- Verify data change (email, username, phone number, password)
- Verify password reset

---

## Installing App

1. Clone this repository `git clone https://github.com/S-Sergio-A/email-verification-microservice.git`
2. Navigate to the root directory and add the `.env` file with your database and microservice data:
```
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASSWORD
SENDER_EMAIL
SENDER_NAME
   
REDIS_DB_NAME
REDIS_PASSWORD
REDIS_ENDPOINT
REDIS_PORT
   
FRONT_URL
```
3. Install dependencies

```javascript
npm install
```

---

### Running the server in development mode

```javascript
npm start:dev
```

### Running the server in production mode

```javascript
npm build

npm start:prod
```

# License

---

This project uses the following [license](https://github.com/S-Sergio-A/email-verification-microservice/blob/master/LICENSE).
