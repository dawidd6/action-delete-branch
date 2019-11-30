FROM dawidd6/ruby-octokit

COPY *.rb /

ENTRYPOINT ["/main.rb"]
