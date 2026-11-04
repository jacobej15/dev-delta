/* dev|delta is a client-side demonstration, not production authentication. */
(function () {
  "use strict";

  const STORAGE_KEY = "devDeltaState";
  const ACCOUNTS = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "student", password: "student123", role: "user" }
  ];
  let state = readState();

  console.info("[dev|delta] Demo accounts:", ACCOUNTS.map(({ username, password, role }) => `${role}: ${username} / ${password}`));

  function readState() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || { user: null, campuses: null };
    } catch (error) {
      console.warn("[dev|delta] Could not parse saved session state; starting fresh.", error);
      return { user: null, campuses: null };
    }
  }

  function saveState() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.info("[dev|delta] Session state saved.", { user: state.user, records: (state.campuses || []).length });
    updateDashboard();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function currentUser() {
    return state.user;
  }

  function canEdit() {
    return Boolean(currentUser());
  }

  function isAdmin() {
    return currentUser()?.role === "admin";
  }

  function renderCampuses() {
    const list = document.querySelector("#campus-list");
    if (!list) return;

    const search = document.querySelector("#campus-search").value.trim().toLowerCase();
    const selectedState = document.querySelector("#state-filter").value;
    const sort = document.querySelector("#sort-order").value;
    const campuses = [...(state.campuses || [])]
      .filter((campus) => (selectedState === "all" || campus.state === selectedState)
        && `${campus.name} ${campus.city} ${campus.state} ${campus.type} ${campus.description}`.toLowerCase().includes(search))
      .sort((a, b) => sort === "name-desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));

    list.innerHTML = campuses.map((campus) => `
      <article class="campus-row">
        <div class="campus-main">
          <div class="campus-heading"><h3>${escapeHtml(campus.name)}</h3><span class="campus-type">${escapeHtml(campus.type)}</span></div>
          <p>${escapeHtml(campus.description)}</p>
          <div class="campus-meta"><span>${escapeHtml(campus.city)}, ${escapeHtml(campus.state)}</span><span>${escapeHtml(campus.enrollment)} students</span></div>
        </div>
        <div class="campus-actions">
          ${canEdit() ? `<button class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${escapeHtml(campus.id)}" aria-label="Edit ${escapeHtml(campus.name)}"><i class="bi bi-pencil" aria-hidden="true"></i><span>Edit</span></button>` : ""}
          ${isAdmin() ? `<button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${escapeHtml(campus.id)}" aria-label="Delete ${escapeHtml(campus.name)}"><i class="bi bi-trash" aria-hidden="true"></i><span>Delete</span></button>` : ""}
        </div>
      </article>`).join("");
    document.querySelector("#results-count").textContent = `${campuses.length} ${campuses.length === 1 ? "campus" : "campuses"}`;
    document.querySelector("#empty-state").hidden = campuses.length !== 0;
  }

  function updateDashboard() {
    const dashboard = document.querySelector("#admin-dashboard");
    if (!dashboard) return;
    dashboard.hidden = !isAdmin();
    if (!isAdmin()) return;

    const storage = Object.fromEntries(Object.keys(sessionStorage).map((key) => [key, sessionStorage.getItem(key)]));
    document.querySelector("#user-inspector").textContent = JSON.stringify(ACCOUNTS.map(({ username, role }) => ({ username, role })), null, 2);
    document.querySelector("#record-inspector").textContent = JSON.stringify(state.campuses || [], null, 2);
    document.querySelector("#storage-inspector").textContent = JSON.stringify(storage, null, 2);
    document.querySelector("#state-inspector").textContent = JSON.stringify(state, null, 2);
    document.querySelector("#dashboard-user-count").textContent = ACCOUNTS.length;
    document.querySelector("#dashboard-record-count").textContent = (state.campuses || []).length;
    document.querySelector("#dashboard-storage-count").textContent = Object.keys(storage).length;
  }

  async function loadCampuses() {
    if (state.campuses) {
      renderCampuses();
      updateDashboard();
      return;
    }
    try {
      const response = await fetch("../assets/data/campuses.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.campuses = await response.json();
      saveState();
      renderCampuses();
      console.info("[dev|delta] Initial campus records loaded with fetch().", state.campuses.length);
    } catch (error) {
      console.error("[dev|delta] Campus JSON could not be loaded. Run this site through a local web server.", error);
      document.querySelector("#load-error").hidden = false;
    }
  }

  function resetForm() {
    const form = document.querySelector("#campus-form");
    form.reset();
    form.elements.id.value = "";
    document.querySelector("#form-heading").textContent = "Add campus";
    document.querySelector("#cancel-edit").hidden = true;
  }

  function setupCampusPage() {
    if (!document.querySelector("#campus-list")) return;
    if (!currentUser()) {
      window.location.replace("login.html");
      return;
    }

    document.querySelector(".dashboard-page").hidden = false;
    document.querySelector("#account-label").textContent = `${currentUser().username} · ${currentUser().role}`;
    document.querySelector("#sign-in-link").hidden = true;
    document.querySelector("#sign-out-button").hidden = false;
    document.querySelector("#campus-form-section").hidden = !canEdit();
    document.querySelector("#sign-out-button").addEventListener("click", () => {
      state.user = null;
      saveState();
      window.location.replace("login.html");
    });
    document.querySelector("#campus-search").addEventListener("input", renderCampuses);
    document.querySelector("#state-filter").addEventListener("change", renderCampuses);
    document.querySelector("#sort-order").addEventListener("change", renderCampuses);
    document.querySelector("#clear-filters").addEventListener("click", () => {
      document.querySelector("#campus-search").value = "";
      document.querySelector("#state-filter").value = "all";
      document.querySelector("#sort-order").value = "name-asc";
      renderCampuses();
    });
    document.querySelector("#campus-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canEdit()) return;
      const form = event.currentTarget;
      const record = {
        id: form.elements.id.value || `campus-${Date.now()}`,
        name: form.elements.name.value.trim(),
        city: form.elements.city.value.trim(),
        state: form.elements.state.value,
        enrollment: Number(form.elements.enrollment.value),
        type: form.elements.type.value,
        description: form.elements.description.value.trim()
      };
      const existingIndex = state.campuses.findIndex((campus) => campus.id === record.id);
      if (existingIndex < 0) state.campuses.unshift(record);
      else state.campuses[existingIndex] = record;
      saveState();
      renderCampuses();
      resetForm();
      console.info(`[dev|delta] Campus record ${existingIndex < 0 ? "created" : "updated"}.`, record.id);
    });
    document.querySelector("#cancel-edit").addEventListener("click", resetForm);
    document.querySelector("#campus-list").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const campus = state.campuses.find((item) => item.id === button.dataset.id);
      if (!campus) return;
      if (button.dataset.action === "edit" && canEdit()) {
        const form = document.querySelector("#campus-form");
        Object.entries(campus).forEach(([key, value]) => {
          if (form.elements[key]) form.elements[key].value = value;
        });
        document.querySelector("#form-heading").textContent = "Edit campus";
        document.querySelector("#cancel-edit").hidden = false;
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (button.dataset.action === "delete" && isAdmin()) {
        state.campuses = state.campuses.filter((item) => item.id !== campus.id);
        saveState();
        renderCampuses();
        console.info("[dev|delta] Admin deleted campus record.", campus.id);
      }
    });
    loadCampuses();
  }

  function setupLoginPage() {
    const form = document.querySelector("#signin-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = form.elements.username.value.trim();
      const password = form.elements.password.value;
      const account = ACCOUNTS.find((item) => item.username === username && item.password === password);
      const feedback = document.querySelector("#user-greeting");
      if (!account) {
        feedback.textContent = "Username or password is incorrect. Please try again.";
        console.warn("[dev|delta] Sign-in rejected.", username);
        return;
      }
      state.user = { username: account.username, role: account.role };
      saveState();
      console.info("[dev|delta] Signed in.", state.user);
      window.location.href = "campus.html";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupLoginPage();
    setupCampusPage();
  });
})();
