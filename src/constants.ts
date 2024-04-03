export const _prod_ = process.env.NODE_ENV === "production";
export const apiBaseUrl =  "https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:54321/auth/github/callback";
export const accessTokenKey = "@vsinder/token" + (_prod_ ? "" : "dev");
export const refreshTokenKey = "@vsinder/refresh-token" + (_prod_ ? "" : "dev");