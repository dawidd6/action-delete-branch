# Delete branch Github Action

An action that simply deletes a branch from repository.

## Usage

```yaml
- name: Delete PR head branch
  uses: dawidd6/action-delete-branch@master
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    branch: ${{ github.pull_request.head.ref }}
    be_kind: true # don't fail on errors (optional)
```
