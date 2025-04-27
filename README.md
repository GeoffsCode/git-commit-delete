# Delete Git Commit

This extension adds a **Delete Commit** option to the right-click menu inside the Timeline view in VS Code Git.  
It allows you to safely remove a commit by rebasing your repository.

- Creates a `backup-before-delete` branch before deleting
- Rebases automatically
- Shows success or error notifications

## How to Use

1. Open a Git project in VS Code.
2. Open the Timeline view.
3. Right-click a commit and select **Delete Commit**.
4. Confirm the deletion when prompted.

> Warning: Deleting commits rewrites history. Always push force with caution!
