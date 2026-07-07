import datetime
import random
import subprocess
import os

def run_cmd(cmd, env=None):
    return subprocess.check_output(cmd, env=env).decode('utf-8').strip()

# 1. Generate dates
start_date = datetime.date(2026, 4, 6)
end_date = datetime.date(2026, 7, 7)

current_date = start_date
active_dates = []

while current_date <= end_date:
    week_dates = []
    for _ in range(7):
        if current_date > end_date:
            break
        week_dates.append(current_date)
        current_date += datetime.timedelta(days=1)
    
    if len(week_dates) == 7:
        # Pick 5 active days, leaving 2 days empty
        active_dates.extend(random.sample(week_dates, 5))
    else:
        num_active = max(1, len(week_dates) - 1)
        active_dates.extend(random.sample(week_dates, num_active))

active_dates.sort()

# 2. Get existing commits
hashes = run_cmd(["git", "log", "--reverse", "--format=%H"]).split('\n')
hashes = [h for h in hashes if h]

print(f"Found {len(hashes)} commits to process.")

# Assign random active dates to commits
commit_dates = random.choices(active_dates, k=len(hashes))
commit_dates.sort()

commit_datetimes = []
for d in commit_dates:
    hour = random.randint(10, 22)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    dt = datetime.datetime.combine(d, datetime.time(hour, minute, second))
    commit_datetimes.append(dt)

commit_datetimes.sort()

# 3. Rewrite history
parent = None
env_base = os.environ.copy()

for i, h in enumerate(hashes):
    tree = run_cmd(["git", "log", "-1", "--format=%T", h])
    msg = run_cmd(["git", "log", "-1", "--format=%B", h])
    author = run_cmd(["git", "log", "-1", "--format=%an", h])
    email = run_cmd(["git", "log", "-1", "--format=%ae", h])
    
    date_str = commit_datetimes[i].strftime("%Y-%m-%dT%H:%M:%S")
    
    env = env_base.copy()
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str
    env["GIT_AUTHOR_NAME"] = author
    env["GIT_AUTHOR_EMAIL"] = email
    env["GIT_COMMITTER_NAME"] = author
    env["GIT_COMMITTER_EMAIL"] = email
    
    cmd = ["git", "commit-tree", tree]
    if parent:
        cmd.extend(["-p", parent])
    
    # commit-tree reads message from stdin if not provided via -m, but we can pass it via -m
    # wait, -m might mess up multi-line messages. It's safer to use stdin
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, env=env)
    out, _ = process.communicate(input=msg.encode('utf-8'))
    new_hash = out.decode('utf-8').strip()
    
    parent = new_hash
    print(f"Processed {i+1}/{len(hashes)}: {new_hash}")

# 4. Reset branch to new history
branch = run_cmd(["git", "branch", "--show-current"])
print(f"Resetting branch {branch} to {parent}")
subprocess.check_call(["git", "reset", "--hard", parent])
print("Done! You can now force push to GitHub.")
