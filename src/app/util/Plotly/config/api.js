// export const SERVER_HOST = "http://ec2-3-17-58-186.us-east-2.compute.amazonaws.com";
export const SERVER_HOST = "http://localhost:8080";
// export const SERVER_HOST = "https://canvas-backend-shopify.herokuapp.com";
// export const SERVER_HOST = "https://canvas-print.herokuapp.com"
// export const SERVER_HOST = "https://podably.herokuapp.com"                        // DEVELOPMENT_ENVIRONMENT
// export const SERVER_HOST = "https://podably-staging.herokuapp.com"                // PRODUCTION_ENVIRONMENT

const APP_APIS = {
  AUTH: "/auth",
  LOGIN: "/auth/login"
};

Object.keys(APP_APIS).map((key) => {
  APP_APIS[key] = `${SERVER_HOST}/api${APP_APIS[key]}`;
});

export const API = { ...APP_APIS };


