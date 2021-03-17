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

- Fetching a users notification feed
- Marking a notification as read or seen
- Fetching a users preferences
- Updating a users preferences

## JWT based authentication

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
import Knock from "@knocklabs/web";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Tell Knock to use this token for the user
knockClient.authenticate(currentUser.knockToken);
```

## Token based authentication

Our token based authentication method requires that you make a call to the Knock API to generate
an authentication token to be used, requiring a network call in order for the call to be issued.

### 1. Issue a token signing request

In your backend, create a new endpoint that can generate the user token:

```js
import Knock from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

app.post("/generate-knock-token", (req, res) => {
  const { token } = await knock.tokens.generateUserToken(req.currentUser.id);
  res.json({ token });
});
```

### 2. Use the token to authenticate the user

On your client you can now call the new endpoint you created and authenticate with Knock
using the token.

```js
import Knock from "@knocklabs/web";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Generate the token by calling your API
const { token } = await Api.generateKnockToken();

// Tell Knock to use this token for the user
knockClient.authenticate(token);
```

## Avoiding authentication

You can avoid authentication altogether by proxying requests to Knock via your backend,
although we don't recommend this approach as it will mean adding more latency for your users.
