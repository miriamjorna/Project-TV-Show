//You can edit ALL of the code here
// Store all episodes data from the API
let allEpisodes = [];

// Initialize the application by loading episodes and setting up event listeners
function setup() {
  allEpisodes = getAllEpisodes(); // Fixed shadowing
  makePageForEpisodes(allEpisodes);
  setupSearch();
}

// Set up search functionality to filter episodes by name or summary
function setupSearch() {
  const searchInput = document.getElementById("search-bar");
  const searchCount = document.getElementById("search-count");

  searchCount.innerText = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const episodeName = episode.name.toLowerCase();
      const episodeSummary = episode.summary
        ? episode.summary.toLowerCase()
        : "";
      return (
        episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
      );
    });

    searchCount.innerText = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
    makePageForEpisodes(filteredEpisodes);
  });
}

// Format season and episode numbers as 'SxxExx' format
function formatEpisodeCode(season, number) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedEpisode = String(number).padStart(2, "0");
  return `S${paddedSeason}E${paddedEpisode}`;
}

// Create a card DOM element for an individual episode with image and summary
function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.classList.add("card");

  const episodeCode = formatEpisodeCode(episode.season, episode.number);

  card.innerHTML = `
    <h2>${episode.name} - ${episodeCode}</h2>
    <img src="${episode.image.medium}" alt="Screenshot from ${episode.name}" />
    <div class="summary">${episode.summary}</div>
  `;
  return card;
}

// Render a list of episodes to the page by clearing and populating the root element
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "";
  for (const episode of episodeList) {
    const card = createEpisodeCard(episode);
    rootElem.appendChild(card);
  }
}

// Run setup when the page loads
window.onload = setup;
