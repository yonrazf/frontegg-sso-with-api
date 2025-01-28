import { Request, Response, Router, urlencoded } from "express";
import cors from "cors";
import { FE_BASE_URL, FE_COOKIE_DOMAIN } from "..";

const router = Router();

interface IDPSamlResponse {
  SAMLResponse: string;
  RelayState: string;
}

async function getRefreshToken(SamlBody: IDPSamlResponse): Promise<string> {
  const body = JSON.stringify(SamlBody);

  // send a request to FE in order to get back a refresh cookie
  const response = await fetch(`${FE_BASE_URL}/auth/saml/callback`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "manual", // redirect must be manual as to not lose the cookie
  });

  // Check if the server is attempting to redirect
  if (response.status === 302) {
    // Fetch the `Set-Cookie` header
    const setCookieHeader = response.headers.get("set-cookie");
    const location = response.headers.get("location");
    if (!location) {
      throw new Error("could not find location to get request cookies");
    }
    const urlParams = new URLSearchParams(new URL(location).search);

    // Get the value of the samlerrors parameter
    const error = urlParams.get("samlerrors");
    if (error) {
      throw new Error(error);
    }

    console.log("Set-Cookie Header:", setCookieHeader);

    if (!setCookieHeader) {
      throw new Error("No cookies returned in the response!");
    }

    // Extract the refresh token from the `Set-Cookie` header
    const refreshTokenMatch = setCookieHeader.match(/fe_refresh_[^=]+=[^;]+/);
    const refreshToken = refreshTokenMatch ? refreshTokenMatch[0] : null;

    if (refreshToken) {
      console.log("Extracted Refresh Token:", refreshToken);
      return refreshToken;
    } else {
      console.log("Refresh token not found in the Set-Cookie header!");
      throw new Error(
        "Refresh token not found in the Set-Cookie header! " + setCookieHeader
      );
    }
  } else {
    throw new Error(`Unexpected status code: ${response.status}`);
  }
}

async function callSamlCallback(req: Request, res: Response) {
  try {
    // The IdP will send a body with SAMLRequest and RelayState
    let { body } = req;

    // send a request to FE with the saml details and get back a refresh token
    const refreshToken = await getRefreshToken(body);

    // append the refresh token as a cookie
    res.cookie("fe_refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Really important for cross domain cookies
      maxAge: 3600000, // Cookie expiration time
      domain: FE_COOKIE_DOMAIN, // has to be your frontegg domain!!
    });

    res.status(302).redirect("http://localhost:5500/saml/callback"); // after appending cookies, redirect back to your client
  } catch (err) {
    res.status(500).send(err);
  }
}

router.post(
  "/auth/saml/callback", // your ACS URL set up on Okta will point to here
  urlencoded({ extended: true }),
  callSamlCallback
);

export { router as SamlRouter };
