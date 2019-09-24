#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'octokit'

# Github
repo = ENV["GITHUB_REPOSITORY"]

# Inputs
be_kind = ENV["INPUT_BE_KIND"]
branch = ENV["INPUT_BRANCH"]
token = ENV["INPUT_GITHUB_TOKEN"]

# Main
begin
  client = Octokit::Client.new(:access_token => token)
  response = client.delete_branch(repo, branch)
  if response
    puts "==> Branch \"#{branch}\" deleted successfully"
  else
    puts "==> Branch \"#{branch}\" deletion failure"
    exit(1) unless be_kind
  end
rescue StandardError => e
  puts "==> Error: #{e.message}"
  exit(1) unless be_kind
end
