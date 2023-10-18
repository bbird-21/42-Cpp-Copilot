import vscode = require('vscode')

import {
	ExtensionContext, TextEdit, TextEditorEdit, TextDocument, Position, Range
} from 'vscode'


import {
	capitalizeFirstLetter,
	getFileName,
  } from './getFileName'

import { fileURLToPath } from 'url';

const	createNewFile = (filename: string, cpp_content: string, uri: vscode.Uri) => {
	const	ws = vscode.workspace.workspaceFolders;						//	List of all workspaces open in editor.
	if ( !ws || ws.length === 0 )
		return ;

	const	path = uri.fsPath.slice(0, uri.fsPath.length - filename.concat(".hpp").length);
	const	wsedit = new vscode.WorkspaceEdit();														//	Workspace API management.
	const	newFileUri = vscode.Uri.joinPath(vscode.Uri.parse(path), filename.concat(".cpp"));			//	Create the uri of the new file.
	const	fs_content = new TextEncoder().encode(cpp_content);											//	Content of the file.
	wsedit.createFile(newFileUri);																		//	Creation of the file.
	vscode.workspace.fs.writeFile(newFileUri, fs_content);												//	Writting to the file.
}

const	cppCopilot = (context: vscode.ExtensionContext) => {


	const	watcher = vscode.workspace.createFileSystemWatcher('**/*.hpp');
	watcher.onDidCreate(async (uri) => {

	// Open the newly created document
	const doc = await vscode.workspace.openTextDocument(uri);
	// Show the document in the editor
	const editor = await vscode.window.showTextDocument(doc);

	if ( doc == undefined ) {
		return ;
	}
	if ( doc.getText().trim() !== '') {
		console.log("file is not empty");
		return ;
	}
	//	Here verify if the filename begin with a capital letter.
	const	split_filename = uri.fsPath.split('/');
	const	filename = split_filename[split_filename.length - 1].split('.')[0];
	const	cppContent =
`#include "${filename}.hpp"\n
${filename}::${filename}() {\n\n}\n
${filename}::~${filename}() {\n\n}\n
${filename}::${filename} ( const ${filename}& cpy ) {
	*this = cpy;\n}\n
${filename}& ${filename}::operator= ( const ${filename}& cpy ) {
	return *this;\n}\n`

	createNewFile(filename, cppContent, uri);
	// Define the content to insert at the beginning of the document
	const hppContent =
`#ifndef __${filename.toUpperCase()}__
#define __${filename.toUpperCase()}__\n\n
class ${(filename)} {\n
public:\n
	${filename}( void );
	~${filename}();
	${filename} ( const ${filename}& cpy );
	${filename}& operator= ( const ${filename}& cpy );\n
private:\n};\n
#endif /* __${filename.toLocaleUpperCase()}__ */`;

	// Insert the content at the beginning of the document
	editor.edit((editBuilder) => {
	editBuilder.insert(new vscode.Position(0, 0), hppContent);
	});

	// Save the document
	await editor.document.save();
	// Register the watcher subscription
	// context.subscriptions.push(watcher);
	});
};

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('cppCopilot', cppCopilot);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
