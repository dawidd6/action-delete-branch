# Delete multiple branches GitHub Action

An action that deletes multiple branches from repository.
Optionally one can provide a `suffix` strings that would be appended or prepended to every branch name.

## Usage

> Do not specify `numbers` and `branches` together when `prefix` or `suffix` are set.

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
- name: Delete branches older than 10 days
  uses: dawidd6/action-delete-branch@v3
  with:
    github_token: ${{github.token}}
    days: 10
```
