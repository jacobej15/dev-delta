# dev|bravo

A front-end campus directory prototype for the University of North Alabama project. It demonstrates role-based sign-in, JSON-backed campus records, CRUD workflows, search/filter/sort, session persistence, and an admin application inspector.

## Features

- Demo admin and regular user accounts with different permissions.
- The campus directory redirects visitors to login until a user signs in.
- Initial campus records loaded with `fetch()` from `assets/data/campuses.json`.
- Search by campus name, location, type, or description; filter by state; sort by name.
- Signed-in users can add and edit records. Only admins can delete records or view the application inspector.
- Current user and edited campus data are stored in `sessionStorage` and cleared when the browser tab session ends.
- The admin inspector displays demo users, records, session storage, and the complete application state.
- Demo credentials and meaningful load, sign-in, and data-operation logs are printed to the browser console.

## Demo accounts

The same credentials are printed in the browser developer console on each page. These are public demo credentials, not real secrets.

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Regular user | `student` | `student123` |

## Run locally

The JSON seed uses `fetch()`, so serve the project over HTTP rather than opening `index.html` directly as a `file://` URL. From the project root, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Python 3 is required. VS Code Live Server or another static HTTP server also works.

## Test checklist

1. While signed out, open the Campus directory and confirm it redirects to login.
2. Sign in as `student` / `student123`; confirm four initial records load and try search, state filter, and both sort orders.
3. Add a campus and edit it. Confirm delete controls and the admin inspector are not available.
4. Sign out, then sign in as `admin` / `admin123`; confirm add/edit, delete, and the inspector. Delete a test record and confirm the record count and session storage update.
5. Reload the tab and confirm changes remain for the session. Close the tab session to start from the JSON seed again.
6. Open browser developer tools to see demo credentials and application logs.

## Project structure

```text
Dev-Bravo-main/
├── index.html
├── pages/
│   ├── campus.html
│   ├── lions.html
│   ├── login.html
│   └── img/
├── assets/
│   ├── data/
│   │   └── campuses.json
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── README.md
```

## Important limitations

This is a classroom front-end demo, not production authentication or authorization. Credentials are in client-side JavaScript, and users can alter session storage or bypass UI controls. Use a server, password hashing, and server-side authorization before handling real accounts or data. Campus edits are temporary to the current browser tab session and are not written back to the JSON file.
