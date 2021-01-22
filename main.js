const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
    try {
        const token = core.getInput("github_token", { required: true })
        const numbers = core.getInput("numbers")
        const owner = core.getInput("owner")
        const repository = core.getInput("repository")
        const branches = core.getInput("branches")
        const prefix = core.getInput("prefix")
        const suffix = core.getInput("suffix")

        const client = github.getOctokit(token)

        let branchesToDelete = branches ? branches.split(",") : []

        if (numbers) {
            for (const number of numbers.split(",")) {
                const pull = await client.pulls.get({
                    ...github.context.repo,
                    pull_number: number
                })
                branchesToDelete.push(pull.data.head.ref)
            }
        }

        let ownerOfRepository = owner ? owner : github.context.repo.owner
        let repositoryContainingBranches = repository ? repository : github.context.repo.repo
        
        for (let branch of branchesToDelete) {
            if (prefix)
                branch = prefix + branch
            if (suffix)
                branch = branch + suffix
            
            console.log("==> Deleting \"" + ownerOfRepository + "/" + repositoryContainingBranches + "/" + branch + "\" branch")
            
            await client.git.deleteRef({
                owner: ownerOfRepository,
                repo: repositoryContainingBranches,
                ref: "heads/" + branch
            })
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
