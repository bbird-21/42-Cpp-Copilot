import * as vscode from 'vscode'

export function getFileName() {
	// Get the currently active text editor
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		// Get the URI (Uniform Resource Identifier) of the currently opened file
		const fileUri = editor.document.uri;

		// Get the filename from the URI
		const fileName = vscode.workspace.asRelativePath(fileUri);

		return (fileName);
	}
	else
		return ('No active text editor');
}

export function	capitalizeFirstLetter(string : string) : string {
	
	return ( string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() );
}