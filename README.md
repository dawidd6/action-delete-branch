# Delete multiple branches Github Action

An action that deletes multiple branches from repository.
Optionally one can provide a `prefix` or `suffix` strings that would be appended or prepended to every branch name.

## Usage

```yaml
- name: Delete PRs head branches
  uses: dawidd6/action-delete-branch@v3
  with:
    github_token: ${{github.token}}
    numbers: 13,22,${{github.event.pull_request.number}}
- name: Delete pr-* branches
  uses: dawidd6/action-delete-branch@v3
  with:
    github_token: ${{github.token}}
    branches: 13,22,33
    prefix: pr-
- name: Delete branch
  uses: dawidd6/action-delete-branch@v3
  with:
    github_token: ${{github.token}}
    branches: test
    suffix: -done
```
