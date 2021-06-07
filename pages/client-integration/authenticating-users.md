---
title: Authenticating users
---

Authenticating ensures that your users can securely access the Knock API from the client
applications that they are using, without you exposing your secret API key and allowing blanket
access.

**Note: you only need to add the authentication here if you're integrating Knock on the client-side of
your applications and leveraging feeds or preferences.**

## API endpoints that require auth

The following calls will require authentication to be used (when called from the client):

- Fetching a user's notification feed
- Marking a message as read, seen, or archived

## Authentication (in development environments)

In a Knock development environment you can freely use your public key to authenticate all users
and do not need to implement any other security. That means you can get up and running like:

```js
import Knock from "@knocklabs/client";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Tell Knock to use the users id
knockClient.authenticate(currentUser.id);
```

Please note: in production environments you **will need to authenticate your users**. This ensures
that your users content is protected and cannot be read by malicious actors.

## Authentication (in production environments)

Using our JWT based authentication approach means using a shared secret to sign a new JWT on your
backend. This means you can generate the authentication token out-of-band and without
an additional network request.

### 1. Generate the signing key

You can find the signing key in the Knock dashboard under the "developers" section. Save the private
key shown to you here. Please note: you won't be shown this key again, so you'll need to regenerate
it if you lose access.

### 2. Sign the JWT

Within your backend application you'll need to sign the JWT and make it available to your front-end
client. Usually you'll do this by passing it down as a serialized property on the user.

At a minimum the JWT to be signed must have:

```json
{
  // The user that you're signing the token for
  "sub": "user_id",
  // When the token was issued
  "iat": 1608600116,
  // Expiry timestamp
  "exp": 1608603716
}
```

To sign your JWT as middleware:

```js
const jwt = require("jsonwebtoken");

app.use((req, res, next) => {
  if (!req.user) {
    return next();
  }

  // JWT NumericDates specified in seconds:
  const currentTime = Math.floor(Date.now() / 1000);

  res.locals({
    knockToken: jwt.sign(
      {
        sub: req.user.id,
        iat: currentTime,
        exp: currentTime + 60 * 60, // 1 hour from now
      },
      process.env.KNOCK_SIGNING_KEY,
      {
        algorithm: "RS256",
      }
    ),
  });
  next();
});
```

### 3. Send the JWT to the client

In your client application you can now use the JWT to authenticate with Knock:

```js
import Knock from "@knocklabs/client";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Tell Knock to use the users id and the token for the user
knockClient.authenticate(currentUser.id, currentUser.knockToken);
```

## Avoiding authentication

You can avoid authentication altogether by proxying requests to Knock via your backend,
although we don't recommend this approach as it will mean adding more latency for your users.
