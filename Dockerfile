FROM ruby:slim

COPY entrypoint.rb /

RUN gem install octokit

ENTRYPOINT ["/entrypoint.rb"]
