// Member profile page logic (profile.html)

const params = new URLSearchParams(window.location.search);
const memberId = parseInt(params.get("id"), 10) || 1;

fetch("data/members.json")
  .then(res => res.json())
  .then(function (members) {
    const member = members.find(m => m.id === memberId) || members[0];
    renderProfile(member, members);
  })
  .catch(function () {
    document.getElementById("profileRoot").innerHTML =
      '<div class="alert alert-danger">Could not load this profile right now.</div>';
  });

function statusClass(availability) {
  if (availability === "Available") return "available";
  if (availability === "Busy") return "busy";
  return "offline";
}

function renderProfile(member, allMembers) {
  document.title = member.name + " | SkillBridge";

  const fallbackUrl = `https://ui-avatars.com/api/?background=0E7C74&color=fff&size=256&name=${encodeURIComponent(member.name)}`;

  document.getElementById("breadcrumbName").textContent = member.name;
  document.getElementById("profileImage").src = member.image;
  document.getElementById("profileImage").onerror = function () {
    this.onerror = null;
    this.src = fallbackUrl;
  };
  document.getElementById("profileName").textContent = member.name;
  document.getElementById("profileRole").textContent = member.role;
  document.getElementById("profileCity").textContent = member.city + ", " + member.country;
  document.getElementById("profileRating").innerHTML = `⭐ ${member.rating} <small>(${member.reviews} reviews)</small>`;
  document.getElementById("profileStatus").textContent = member.availability;
  document.getElementById("profileStatus").className = "status " + statusClass(member.availability);
  document.getElementById("profileCredits").textContent = member.credits;
  document.getElementById("profileSessions").textContent = member.sessions;
  document.getElementById("profileExperience").textContent = member.experience;
  document.getElementById("profileBio").textContent = member.bio;

  if (member.rating >= 4.9) {
    document.getElementById("verifiedBadge").classList.remove("d-none");
  }

  // Skills tab — badges + progress bars
  const badgesHTML = member.skills.map(s => `<span class="badge rounded-pill badge-skill">${s}</span>`).join(" ");
  document.getElementById("skillBadges").innerHTML = badgesHTML;

  const progressStart = 92;
  let progressHTML = "";
  member.skills.forEach(function (skill, i) {
    const value = Math.max(55, progressStart - i * 9);
    progressHTML += `
      <div class="skill-progress mb-3">
        <div class="label-row">
          <span>${skill}</span>
          <span class="text-mono">${value}%</span>
        </div>
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width:${value}%" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>`;
  });
  document.getElementById("skillProgress").innerHTML = progressHTML;

  // Reviews tab — sessions table + list group
  const partners = allMembers.filter(m => m.id !== member.id);
  const sampleDates = ["Jul 2, 2026", "Jun 18, 2026", "May 30, 2026", "May 11, 2026"];
  let rowsHTML = "";
  let listHTML = "";
  for (let i = 0; i < 4; i++) {
    const partner = partners[(member.id + i) % partners.length];
    const sessionRating = (4.5 + (i % 3) * 0.2).toFixed(1);
    rowsHTML += `
      <tr>
        <td>${sampleDates[i]}</td>
        <td>${member.skills[i % member.skills.length]}</td>
        <td>${partner.name}</td>
        <td>⭐ ${sessionRating}</td>
      </tr>`;
    listHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-1">
          <div class="fw-semibold">${partner.name}</div>
          <small class="text-muted">"Great session on ${member.skills[i % member.skills.length]}, would exchange again."</small>
        </div>
        <span class="badge text-bg-light border">⭐ ${sessionRating}</span>
      </li>`;
  }
  document.getElementById("sessionsTableBody").innerHTML = rowsHTML;
  document.getElementById("reviewsList").innerHTML = listHTML;

  // Exchange modal wiring (reuses the same modal pattern as members.html)
  document.getElementById("profileExchangeBtn").addEventListener("click", function () {
    document.getElementById("exchangeMemberName").textContent = member.name;
  });

  document.querySelectorAll('[data-bs-toggle="tooltip"], [data-bs-toggle="popover"]').forEach(function (el) {
    if (el.dataset.bsToggle === "tooltip") new bootstrap.Tooltip(el);
    if (el.dataset.bsToggle === "popover") new bootstrap.Popover(el);
  });
}
