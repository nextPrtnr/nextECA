document.addEventListener("DOMContentLoaded", () => {
  fetch("ecas.json")
    .then((res) => res.json())
    .then((data) => {
      allECAs = data;
      renderCards(data);
      populateFilters(data);
    });

  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("countryFilter").addEventListener("change", applyFilters);
  document.getElementById("locationFilter").addEventListener("change", applyFilters);
  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
});

let allECAs = [];

function renderCards(data) {
  const container = document.getElementById("eca-list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p class='no-result'>No opportunities match your filters.</p>";
    return;
  }

  data.forEach((e) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${e.image}" alt="${e.title}" />
      <h3>${e.title}</h3>
      <p>${e.description}</p>
      <div class="tags">
        <span class="red-tag">Deadline: ${e.deadline}</span>
        <span class="yellow-tag">Event: ${e.eventDate}</span>
        <span class="green-tag">${e.eligibility}</span>
        <span class="purple-tag">${e.country} (${e.location.toUpperCase()})</span>
        ${e.tags.map(tag => `<span class="blue-tag">${tag}</span>`).join("")}
      </div>
      <a href="${e.link}" class="learn-more-btn" target="_blank">Learn More</a>
    `;
    container.appendChild(card);
  });
}

function populateFilters(data) {
  const countrySet = new Set();
  const categorySet = new Set();

  data.forEach((e) => {
    countrySet.add(e.country);
    categorySet.add(e.category);
  });

  const countryFilter = document.getElementById("countryFilter");
  countrySet.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    countryFilter.appendChild(opt);
  });

  const categoryFilter = document.getElementById("categoryFilter");
  categorySet.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(opt);
  });
}

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const country = document.getElementById("countryFilter").value;
  const location = document.getElementById("locationFilter").value;
  const category = document.getElementById("categoryFilter").value;

  const filtered = allECAs.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search) ||
      e.description.toLowerCase().includes(search);

    const matchesCountry = !country || e.country === country;
    const matchesLocation = !location || e.location.toLowerCase() === location.toLowerCase();
    const matchesCategory = !category || e.category === category;

    return matchesSearch && matchesCountry && matchesLocation && matchesCategory;
  });

  renderCards(filtered);
}
