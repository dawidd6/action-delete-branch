const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
    try {
        const github_token = core.getInput("github_token", { required: true })
        const numbers = core.getInput("numbers")
        const branches = core.getInput("branches")
        const prefix = core.getInput("prefix")
        const suffix = core.getInput("suffix")

        const client = github.getOctokit(github_token)

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

        for (let branch of branchesToDelete) {
            if (prefix)
                branch = prefix + branch
            if (suffix)
                branch = branch + suffix
            console.log("==> Deleting \"" + branch + "\" branch")
            await client.git.deleteRef({
                ...github.context.repo,
                ref: "heads/" + branch
            })
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
