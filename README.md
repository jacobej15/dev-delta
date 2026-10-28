# Dev-Delta
## Bravo
Tagline: A front-end web application for exploring time-related
information through a simple, responsive interface.
- Author: Jacobe Johnson
- Version: 0.3 (development)
- Last updated: Novmeber 5th, 2026
- Course/project: dev|delta
  
## Project status: 
This README is a development template for
extending the existing dev|bravo application. Update the status and
feature descriptions to match what is actually implemented before
submitting.

## Overview
DOM Time began as the dev|bravo front-end application, with a user
interface, navigation, forms, sign-in interface, user controls, and an
admin page. The dev|delta iteration builds on that existing project
instead of starting over.

The goal is to replace hardcoded interface elements with working
front-end functionality and structured data. The application is being
developed to demonstrate authentication, role-based authorization, JSON
fetching, CRUD operations, application state, and session storage.
Problem and Purpose
A front-end application should do more than display a static interface.
It should accept user input, load structured data, respond to user
actions, and maintain its current state during a browser session.

DOM Time provides a place to practice those behaviors while keeping the
interface understandable and responsive.

## User Story
As a user, I want to sign in and interact with application content so
that my actions are reflected in the interface and retained during my
current browser session.

As an administrator, I want to access administrative controls and
inspect the application's current state so that I can manage records and
verify how the application is working.
Current and Planned Functionality
## Update this checklist as each feature is implemented and tested.
- [ ] Revisit and improve the existing dev|bravo interface.
- [ ] Preserve the Bravo version using Git before major changes.
- [ ] Provide development-only ADMIN and USER test accounts.
- [ ] Print the test credentials clearly in the browser console.
- [ ] Authenticate users through JavaScript logic.
- [ ] Store the signed-in user's username, authentication status, and
  role.
- [ ] Provide a working sign-out control.
- [ ] Show different capabilities for ADMIN and regular USER roles.
- [ ] Load multiple application records from a local JSON file using
  fetch().
- [ ] Render fetched records into the DOM.
- [ ] Implement CREATE, READ, UPDATE, and DELETE operations.
- [ ] Save application data and state in sessionStorage.
- [ ] Restore saved state after a page refresh within the same tab
  session.
- [ ] Provide an ADMIN dashboard.
- [ ] Display formatted application-state JSON in the admin area.
- [ ] Display useful status and error messages in the interface.
- [ ] Deploy and test the application using GitHub Pages.
### Only mark a feature complete after testing it.
### Authentication and Authorization
### Authentication (AuthN)
### Authentication answers: Who is signed in?

## The development version should provide two test accounts:
- ADMIN: Can access administrative features.
- USER: Can access the normal application features.
The actual test usernames and passwords should be documented in the
browser console for grading, as required by the assignment. Use fake
development credentials only---never use personal or reused passwords.
Authorization (AuthZ)
Authorization answers: What is this user allowed to do?

The application should make the roles meaningfully different. For
example:

  Capability                                                  USER   ADMIN
  Read records                                                 Yes     Yes
  Create records                                               Yes     Yes
  Update records                         Own records, if supported     Yes
  Delete records                                                No     Yes
  Access admin dashboard                                        No     Yes
  Inspect complete application state                            No     Yes

Adjust this table to match the rules actually enforced in the
JavaScript.

Security note: This is a front-end educational demonstration.
Client-side role checks and credentials are not secure authentication. A
production application needs server-side authentication and
authorization.
Data and JSON
The application's starting records should be stored as structured JSON
in a local file. JavaScript loads the file with fetch(), checks the
response, parses it with response.json(), and renders the records into
the DOM.

The JSON records should represent content relevant to DOM Time. Choose
appropriate fields for the app, such as an ID, title, description, and
any other fields the interface needs.

## Example data flow:
Local JSON file
      |
    fetch()
      |
 response.json()
      |
 JavaScript data
      |
      v
    DOM render
    
## CRUD Operations
### The application should demonstrate all four CRUD operations:
- Create: Collect form values, construct a new record object, add
  it to the application data, save the state, and render the updated
  list.
- Read: Load and display the current records.
- Update: Allow a user with permission to edit a record and save
  the changes.
- Delete: Allow an authorized user to remove a record and update
  the interface.
Use the DOM and Bootstrap interface for feedback instead of relying on
alert(), prompt(), or confirm().
Application State and Session Storage
The application should keep important current information in one logical
JavaScript object. The exact fields should match the application's
actual design.

### Example structure:
const appState = {
  app: {
    name: "DOM Time",
    version: "0.3"
  },
  user: {
    username: "",
    authenticated: false,
    role: ""
  },
  data: [],
  session: {
    started: ""
  }
};
The object above is a structural example. Populate it with real values
from the application's authentication flow, JSON data, user actions, and
session.

Save state as JSON text:
sessionStorage.setItem(
  "appState",
  JSON.stringify(appState)
);
Retrieve it as a JavaScript object:
const savedState = JSON.parse(
  sessionStorage.getItem("appState")
);
When the user creates, updates, or deletes a record, update the
application data, save the state, and re-render the interface.

sessionStorage generally survives refreshes in the same tab, but it is
temporary browser storage---not a database. Data can be lost when the
tab's session ends.
Application Data Flow

       SIGN-IN FORM
              |
       Authentication
              |
       User + role data
              |
              v
Local JSON ---> APP STATE <--- User CRUD actions
  fetch()          |
                   v
             sessionStorage
                   |
                   v
             JSON.parse()
                   |
                   v
             DOM rendering
                   |
          ADMIN dashboard can
          inspect current state
          
### Admin Dashboard
The administrative area should be clearly identified and accessible to
an authenticated ADMIN through the application interface.

### Where implemented, the dashboard should show:
- Current username and role.
- Authentication status.
- Current application records and record count.
- Authorized record-management controls.
- Relevant sessionStorage information.
- The complete application state as formatted JSON.
- Useful diagnostic information, such as the current page, date/time,
  or session start.
## Example HTML element for formatted state output:
<pre id="app-state-output"></pre>
The JavaScript can display the current state with:
document.querySelector("#app-state-output").textContent =
  JSON.stringify(appState, null, 2);
The admin dashboard should not present the same administrative controls
to a regular USER.
Technology Stack
- HTML5
- CSS3
- JavaScript
- Bootstrap 5, where used by the existing interface
- Local JSON data
- Fetch API
- Browser DOM APIs
- sessionStorage
- Git and GitHub
- GitHub Pages for static deployment
## Project Structure
Adjust this tree to match the actual repository:
DOM-Time/

├── index.html
├── signin.html
├── admin.html
├── data/
│   └── records.json
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md

Keep the existing Bravo file structure where practical. Do not create
duplicate files simply to match this example.
### Running the Application
1. Clone or open the repository.
2. Open the project in VS Code or GitHub Codespaces.
3. Run it through a local web server so fetch() can load local JSON
   files. For example:
   python3 -m http.server 8000
4. Open the local server address provided by your development
   environment.
5. Open the browser Developer Tools and inspect the Console and
   Application/Storage panels.
6. Test both development accounts and verify their different
   permissions.
7. Test create, read, update, delete, refresh recovery, and sign-out.
Because local JSON loading depends on the server and file paths, opening
index.html directly using a file:// URL may not work correctly.
## Testing Checklist
- [ ] Application loads without significant console errors.
- [ ] Local JSON fetch succeeds and multiple records appear.
- [ ] Test credentials are easy to find in the console.
- [ ] Valid sign-in works; invalid sign-in displays a useful error.
- [ ] Signed-in username and role appear appropriately.
- [ ] USER cannot access ADMIN-only controls.
- [ ] ADMIN can access the admin dashboard.
- [ ] Create adds a record.
- [ ] Read displays records.
- [ ] Update changes an existing record.
- [ ] Delete removes a record only when authorized.
- [ ] Changes update JavaScript state and sessionStorage.
- [ ] Refresh restores the current session state.
- [ ] Sign-out clears the appropriate authentication/session data.
- [ ] Admin dashboard displays formatted application-state JSON.
- [ ] GitHub Pages deployment works.
Known Issues
Record verified issues here. Do not list an issue as fixed until it has
been tested.
- Add known issues and their current status.
## Future Development
Potential future improvements include:
- Add a real backend and database.
- Replace development-only authentication with a secure authentication
  service.
- Enforce authorization on the server.
- Improve form validation and accessibility.
- Add stronger error handling and automated tests.
- Improve mobile responsiveness and user feedback.
Resources and Attribution
- Course-provided dev|delta assignment instructions.
- MDN Web Docs: Fetch
  API
- MDN Web Docs: Web Storage
  API
- MDN Web Docs:
  JSON
- Bootstrap
  Documentation,
  if Bootstrap is used.
AI assistance was used to draft this README structure. Review and revise
it so it accurately reflects the application's implementation and your
own work.
