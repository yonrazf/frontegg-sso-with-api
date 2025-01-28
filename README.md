# SSO with Frontegg APIs
This is a sample application to showcase how to implement a login with sso flow using Frontegg APIs
Currently supports only SAML login

Refer to [this guide](https://support.frontegg.com/frontegg/article/ART-3940-how-to-implement-single-sign-on-sso-flow-with-frontegg-apis) for initial setup

## Basic steps to set up
1. set your acs url as your backend (for this example it's http://localhost:5500/auth/saml/callback)

2. redirect a user to the idp on login (Is implemented on getPrelogin on loginWithCustomSSO.tsx)

3. after login the idp will send a request to the acs url you've set with the below payload:

 ```bash
   { "RelayState": string (the state that Frontegg provided to the IDP in the request to the IDP), "SAMLResponse": string(the authenticated entity data) }
 ```
That route will append a refresh cookie header to the response.

4. In your backend route handler you'll have to parse this response and extract the refresh token.
 * __*important*__ you'll have to manually stop redirects so you won't lose the cookie (implemented on server/src/routes/samlLogin.ts -> getRefreshToken)

5. After refresh token is extracted include cookies redirect back to the client:
   - make sure sameSite is set to 'none'
   - make sure domain is set as your frontegg domain
   - redirect to your client's route to handle a saml connection
  
6. In the client, you'll have to get the cookie that's been appended to the broswer and send a POST https://[your-frontegg-domain]/identity/resources/auth/v2/user/token/refresh to get a JWT using the refresh token
7. Store the data recieved in your state handler

## Intallation

1. Clone the repo
2. add .env files to each of the folders

*server* 
  ```bash
    FE_BASE_URL=https://[YOUR_FRONTEGGG_DOMAIN].frontegg.com
    FE_COOKIE_DOMAIN=.[YOUR_FRONTEGG_DOMAIN]
  ```

*client*
   ```bash
    VITE_FE_BASE_URL=https://[YOUR_FRONTEGGG_DOMAIN].frontegg.com
  ```
3. install depemdencies on both folders
  ```bash
  npm i
  ```

4. Run both the client and the server. The client should be running on localhost:5500 and the server on localhost:3001
  
```bash
  npm run dev // inside both folders
  ```
  
