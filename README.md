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
# NUMBER is replaced by pull request or issue number
- uses: dawidd6/action-delete-branch@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    branch: xyz-NUMBER
```
