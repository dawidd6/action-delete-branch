const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
    try {
        const token = core.getInput("github_token", { required: true })
        const numbers = core.getInput("numbers")
        const branches = core.getInput("branches")
        const prefix = core.getInput("prefix")
        const suffix = core.getInput("suffix")
        const dryRun = core.getInput("dry_run")
        const days = core.getInput("days")

        const client = github.getOctokit(token)
        const repoName = github.context.payload.repository.name;
        const ownerName = github.context.payload.repository.owner.name;

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
        
        if (prefix) {
            const branchFunc = await client.paginate("GET /repos/{owner}/{repo}/branches", {
                owner: ownerName,
                repo: repoName
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
        
        console.log("Starting the branch deletion...");        
        for (let branch of branchesToDelete) {
            
            if (suffix)
                branch = branch + suffix
            
            let canDelete = true;
            if (days) {
                let dateThreshold = new Date();
                dateThreshold.setDate(dateThreshold.getDate() - days);
                console.log("Branches with commits older than " + dateThreshold.toString() + " will be deleted.");
                
                await client.request("GET /repos/{owner}/{repo}/branches/{branch}", {
                    owner: ownerName,
                    repo: repoName,
                    branch: branch
                })
                .then((ghBranch) => {
                    let branchLastCommitDate = new Date(ghBranch.data.commit.commit.committer.date);
                    console.log(branchLastCommitDate.toString());
                    console.log(dateThreshold.toString());
                    console.log(branchLastCommitDate < dateThreshold);
                    if (branchLastCommitDate < dateThreshold) {
                        console.log("Branch \"" + branch + "\" last commit date was " + branchLastCommitDate.toString() + ". It does not meet the threshold and will not be deleted.");
                        canDelete = false;
                    }
                });
            }
            if (!canDelete) {
                console.log("Unable to delete \"" + branch + "\" branch");     
                continue;
            }
            
            console.log("==> Deleting \"" + branch + "\" branch");

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
