# action-delete-branch

This action simply deletes a branch from origin repository

## Usage

```yaml
- uses: dawidd6/action-delete-branch@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    branch: xyz
```

```yaml
# works only if tested commit is referenced to pull request or issue
# PR_NUMBER is replaced by pull request number
- uses: dawidd6/action-delete-branch@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    branch: xyz-PR_NUMBER
```

```yaml
# works only if tested commit is referenced to pull request or issue
# PR_HEAD_BRANCH is replaced by pull request head branch
- uses: dawidd6/action-delete-branch@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    branch: PR_HEAD_BRANCH
```
