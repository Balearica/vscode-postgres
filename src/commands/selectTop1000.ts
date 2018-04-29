import BaseCommand from "../common/baseCommand";
import * as vscode from 'vscode';
import { PostgreSQLTreeDataProvider } from "../tree/treeProvider";
import { TableNode } from "../tree/tableNode";
import { EditorState } from "../common/editorState";

export class selectTop1000Command extends BaseCommand {
  async run(treeNode: TableNode) {
    const sql = `SELECT * FROM ${treeNode.table} LIMIT 1000;`
    const textDocument = await vscode.workspace.openTextDocument({content: sql, language: 'postgres'});
    await vscode.window.showTextDocument(textDocument);
    EditorState.connection = treeNode.connection;
    // TODO: Execute Query
  }
}