import { init } from "next-firebase-auth";

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    onLoginRequestError: (err) => {
      console.error(err);
    },
    onLogoutRequestError: (err) => {
      console.error(err);
    },
    firebaseAuthEmulatorHost: "localhost:9099",
    firebaseAdminInitConfig: {
      credential: {
        projectId: "levas-1297e",
        clientEmail:
          "firebase-adminsdk-y4cok@levas-1297e.iam.gserviceaccount.com",
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY
          : "",
      },
      databaseURL: "https://levas-1297e.firebaseio.com",
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: "AIzaSyAZ1XAW_zj-NJziPUoYt6lOw1nv_uYbx1s", // required
      authDomain: "levas-1297e.firebaseapp.com",
      databaseURL: "https://levas-1297e.firebaseio.com",
      projectId: "levas-1297e",
    },
    cookies: {
      name: "LEVAS", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error(err);
    },
    onTokenRefreshError: (err) => {
      console.error(err);
    },
  });
};

export default initAuth;
