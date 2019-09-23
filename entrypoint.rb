#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'octokit'

# Github
repo = ENV["GITHUB_REPOSITORY"]
token = ENV["GITHUB_TOKEN"]
event_path = ENV["GITHUB_EVENT_PATH"]

# Event
json = File.read(event_path)
payload = JSON.parse(json)
pr = payload["pull_request"]
pr_number = pr["number"] unless pr.nil?
pr_head_branch = pr["head"]["ref"] unless pr.nil?

# Inputs
be_kind = ENV["INPUT_BE_KIND"]
branch = ENV["INPUT_BRANCH"]
branch = branch.sub("PR_NUMBER", pr_number.to_s) unless pr_number.nil?
branch = branch.sub("PR_HEAD_BRANCH", pr_head_branch.to_s) unless pr_head_branch.nil?

# Main
begin
  client = Octokit::Client.new(:access_token => token)
  response = client.delete_branch(repo, branch)
  if response
    puts "==> Branch \"#{branch}\" deleted successfully"
  else
    puts "==> Branch \"#{branch}\" deletion failure"
    exit(1)
  end
rescue StandardError
  puts "==> Branch \"#{branch}\" not found"
  exit(1) unless be_kind
end
