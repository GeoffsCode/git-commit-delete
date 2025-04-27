import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    const deleteCommitCommand = vscode.commands.registerCommand('delete-git-commit.deleteCommit', async (commit: any) => {
        const commitHash = commit?.commit; // Safely get the commit hash

        if (!commitHash) {
            vscode.window.showErrorMessage('No commit information found.');
            return;
        }

        const confirm = await vscode.window.showWarningMessage(
            `Are you sure you want to delete commit ${commitHash}? This will rewrite history and create a backup branch.`,
            { modal: true },
            'Delete'
        );

        if (confirm !== 'Delete') {
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const workspacePath = workspaceFolders[0].uri.fsPath;

        exec(`git branch backup-before-delete`, { cwd: workspacePath }, (error) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to create backup branch: ${error.message}`);
                return;
            }

            exec(`git rebase --onto ${commitHash}^ ${commitHash}`, { cwd: workspacePath }, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Failed to delete commit: ${stderr}`);
                } else {
                    vscode.window.showInformationMessage(`Commit ${commitHash} deleted successfully.`);
                }
            });
        });
    });

    context.subscriptions.push(deleteCommitCommand);
}

export function deactivate() {}
