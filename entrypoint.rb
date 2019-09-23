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
pr_number = payload["pull_request"]["number"]
pr_head_branch = payload["pull_request"]["head"]["ref"]

# Inputs
branch = ENV["INPUT_BRANCH"]
branch = branch.sub("PR_NUMBER", pr_number.to_s) unless pr_number.nil?
branch = branch.sub("PR_HEAD_BRANCH", pr_head_branch.to_s) unless pr_head_branch.nil?

# Request
client = Octokit::Client.new(:access_token => token)
response = client.delete_branch(repo, branch)

# Response
if response
  puts "==> Branch \"#{branch}\" deleted successfully"
else
  puts "==> Branch \"#{branch}\" deletion failure"
  exit(1)
end
