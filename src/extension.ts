import * as vscode from 'vscode';
import * as querystring from 'querystring';
import { ExtensionContext } from 'vscode';
import {SidebarProvider} from './SidebarProvider';
import {authenticate} from './authenticate';
import {Util} from  './Util';
import { accessTokenKey, apiBaseUrl, refreshTokenKey } from './constants';
import express from "express";
require("dotenv").config();
import axios from "axios";
import { URLSearchParams } from "url";


/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: ExtensionContext): void {

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('vshunch-sidebar-view', sidebarProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vshunch.authenticate", () => {
			vscode.window.showInformationMessage('Hello World from VSHunch!');
			authenticate(() => {});
		})
	);

	console.log('Congratulations, your extension "vshunch" is now active!');
}

export function authenticateUser(url: string): void {
	const app = express();

	// Start the server
	app.listen(3001, () => {
		console.log("Express server started on port 3001");
		// open the GitHub authentication page in the user's browser
		vscode.commands.executeCommand(
			"vscode.open",
		    vscode.Uri.parse("https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback")
		);
	});

	// Handle the OAuth callback
	app.get('auth/github/callback', ({ query }, res) => {
		const body = {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: query.code
		};

		const opts = { headers: { Accept: 'application/json' } };

		axios
			.post('https://github.com/login/oauth/access_token', body, opts)
			.then((response) => response.data.accessToken)
			.then((token) => {
				res.redirect(`/?token=${token}`);
			})
			.catch((err) => {
				console.log(err);
			});
	
	
	  
		res.end(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src 'self' https://fonts.gstatic.com;">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      </head>
      <body>
          <h1>Success! You may now close this tab.</h1>
          <style>
            html, body {
              background-color: #1a1a1a;
              color: #c3c3c3;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 100%;
              margin: 0;
            }
          </style>
      </body>
    </html>
    `);
	  });
}


export function deactivate(): void {}

// <meta
//           http-equiv="Content-Security-Policy"
//           content="default-src vscode-resource:; form-action vscode-resource:; frame-ancestors vscode-resource:; img-src vscode-resource: https:; script-src 'self' 'unsafe-inline' vscode-resource:; style-src 'self' 'unsafe-inline' vscode-resource:;"
//         />
// export function authenticateUser(url: string): void {
// 	const app = express();
// 	let server;

// 	// Start the server
// 	server = app.listen(3001, () => {
// 		// open the GitHub authentication page in the user's browser
// 		vscode.commands.executeCommand(
// 			"vscode.open",
// 		    vscode.Uri.parse("https://github.com/login/oauth/authorize?client_id=1141eb58b9ab1fc3ae89&redirect_uri=http://localhost:3001/auth/github/callback")
// 		);
// 	});

// 	// Handle the OAuth callback
// 	app.get('auth/github/callback', async (req, res) => {
// 		res.redirect('https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}')
// 		res.send("You logged in Successfully")
// 	});

// 	app.get('auth/github/callback',({query: {code}},res)=> {
// 		const body = {
// 			client_id: process.env.CLIENT_ID,
// 			client_secret: process.env.CLIENT_SECRET,
// 			code
// 		};

// 		const opts = {headers: {Accept: 'application/json'}};

// 		axios
// 			.post('https://github.com/login/oauth/access_token',body,opts)
// 			.then((_res) => _res.data.accessToken)
// 			.then((token) => {
// 				res.redirect('/?token=${token}')
// 			})
// 			.catch((err) => {
// 				console.log(err)});

		
		
// 	});
// };