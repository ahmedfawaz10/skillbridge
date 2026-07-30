// Members directory logic (members.html)

const state = {
  all: [],
  filtered: [],
  page: 1,
  pageSize: 6,
  sortKey: "default",
  view: "grid3"
};

const cardsContainer = document.getElementById("cardsContainer");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const paginationEl = document.getElementById("pagination");

const searchInput = document.getElementById("searchInput");
const filterRole = document.getElementById("filterRole");
const availabilityFilter = document.getElementById("availabilityFilter");
const cityFilter = document.getElementById("cityFilter");
const sortLabel = document.getElementById("sortLabel");

// ---------- Load data ----------
loading.style.display = "block";

fetch("data/members.json")
  .then(function (res) { return res.json(); })
  .then(function (data) {
    state.all = data;
    loadRoles(data);
    loadCities(data);
    applyFilters();
    loading.style.display = "none";
  })
  .catch(function (err) {
    loading.style.display = "none";
    cardsContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Could not load members data. (' + err.message + ')</div></div>';
  });

function loadRoles(members) {
  const roles = [...new Set(members.map(m => m.role))].sort();
  roles.forEach(function (role) {
    filterRole.innerHTML += `<option value="${role}">${role}</option>`;
    document.getElementById("offcanvasRoleList").innerHTML += `
      <button type="button" class="list-group-item list-group-item-action quick-role" data-role="${role}">${role}</button>`;
  });
}

function loadCities(members) {
  const cities = [...new Set(members.map(m => m.city))].sort();
  cities.forEach(function (city) {
    cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

// ---------- Filtering / sorting ----------
function applyFilters() {
  const term = searchInput.value.toLowerCase();
  const role = filterRole.value;
  const availability = availabilityFilter.value;
  const city = cityFilter.value;

  let result = state.all.filter(function (m) {
    const matchesTerm = !term ||
      m.name.toLowerCase().includes(term) ||
      m.role.toLowerCase().includes(term) ||
      m.city.toLowerCase().includes(term) ||
      m.skills.join(" ").toLowerCase().includes(term);

    const matchesRole = role === "all" || m.role === role;
    const matchesAvailability = availability === "all" || m.availability === availability;
    const matchesCity = !city || city === "all" || m.city === city;

    return matchesTerm && matchesRole && matchesAvailability && matchesCity;
  });

  switch (state.sortKey) {
    case "rating": result.sort((a, b) => b.rating - a.rating); break;
    case "credits": result.sort((a, b) => b.credits - a.credits); break;
    case "sessions": result.sort((a, b) => b.sessions - a.sessions); break;
    default: break;
  }

  state.filtered = result;
  state.page = 1;
  renderPage();
}

// ---------- Rendering ----------
function statusClass(availability) {
  if (availability === "Available") return "available";
  if (availability === "Busy") return "busy";
  return "offline";
}

function renderPage() {
  const start = (state.page - 1) * state.pageSize;
  const pageItems = state.filtered.slice(start, start + state.pageSize);

  cardsContainer.innerHTML = "";
  cardsContainer.className = state.view === "grid2" ? "row g-4 row-cols-1 row-cols-md-2" : "row g-4";

  if (state.filtered.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }

  pageItems.forEach(function (member) {
    const fallbackUrl = `https://ui-avatars.com/api/?background=0E7C74&color=fff&size=256&name=${encodeURIComponent(member.name)}`;
    const skillsHTML = member.skills.map(s => `<span class="badge rounded-pill badge-skill">${s}</span>`).join(" ");
    const featuredBadge = member.rating >= 4.9
      ? `<span class="badge text-bg-warning featured-tag"><i class="bi bi-star-fill"></i> Top Mentor</span>`
      : "";

    cardsContainer.innerHTML += `
      <div class="col-lg-${state.view === 'grid2' ? '6' : '4'} col-md-6">
        <div class="member-card">
          ${featuredBadge}
          <div class="card-content">
            <img src="${member.image}" alt="${member.name}" class="member-image"
                 onerror="this.onerror=null;this.src='${fallbackUrl}'">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>

            <div class="rating">
              ⭐ ${member.rating} <small>(${member.reviews} Reviews)</small>
            </div>

            <div class="skills">${skillsHTML}</div>

            <div class="stats">
              <div><h5>${member.sessions}</h5><small>Sessions</small></div>
              <div><h5>${member.credits}</h5><small>Credits</small></div>
            </div>

            <span class="status ${statusClass(member.availability)}"
                  data-bs-toggle="tooltip"
                  title="${member.availability === 'Available' ? 'Ready for a new skill exchange right now' : member.availability === 'Busy' ? 'Currently in an exchange — reply times may be slower' : 'Not taking new requests at the moment'}">
              ${member.availability}
            </span>

            <div class="d-flex gap-2 justify-content-center mt-3 flex-wrap">
              <a href="profile.html?id=${member.id}" class="btn btn-outline-primary btn-sm">View Profile</a>
              <button class="btn btn-primary btn-sm exchange-btn mt-0"
                      data-bs-toggle="modal" data-bs-target="#exchangeModal"
                      data-name="${member.name}" data-role="${member.role}" data-image="${member.image}" data-fallback="${fallbackUrl}">
                <i class="bi bi-arrow-left-right"></i> Exchange Skill
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll('#cardsContainer [data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(state.filtered.length / state.pageSize);
  paginationEl.innerHTML = "";
  if (totalPages <= 1) return;

  function pageItem(label, page, disabled, active) {
    return `<li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
      <a class="page-link" href="#members" data-page="${page}">${label}</a>
    </li>`;
  }

  let html = pageItem("«", state.page - 1, state.page === 1, false);
  for (let p = 1; p <= totalPages; p++) {
    html += pageItem(p, p, false, p === state.page);
  }
  html += pageItem("»", state.page + 1, state.page === totalPages, false);
  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll(".page-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = parseInt(this.dataset.page, 10);
      if (target >= 1 && target <= totalPages) {
        state.page = target;
        renderPage();
        document.getElementById("members").scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ---------- Filter controls ----------
searchInput.addEventListener("input", applyFilters);
filterRole.addEventListener("change", applyFilters);
availabilityFilter.addEventListener("change", applyFilters);
cityFilter.addEventListener("change", applyFilters);

// Sort dropdown (Bootstrap Dropdown component, not a <select>)
document.querySelectorAll(".sort-option").forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    state.sortKey = this.dataset.sort;
    sortLabel.textContent = this.textContent;
    applyFilters();
  });
});

// View toggle button group
document.querySelectorAll(".view-toggle").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".view-toggle").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    state.view = this.dataset.view;
    renderPage();
  });
});

// Offcanvas quick-role buttons (event delegation, buttons are added dynamically)
document.getElementById("offcanvasRoleList").addEventListener("click", function (e) {
  if (e.target.classList.contains("quick-role")) {
    filterRole.value = e.target.dataset.role;
    applyFilters();
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("filterOffcanvas")).hide();
  }
});

document.querySelectorAll(".offcanvas-availability").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".offcanvas-availability").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    availabilityFilter.value = this.dataset.availability;
    applyFilters();
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("filterOffcanvas")).hide();
  });
});

// ---------- Exchange modal ----------
const exchangeModal = document.getElementById("exchangeModal");
exchangeModal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  const name = button.dataset.name;
  document.getElementById("exchangeMemberName").textContent = name;
  document.getElementById("exchangeMemberRole").textContent = button.dataset.role;
  const img = document.getElementById("exchangeMemberImage");
  img.src = button.dataset.image;
  img.onerror = function () { img.onerror = null; img.src = button.dataset.fallback; };
  document.getElementById("exchangeForm").dataset.targetName = name;
});

document.getElementById("exchangeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (!this.checkValidity()) {
    this.classList.add("was-validated");
    return;
  }
  const name = this.dataset.targetName;
  const modalInstance = bootstrap.Modal.getInstance(exchangeModal);
  modalInstance.hide();
  this.reset();
  this.classList.remove("was-validated");

  document.getElementById("toastMessage").textContent = `Your exchange request was sent to ${name}. They'll reply from their SkillBridge inbox soon.`;
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("exchangeToast"));
  toast.show();
});
