FROM ruby:slim

COPY entrypoint.rb /

# https://github.com/octokit/octokit.rb/issues/1155
RUN gem install faraday -v 0.15.4
RUN gem install octokit

ENTRYPOINT ["/entrypoint.rb"]
