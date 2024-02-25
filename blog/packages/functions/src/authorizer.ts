import { AppSyncAuthorizerEvent, AppSyncAuthorizerResult } from "aws-lambda";
import jwt, { Secret, VerifyOptions, JwtHeader, JwtPayload } from "jsonwebtoken";
import jwksClient, { JwksClient, SigningKey } from "jwks-rsa";

const client: JwksClient = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header: JwtHeader, callback: (err: Error | null, signingKey?: Secret) => void): void {
  client.getSigningKey(header.kid as string, (err, key?: SigningKey) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey: Secret = key!.getPublicKey();
    callback(null, signingKey);
  });
}

const publicQueryOperations = ["listPosts", "getPostById"];

export const handler = async (event: AppSyncAuthorizerEvent): Promise<AppSyncAuthorizerResult> => {

  console.log(`### Operation: ${event.requestContext.operationName}`)
  // console.log("HERE")

  if (publicQueryOperations.includes(event.requestContext.operationName!)) {
    console.info("Public operation authorized")
    return {
      isAuthorized: true,
    };
  }

  const token = event.authorizationToken?.split(" ")[1];
  if (!token) {
    return { isAuthorized: false };
  }

  try {
    const decoded = await new Promise<JwtPayload | string>((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ["RS256"] } as VerifyOptions, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded!);
        }
      });
    });

    // Token is valid
    console.info("Protected operation authorized")
    return { isAuthorized: true };
  } catch (error) {
    console.error("Token validation error", error);
    return { isAuthorized: false };
  }
};
