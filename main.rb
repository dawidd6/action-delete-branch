#!/usr/bin/env ruby
# frozen_string_literal: true

require 'octokit'

repo = ENV['GITHUB_REPOSITORY']
token = ENV['INPUT_GITHUB_TOKEN']
branches = ENV['INPUT_BRANCHES']
numbers = ENV['INPUT_NUMBERS']
prefix = ENV['INPUT_PREFIX']
suffix = ENV['INPUT_SUFFIX']
client = Octokit::Client.new(access_token: token)
numbers = numbers&.split(',') || []
branches = branches&.split(',') || []

numbers.each do |number|
  begin
    pull = client.pull_request(repo, number)
    branches << pull['head']['ref']
  rescue StandardError => e
    puts "==> Error: #{e.message}"
  end
end

branches = branches.map { |branch| prefix + branch } if prefix
branches = branches.map { |branch| branch + suffix } if suffix

branches.each do |branch|
  begin
    if client.delete_branch(repo, branch)
      puts "==> Deleted: #{branch}"
    else
      puts "==> Failed to delete: #{branch}"
      exit 1
    end
  rescue StandardError => e
    puts "==> Error: #{e.message}"
    exit 1
  end
end
