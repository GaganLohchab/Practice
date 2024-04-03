
function authenticate() {
  tsvscode.postMessage({
    type: "onAuthenticate",
    value: "https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback&scope=user&state=random_string"
    
  });
}

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", authenticate);