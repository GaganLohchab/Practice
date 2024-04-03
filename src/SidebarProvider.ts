import * as vscode from 'vscode'; 
// import { ExtensionContext, Uri } from 'vscode';
import { authenticateUser } from './extension';
import {authenticate} from './login';
import { getNonce } from './getNonce';
import { accessTokenKey, apiBaseUrl, refreshTokenKey } from './constants';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView){
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data: { type: string, value: string }) => {
      switch (data.type) {
        case "onAuthenticate": {
          authenticate(data.value);
          break;
        }
      }
    });
  }

  // public revive(panel: vscode.WebviewView) {
  //   this._view = panel;
  // }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const stylesheetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const nonce = getNonce();

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
                }; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${stylesheetUri}" rel="stylesheet">
                <link href="${scriptUri}" rel="stylesheet">
                
                <script nonce="${nonce}">
                  const tsvscode = acquireVsCodeApi();
                </script>
                <title>Login</title>
                
            </head>
            <body>
            <h1>Login to VSHunch</h1>
            <button id="loginButton">Login with GitHub to get started</button>
            <script nonce="${nonce}" src="${scriptUri}"></script>
            
            </body>
            </html>
        `;
  }
}




// <link href="${scriptUri}" rel="stylesheet">