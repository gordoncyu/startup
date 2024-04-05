# CS260 Startup

Do you like leetcode and python(3)? Are you a pythonista who hates those dang Java Object-Oriented evangelicals or those esoteric functional lamba-calculus chasing OCaml fanatics? Them with their dang ideologies that just happens to win against your beautiful pythonistic code on leetcode leaderboards because it runs orders of magnitudes faster? Or are you just lazy and use python because it's easier? Well do I have the website for you!

# Introducing 1337code

Only for the true 1337 pythonista hackers out there (true hackers only use python). Get away from the distractions of managing memory and segfaults in C++ and the authoritarian borrow checker of Rust and just focus on programming with nothing else in your way. Compete against other top python connoissuers who concern themselves not with the realities of hardware and chase that O(nlogn) imlementation. It matters not how long it actually takes; someone else will optimize it in C with python bindings later. You're just chasing that theoretical time complexity--only the purest of metrics--against others who share the same pusuit. Or, again, maybe you're just lazy and use python because it's easier. I certainly am (also I work in ML where you basically have no other choice).

![[dashboard]](./readme_images/dashboard.png)

Comes with a sleek, distraction-free minimal look.

![[codepage]](./readme_images/codepage.png)

No fluff story to give context, just the problem itself. No distractions to let you focus on what really matters: solving n problems to get credit in your algorithms class.

![[leaderboard]](./readme_images/leaderboard.png)

Pit your pythonistic code against others and cope and seethe as someone's godless non-pythonistic code beats yours. Or just get skill-issued because you're bad at programming.

# Getting Points: How I will use each technology

- HTML - Uses correct HTML structure for application. Three html pages. One for dashboard showing problems, another for the problem and submission, and another for scores.
- CSS - Looks like it's from later than 2010
- JavaScript - Provides login, python repl, scoring, and leaderboard.
- Service - Backend service with endpoints for:
    - getting problems
    - storing solutions
    - retreiving scores
    - external api call to https://www.qrtag.net/api/ for sharing solutions
- DB/Login - Store users, problem ratings, and other problem-specific information in database. Register and login users. Credentials securely stored in database. Can't leaderboard unless logged in.
- WebSocket - The number of thumbs up and down is updated in real time to all users.
- React - Will create a SPA (lmao I could do it with raw html with a go backend using a htmx cdn but ok sure react time ig)
