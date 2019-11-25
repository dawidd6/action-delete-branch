#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'octokit'

# Github
repo = ENV["GITHUB_REPOSITORY"]

# Inputs
token = ENV["INPUT_GITHUB_TOKEN"]
branches = ENV["INPUT_BRANCHES"]
numbers = ENV["INPUT_NUMBERS"]
prefix = ENV["INPUT_PREFIX"]
suffix = ENV["INPUT_SUFFIX"]

# Declare array with branches to delete
branches_to_delete = []

# Initialize octokit
client = Octokit::Client.new(:access_token => token)

# Append branches if any
branches&.split(",")&.each do |branch|
  branch = prefix + branch if prefix
  branch = branch + suffix if suffix
  branches_to_delete << branch
end

# Get head branches of PRs via provided issues numbers
numbers&.split(",")&.each do |number|
  # Check if issue is a PR
  issue = client.issue(repo, number)

  # Next if issue is not a PR
  next if issue && issue["pull_request"].nil?

  # Append head branch of PR to others
  branch = client.pull_request(repo, number)["head"]["ref"]
  branch = prefix + branch if prefix
  branch = branch + suffix if suffix
  branches_to_delete << branch
end

branches_to_delete.each do |branch|
  if client.delete_branch(repo, branch)
    puts branch
  else
    puts branch + " <== failed"
    exit 1
  end
end

