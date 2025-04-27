"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
function activate(context) {
    const deleteCommitCommand = vscode.commands.registerCommand('delete-git-commit.deleteCommit', (commit) => __awaiter(this, void 0, void 0, function* () {
        const commitHash = commit === null || commit === void 0 ? void 0 : commit.commit; // Safely get the commit hash
        if (!commitHash) {
            vscode.window.showErrorMessage('No commit information found.');
            return;
        }
        const confirm = yield vscode.window.showWarningMessage(`Are you sure you want to delete commit ${commitHash}? This will rewrite history and create a backup branch.`, { modal: true }, 'Delete');
        if (confirm !== 'Delete') {
            return;
        }
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const workspacePath = workspaceFolders[0].uri.fsPath;
        (0, child_process_1.exec)(`git branch backup-before-delete`, { cwd: workspacePath }, (error) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to create backup branch: ${error.message}`);
                return;
            }
            (0, child_process_1.exec)(`git rebase --onto ${commitHash}^ ${commitHash}`, { cwd: workspacePath }, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Failed to delete commit: ${stderr}`);
                }
                else {
                    vscode.window.showInformationMessage(`Commit ${commitHash} deleted successfully.`);
                }
            });
        });
    }));
    context.subscriptions.push(deleteCommitCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map