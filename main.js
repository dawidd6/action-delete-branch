const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
    try {
        const token = core.getInput("github_token", { required: true })
        const numbers = core.getInput("numbers")
        const branches = core.getInput("branches")
        const prefix = core.getInput("prefix")
        const suffix = core.getInput("suffix")
        const dryRun = core.getInput("dry-run")
        const owner = core.getInput("owner")
        const repo = core.getInput("repo")

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
        
        if (prefix && owner && repo) {
            const branchFunc = await client.paginate("GET /repos/{owner}/{repo}/branches", {
                owner: owner,
                repo: repo
            })
            .then((branches) => {
               for (let branch of branches) {
                   if (branch.name.substring(0, prefix.length) == prefix) {
                       console.log("Adding branch: " + branch.name + " for deletion.");
                       branchesToDelete.push(branch.name)
                   }
               }
            });
        }
        
        console.log(JSON.stringify(github.context);
        console.log("Starting the branch deletion...");        
        for (let branch of branchesToDelete) {
            
            if (prefix && !owner && !repo)
                branch = prefix + branch
            
            if (suffix)
                branch = branch + suffix
            
            console.log("==> Deleting \"" + branch + "\" branch")

            if (!dryRun) {
                await client.git.deleteRef({
                    ...github.context.repo,
                    ref: "heads/" + branch
                })
            }
        }
        console.log("Ending the branch deletion...");
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
