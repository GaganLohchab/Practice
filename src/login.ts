import express from "express";
require("dotenv").config();
import axios from "axios";
import * as vscode from "vscode";
import { refreshTokenKey, accessTokenKey, apiBaseUrl } from "./constants";
import { Util } from "./Util";

export const authenticate = (value: string) => {
    const app = express();
  
  
    
    app.listen(54321);

    app.get('auth/github/callback', async (req, res) => {
        res.redirect('https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}')
      })
    
      app.get('auth/github/callback',({query: {code}},res)=> {
        const body = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code
        }
    
        const opts = {headers: {Accept: 'application/json'}}
    
        axios
        .post('https://github.com/login/oauth/access_token',body,opts)
        .then((_res) => _res.data.accessToken)
        .then((token) => {
          res.redirect('/?token=${token}')
        })
        .catch((err) => {
          console.log(err)})
      });
    };
  // app.listen(54321, () => {
    //   vscode.commands.executeCommand(
    //     "vscode.open",
    //     vscode.Uri.parse("https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback&scope=user&state=random_string")
    //   );
    // });