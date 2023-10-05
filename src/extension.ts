import vscode = require('vscode')

import {
	ExtensionContext, TextEdit, TextEditorEdit, TextDocument, Position, Range
} from 'vscode'


import {
	capitalizeFirstLetter,
	getFileName, 
  } from './getFileName'

import { fileURLToPath } from 'url';

const	createNewFile = (filename: string, cpp_content: string) => {
	const	ws = vscode.workspace.workspaceFolders;						//	List of all workspaces open in editor.
	if (!ws || ws.length == 0)
		return ;
	const	wsedit = new vscode.WorkspaceEdit();						//	Necessary to create file.
	const	ws_uri = ws[0].uri;											//	The associated uri for this ws.
	const	newFileUri = vscode.Uri.joinPath(ws_uri, filename);			//	Create the uri of the new file.
	const	fs_content = new TextEncoder().encode(cpp_content);			//	Content of the file.
	wsedit.createFile(newFileUri);										//	Creation of the file.
	vscode.workspace.fs.writeFile(newFileUri, fs_content);				//	Writting to the file.
}

const	FileExtension = (context: vscode.ExtensionContext) => {
	

	const	watcher = vscode.workspace.createFileSystemWatcher('**/*.hpp');
	watcher.onDidCreate(async (uri) => {
	
	//	Here verify if the filename begin with a capital letter.
	const	split_filename = uri.fsPath.split('/');
	const	filename = split_filename[split_filename.length - 1].split('.')[0];
	
	console.log(filename);
	const	cpp_content =	`#include "${capitalizeFirstLetter(filename)}.hpp"\n\n${filename}::${filename}() {\n\n}\n\n${filename}::~${filename}() {\n\n}`
	
	createNewFile(filename.concat(".cpp"), cpp_content);
	// Open the newly created document
	const document = await vscode.workspace.openTextDocument(uri);

	// Show the document in the editor
	const editor = await vscode.window.showTextDocument(document);

	// Define the content to insert at the beginning of the document
	const insertionText = `#ifndef __${filename.toUpperCase()}__\n#define __${filename.toUpperCase()}__\n\nclass ${(
	filename)} {\n\npublic:\n\n\t${(filename)}(void);\n\t~${(filename)}(void)\n\nprivate:\n\n};\n\n#endif /* __${filename.toLocaleUpperCase()}__ */`;

	// Insert the content at the beginning of the document
	editor.edit((editBuilder) => {
	editBuilder.insert(new vscode.Position(0, 0), insertionText);
	});

	// Save the document
	await editor.document.save();
	// Register the watcher subscription
	// context.subscriptions.push(watcher);
	});
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your "file-extension" extension is now active!');

	// Create a command "file-extension.helloWorld"
	let disposable = vscode.commands.registerCommand('file-extension', FileExtension);
	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}
