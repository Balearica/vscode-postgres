import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import { PostgreSQLTreeDataProvider } from "../tree/treeProvider";
import { IConnection } from "../common/IConnection";
import { Constants } from "../common/constants";
import * as uuidv1 from "uuid/v1";
import { Global } from "../common/global";

'use strict';

export class addConnectionCommand extends BaseCommand {
  async run() {
    const tree = PostgreSQLTreeDataProvider.getInstance();

    const host = await vscode.window.showInputBox({ prompt: "The hostname of the database", placeHolder: "host", ignoreFocusOut: true });
    if (!host) return;

    const user = await vscode.window.showInputBox({ prompt: "The PostgreSQL user to authenticate as", placeHolder: "user", ignoreFocusOut: true });
    if (!user) return;

    const password = await vscode.window.showInputBox({ prompt: "The password of the PostgreSQL user", placeHolder: "password", ignoreFocusOut: true, password: true });
    if (password === undefined) return;

    const port = await vscode.window.showInputBox({ prompt: "The port number to connect to", placeHolder: "port", ignoreFocusOut: true, value: "5432" });
    if (!port) return;

    const certPath = await vscode.window.showInputBox({ prompt: "[Optional] SSL certificate path. Leave empty to ignore", placeHolder: "certificate file path", ignoreFocusOut: true });
    if (certPath === undefined) return;
    
    let connections = tree.context.globalState.get<{ [key: string]: IConnection }>(Constants.GlobalStateKey);
    if (!connections) connections = {};

    const id = uuidv1();
    connections[id] = { host, user, port, certPath };

    if (password) {
      await Global.keytar.setPassword(Constants.ExtensionId, id, password);
    }

    await tree.context.globalState.update(Constants.GlobalStateKey, connections);
    tree.refresh();
  }
}