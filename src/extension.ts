import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('DebugTrace extension is now active!');

    // Register commands
    const insertLogCommand = vscode.commands.registerCommand('debugtrace.insertLog', insertLog);
    const insertLogWithMessageCommand = vscode.commands.registerCommand('debugtrace.insertLogWithMessage', insertLogWithMessage);
    const deleteAllLogsCommand = vscode.commands.registerCommand('debugtrace.deleteAllLogs', deleteAllLogs);
    const commentAllLogsCommand = vscode.commands.registerCommand('debugtrace.commentAllLogs', commentAllLogs);
    const uncommentAllLogsCommand = vscode.commands.registerCommand('debugtrace.uncommentAllLogs', uncommentAllLogs);

    context.subscriptions.push(
        insertLogCommand,
        insertLogWithMessageCommand,
        deleteAllLogsCommand,
        commentAllLogsCommand,
        uncommentAllLogsCommand
    );
}

export function deactivate() {}

async function insertLog() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    
    let variableName = '';
    if (!selection.isEmpty) {
        // Use selected text
        variableName = document.getText(new vscode.Range(selection.start, selection.end));
    } else {
        // Enhanced detection for nested objects
        const position = selection.active;
        const line = document.lineAt(position.line);
        const lineText = line.text;
        
        // Find the variable/object at cursor position, including dots
        const wordPattern = /[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*/g;
        let match;
        while ((match = wordPattern.exec(lineText)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;
            if (position.character >= start && position.character <= end) {
                variableName = match[0];
                break;
            }
        }
        
        // Fallback to simple word detection
        if (!variableName) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (wordRange) {
                variableName = document.getText(wordRange);
            }
        }
    }

    const config = vscode.workspace.getConfiguration('debugtrace');
    const logType = config.get<string>('logType') || 'print';
    const prefix = config.get<string>('logMessagePrefix') || 'DebugTrace🔎:';
    const includeFileInfo = config.get<boolean>('includeFileInfo') || true;
    const addSeparatorLine = config.get<boolean>('addSeparatorLine') || false;

    const fileName = document.fileName.split('/').pop() || 'unknown';
    const lineNumber = selection.active.line + 1;

    let logMessage = '';
    if (variableName) {
        if (includeFileInfo) {
            logMessage = `${prefix} [${fileName}:${lineNumber}] ${variableName}: \${${variableName}}`;
        } else {
            logMessage = `${prefix} ${variableName}: \${${variableName}}`;
        }
    } else {
        if (includeFileInfo) {
            logMessage = `${prefix} [${fileName}:${lineNumber}] Debug point`;
        } else {
            logMessage = `${prefix} Debug point`;
        }
    }

    const logStatement = `${logType}('${logMessage}');`;
    
    // Smart insertion: find the proper end of the current statement
    const insertPosition = findInsertionPoint(document, selection.active);
    
    let textToInsert = '';
    const indentation = getIndentation(document.lineAt(insertPosition.line - 1).text);
    if (addSeparatorLine) {
        textToInsert = `${indentation}${logStatement}\n${indentation}// ----\n`;
    } else {
        textToInsert = `${indentation}${logStatement}\n`;
    }

    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.insert(insertPosition, textToInsert);
    });
}

async function insertLogWithMessage() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const customMessage = await vscode.window.showInputBox({
        prompt: 'Enter custom log message',
        placeHolder: 'Custom debug message'
    });

    if (!customMessage) {
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    
    const config = vscode.workspace.getConfiguration('debugtrace');
    const logType = config.get<string>('logType') || 'print';
    const prefix = config.get<string>('logMessagePrefix') || 'DebugTrace🔎:';
    const includeFileInfo = config.get<boolean>('includeFileInfo') || true;
    const addSeparatorLine = config.get<boolean>('addSeparatorLine') || false;

    const fileName = document.fileName.split('/').pop() || 'unknown';
    const lineNumber = selection.active.line + 1;

    let logMessage = '';
    if (includeFileInfo) {
        logMessage = `${prefix} [${fileName}:${lineNumber}] ${customMessage}`;
    } else {
        logMessage = `${prefix} ${customMessage}`;
    }

    const logStatement = `${logType}('${logMessage}');`;
    
    // Smart insertion: find the proper end of the current statement
    const insertPosition = findInsertionPoint(document, selection.active);
    
    let textToInsert = '';
    const indentation = getIndentation(document.lineAt(insertPosition.line - 1).text);
    if (addSeparatorLine) {
        textToInsert = `${indentation}${logStatement}\n${indentation}// ----\n`;
    } else {
        textToInsert = `${indentation}${logStatement}\n`;
    }

    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.insert(insertPosition, textToInsert);
    });
}

async function deleteAllLogs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const config = vscode.workspace.getConfiguration('debugtrace');
    const logType = config.get<string>('logType') || 'print';
    const prefix = config.get<string>('logMessagePrefix') || 'DebugTrace🔎:';

    const text = document.getText();
    const lines = text.split('\n');
    
    // Find lines that contain our log statements
    const linesToDelete: number[] = [];
    const separatorLinesToDelete: number[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if line contains our log statement pattern
        if (line.includes(`${logType}(`) && line.includes(prefix)) {
            linesToDelete.push(i);
            
            // Check if next line is a separator
            if (i + 1 < lines.length && lines[i + 1].trim() === '// ----') {
                separatorLinesToDelete.push(i + 1);
            }
        }
    }

    if (linesToDelete.length === 0) {
        vscode.window.showInformationMessage('No DebugTrace log statements found.');
        return;
    }

    const allLinesToDelete = [...linesToDelete, ...separatorLinesToDelete].sort((a, b) => b - a);

    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
        for (const lineNumber of allLinesToDelete) {
            const lineRange = new vscode.Range(lineNumber, 0, lineNumber + 1, 0);
            editBuilder.delete(lineRange);
        }
    });

    vscode.window.showInformationMessage(`Deleted ${linesToDelete.length} DebugTrace log statement(s).`);
}

async function commentAllLogs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const lines = text.split('\n');
    
    let changedLines = 0;

    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // More flexible pattern to match DebugTrace logs
            // Look for print() or debugPrint() with typical DebugTrace patterns
            const isDebugTracelog = (
                (trimmedLine.includes('print(') || trimmedLine.includes('debugPrint(')) &&
                (trimmedLine.includes('DebugTrace🔎:') || trimmedLine.includes('[') && trimmedLine.includes(']:')) &&
                !trimmedLine.startsWith('//')
            );
            
            if (isDebugTracelog) {
                const lineRange = new vscode.Range(i, 0, i, line.length);
                const indentation = getIndentation(line);
                const commentedLine = `${indentation}// ${trimmedLine}`;
                editBuilder.replace(lineRange, commentedLine);
                changedLines++;
            }
        }
    });

    if (changedLines > 0) {
        vscode.window.showInformationMessage(`Commented ${changedLines} DebugTrace log statement(s).`);
    } else {
        vscode.window.showInformationMessage('No uncommented DebugTrace log statements found.');
    }
}

async function uncommentAllLogs() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const lines = text.split('\n');
    
    let changedLines = 0;

    await editor.edit((editBuilder: vscode.TextEditorEdit) => {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check if line is a commented DebugTrace log statement
            if (trimmedLine.startsWith('//')) {
                const contentAfterComment = trimmedLine.replace(/^\/\/\s*/, '');
                
                // More flexible pattern to match DebugTrace logs
                const isCommentedDebugTrace = (
                    (contentAfterComment.includes('print(') || contentAfterComment.includes('debugPrint(')) &&
                    (contentAfterComment.includes('DebugTrace🔎:') || contentAfterComment.includes('[') && contentAfterComment.includes(']:'))
                );
                
                if (isCommentedDebugTrace) {
                    const lineRange = new vscode.Range(i, 0, i, line.length);
                    const indentation = getIndentation(line);
                    const uncommentedLine = `${indentation}${contentAfterComment}`;
                    editBuilder.replace(lineRange, uncommentedLine);
                    changedLines++;
                }
            }
        }
    });

    if (changedLines > 0) {
        vscode.window.showInformationMessage(`Uncommented ${changedLines} DebugTrace log statement(s).`);
    } else {
        vscode.window.showInformationMessage('No commented DebugTrace log statements found.');
    }
}

function getIndentation(line: string): string {
    const match = line.match(/^\s*/);
    return match ? match[0] : '';
}

function findInsertionPoint(document: vscode.TextDocument, position: vscode.Position): vscode.Position {
    let currentLine = position.line;
    const maxLines = document.lineCount;
    
    // Start from current line and look forward to find the end of the statement
    let openBraces = 0;
    let openParens = 0;
    let openBrackets = 0;
    let inString = false;
    let stringChar = '';
    
    // First, check if we're already at the end of a simple statement
    const currentLineText = document.lineAt(currentLine).text.trim();
    if (currentLineText.endsWith(';') && !currentLineText.includes('{') && !currentLineText.includes('(') && !currentLineText.includes('[')) {
        return new vscode.Position(currentLine + 1, 0);
    }
    
    // Scan from current line forward to find the end of the statement
    for (let lineNum = currentLine; lineNum < maxLines; lineNum++) {
        const line = document.lineAt(lineNum).text;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const prevChar = i > 0 ? line[i - 1] : '';
            
            // Handle string literals
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }
            
            if (inString) {
                continue;
            }
            
            // Count braces, parentheses, and brackets
            switch (char) {
                case '{':
                    openBraces++;
                    break;
                case '}':
                    openBraces--;
                    break;
                case '(':
                    openParens++;
                    break;
                case ')':
                    openParens--;
                    break;
                case '[':
                    openBrackets++;
                    break;
                case ']':
                    openBrackets--;
                    break;
                case ';':
                    // If we hit a semicolon and all brackets are closed, this is the end
                    if (openBraces === 0 && openParens === 0 && openBrackets === 0) {
                        return new vscode.Position(lineNum + 1, 0);
                    }
                    break;
            }
        }
    }
    
    // If we couldn't find a proper end, default to the line after current
    return new vscode.Position(currentLine + 1, 0);
}
