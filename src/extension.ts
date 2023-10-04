
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { capitalizeFirstLetter, getFileName } from './getFileName';

	// vscode.window.showInformationMessage('Hello World from File Extension!');

	export function activate(context: vscode.ExtensionContext) {
		console.log('Félicitations, votre extension "file-extension" est maintenant active !');
	
		// Crée une commande "file-extension.helloWorld"
		let disposable2 = vscode.commands.registerCommand('file-extension', () => {
			
		
			let filename = getFileName().toUpperCase().split('.')[0];
			
			vscode.window.showInformationMessage(filename);
			// Crée un écouteur de système de fichiers qui surveille les fichiers .ts
			const watcher = vscode.workspace.createFileSystemWatcher('**/*.hpp');
			
			// Lorsqu'un fichier .cpp est créé
			watcher.onDidCreate(async (uri) => {
				// Ouvre le document nouvellement créé
				const document = await vscode.workspace.openTextDocument(uri);
				
				// Affiche le document dans l'éditeur
				const editor = await vscode.window.showTextDocument(document);
				
				// Insère "Hello World" au début du fichier
				editor.edit((editBuilder) => {
					editBuilder.insert(new vscode.Position(0, 0),
					"#ifndef __");
					editBuilder.insert(new vscode.Position(0, 0),
					filename.concat("__"));
					editBuilder.insert(new vscode.Position(0, 0),
					"\n#define __");
					editBuilder.insert(new vscode.Position(0, 0),
					filename.concat("__"));
					editBuilder.insert(new vscode.Position(0, 0),
					"\n\nclass ");
					editBuilder.insert(new vscode.Position(0, 0),
					capitalizeFirstLetter(filename));
					editBuilder.insert(new vscode.Position(0, 0),
					" {\n");
					editBuilder.insert(new vscode.Position(0, 0),
					"\n\npublic :\n\n\t");
					editBuilder.insert(new vscode.Position(0, 0),
					capitalizeFirstLetter(filename));
					editBuilder.insert(new vscode.Position(0, 0),
					"( void );\n\t~");
					editBuilder.insert(new vscode.Position(0, 0),
					filename);
					editBuilder.insert(new vscode.Position(0, 0),
					"( void )\n\n");
					editBuilder.insert(new vscode.Position(0, 0),
					"private : \n\n};");
					editBuilder.insert(new vscode.Position(0, 0),
					"\n\n#endif ");
					editBuilder.insert(new vscode.Position(0, 0),
					"/* __");
					editBuilder.insert(new vscode.Position(0, 0),
					filename.concat("__"));
					editBuilder.insert(new vscode.Position(0, 0),
					" */");
				});

				// Enregistre le document
				await editor.document.save();
			});
			
			// Ajoute le watcher aux abonnements de l'extension pour qu'il soit disposé lors de la désactivation
			context.subscriptions.push(watcher);
		});
		
		// Ajoute la commande aux abonnements de l'extensiona	
		context.subscriptions.push(disposable2);
	}
	// vscode.window.showInformationMessage('Hello Kiwi !');


// This method is called when your extension is deactivated
export function deactivate() {}
