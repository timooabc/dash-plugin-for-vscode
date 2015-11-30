// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var exec = require('child_process').exec;
var platform = require('process').platform;

function getDashURI(language, keyWord) {
	var docType = '';
	if (language){
		docType = "&keys=" + language;
	}
	return 'dash-plugin://query=' + encodeURIComponent(keyWord) + docType;
}

function getCommand(language, keyWord) {
	switch (platform) {
		case 'win32':
			return 'cmd.exe /c start "" "' + getDashURI(language, keyWord) + '"';
		case 'linux':
			// return 'zeal --query "' + language + '"';
			//todo
		default:
			
			return 'open -g "' + getDashURI(language, keyWord) + '"';
	}
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dash-plugin-for-vscode" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.dash', function () {
		// The code you place here will be executed every time your command is executed
		
		var editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		
		var selection = editor.selection;
		var language = (editor.document.languageId).toLowerCase();
		var keyWord = editor.document.getText(selection);
		
		var cmd = getCommand(language, keyWord);
		console.log('cmd: ' + cmd);
		exec(cmd, function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
			console.log('exec error: ' + error);
			}
		})
		

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!');
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;