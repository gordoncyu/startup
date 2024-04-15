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

# Startup HTML Stuff done

- Added dashboard page html in index.html, coding page for problems and problems submissions, and leaderboard page for viewing top scores per each problem.
- Used proper tags with header, body, and footer in each of the webpages, though did not use nav. Navigation is relatively simple; you start at the dashboard on index.html, go to a problem, then can go to a page for the scores for that problem. All these pages if you click on the name of the website at the top it will take you back to dashboard, just like any other website like youtube, etc.
- Links between three main pages where natural rather than nav
- Sufficient application text content for example 1337code problem, scores, and dashboard
- Button at botton of codepage for sharing solution with a qr code using external api
- image with 1337code logo
- login placeholder in page header
- db placeholder for leaderboard
- websocket placeholder for real-time thumbs up/down counter

# Startup CSS Stuff done

(All using tailwind)
- Standardized header and footer content and css across pages (will be SPA'd later)
    - Styleized logo and login
- Styled navigation between pages to be more clear about their purpose (not an explicit navigation bar, but clear and natural nav between different parts of the application)
    - Big blue button for leaderboard and back from leaderboard
- Used a lot of tailwind flexbox features to ensure responsive styling
- Stylized tables by replacing with flexbox columns instead
- Added darktheme; there is only darktheme; this is a feature because 1337 python hackers only use darktheme
    - Darkthemed codepage instructions and other elements
- Text content; mostly the same as before; styled with darktheme
- Same images just layed out better with css

# Startup JavaScript Stuff done

- Made the login work at the top right of the page. After login it shows your username and a logout button.
- Made ways for the login information to route to the database
- Moved problems and associated information to the database
- Added websocket support for thumbsup/thumbs down live updating
- Added python editor with codemirror javascript
- Added javascript to evaluate submitted code for correctness

# Startup Service Stuff done

- I moved site rendering from static middleware to dynamic; I know this is against the specification, but because we are now using services I am able to render a single-page application so therefore I am not using static middleware for the frontend.
- Http service created with nodejs and express:
    - Implemented single-page application functionality using services
- Frontend calls /comp service endpoints for scoring and leaderboard rankings, accesses third party endpoints through getqr
- Backend provides /comp service endpoints
