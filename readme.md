# Traceability POC

## What this proves

Right now, if someone asks "which code actually implements this ticket?"
or "what requirement was this commit for?", the honest answer is "go ask
whoever wrote it." This POC tests whether we can answer that question
automatically, by connecting two things that already exist and are already
being written today: a Redmine ticket's description, and the git commit
message of whoever fixed it. If a developer writes their commit message in
a small, predictable format (referencing the ticket number, e.g.
`refs #123`), a script can pull the ticket's requirement text and the
matching commit/diff and show them side by side — no new tools for
developers to learn, no process changes beyond "write a normal commit
message." That's Track A, and it's the primary result of this POC.
Separately, we also looked at Redmine's native repository/SCM integration
UI itself (Track B), to see how it compares — documented in
[`SCM-INTEGRATION-TEST.md`](./SCM-INTEGRATION-TEST.md). Track A doesn't
depend on Track B in any way.

**v4 change: git tags are the only source of truth for release versions.**
There is no `Release` model, and nothing about releases, commits, or
ticket-to-commit mappings is persisted in our own database anywhere in
this app. Every release, changelog, and trace lookup is resolved live from
two sources: `git` (a local repo for this POC, structured to swap for AWS
CodeCommit later) and Redmine's REST API (ticket descriptions only).

## Architecture

```
git (test-repo/, local for this POC)  <--subprocess-->  Django backend  <--REST-->  Redmine (ticket text only)
                                              |
                                              v
                                     Frontend (static HTML)
```

The Django backend (`trace_app/git_adapter.py`) reads commits, diffs, and
tags directly from git via `subprocess` — it does **not** depend on
Redmine's repository/SCM integration (Track B) at all. Redmine is used
for exactly one thing: `GET /issues/<id>.json`, to fetch a ticket's
subject/description/status. Concretely:

- `git tag --list --sort=-creatordate ...` lists every release, newest
  first — this is what powers the version dropdown and what "Create
  Release" writes to (via `git tag`). No database table of versions
  exists.
- `git log <from_tag>..<to_tag>` walks the commits for one release's
  changelog, filtered to Conventional-Commit-formatted `fix`/`feat`
  commits.
- `git show <hash>` returns the real diff for a commit.

All of this lives behind a `GitSourceAdapter` interface
(`trace_app/git_adapter.py`) with one implementation so far,
`LocalGitAdapter`. A future `CodeCommitAdapter` (using `boto3`) can be
swapped in via the `GIT_ADAPTER` setting with zero changes to views,
serializers, or the frontend — see that module's docstrings for the
CodeCommit-equivalent call noted on each method.

## Running it, start to finish

### 1. Start Redmine

```bash
docker compose up -d
```

Wait ~15-20 seconds, then confirm `http://localhost:3000` loads.

### 2. One-time Redmine setup

Follow [`SETUP.md`](./SETUP.md): log in, change the forced admin password,
enable the REST API, grab your API access key, create the
`prof-service-poc` project, and create one test issue. Note the issue's ID.

### 3. Generate the test repo

```bash
cp .env.example .env
# edit .env: set TICKET_ID to the issue ID you just created
./scripts/create_test_repo.sh
```

This creates `test-repo/` with seven commits and two tags: `v1.0.0` (the
first three commits) and `v1.1.0` (the next three) — plus one untagged
commit after `v1.1.0`, to prove unreleased work doesn't leak into any
release's changelog. Only the first commit references your Redmine
ticket via `refs #<TICKET_ID>`; the rest reference tickets #3/#4, which
won't resolve unless you also create those in Redmine — that's expected,
it exercises `/api/trace/`'s "issue not found" path.

### 4. Backend setup

```bash
cd poc_backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env: REDMINE_API_KEY = your API access key from step 2
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Sanity check with curl before moving on:

```bash
curl "http://127.0.0.1:8000/api/releases/?repo=prof_service"
curl "http://127.0.0.1:8000/api/changelog/?repo=prof_service&version=v1.0.0"
curl "http://127.0.0.1:8000/api/trace/<TICKET_ID>/?repo=prof_service&commit_hash=<hash>"
```

### 5. Frontend

The frontend is a static file, no build step. Either open
`frontend/index.html` directly in a browser, or serve it so relative paths
behave normally:

```bash
cd frontend
python3 -m http.server 8080
# then open http://127.0.0.1:8080/index.html
```

It calls the backend at `http://127.0.0.1:8000/api` (see the `API_BASE`
constant near the top of `index.html` if you need to change that). You
should see a version dropdown populated live from git tags, and the
changelog for the selected version grouped into **Fixed** / **Added**.
Use **Create Release** to tag the repo's current state (a real `git tag`
— nothing written to a database) and watch the new version appear in the
dropdown immediately. Clicking a changelog entry opens the 3-panel view
(Swagger placeholder, code diff, requirement).

## Known Limitations (by design, since this is a POC)

- **No AWS integration.** No CodeCommit, no EventBridge, no Lambda — this
  is entirely local Docker + local git, standing in for what a production
  version would wire up against real AWS services. `GitSourceAdapter` is
  designed so a `CodeCommitAdapter` can be swapped in later without
  touching views or the frontend; see `trace_app/git_adapter.py`.
- **No `Release` model, no persistence of releases/commits/mappings.**
  Every release, changelog, and trace lookup is resolved live from git and
  Redmine each request. No caching either — a real deployment might add a
  short-lived cache in front of `list_tags()` if this becomes a perf
  concern, but that's explicitly skipped here.
- **Single hardcoded test repo.** `settings.GIT_REPOS` maps one name
  (`prof_service`) to one filesystem path; there's no concept of multiple
  repos beyond adding more dict entries.
- **No authentication.** The Django API has no auth layer, and the
  frontend's CORS policy is wide open (`Access-Control-Allow-Origin: *`).
  Fine for a local POC, not fine for anything that leaves your machine.
- **Swagger panel is a static placeholder.** It doesn't call a real
  OpenAPI spec or show real endpoint docs — that's explicitly out of
  scope for this POC.
- **Minimal error handling.** The backend handles the "nothing found"
  cases called out in the spec (unknown repo/version/ticket, no matching
  commit) cleanly, but doesn't try to handle every failure mode (Redmine
  down, malformed `.env`, etc.) gracefully — this is a proof of concept,
  not production code.
