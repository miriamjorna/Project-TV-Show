//You can edit ALL of the code here
// Store all episodes data from the API
let allShows = [];
let currentEpisodes = [];
const episodeCache = {}; // Caches fetched episodes to prevent duplicate network requests

async function setup() {
  // requirement 4: show loading message while fetching
  const rootElem = document.getElementById("root");
  rootElem.textContent = "Loading shows, please wait...";

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error(`Failed to load shows: ${response.status}`);
    }

    allShows = await response.json();

    // Requirement 5: Sort alphabetically, case-insensitive
    allShows.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );

    populateShowSelector(allShows);
    setupSearch(); // Initialize the search event listener once

    rootElem.textContent =
      "Please select a show from the dropdown to view episodes.";
  } catch (error) {
    //show error to user, not just console
    rootElem.textContent = `Something went wrong: ${error.message}. Please try refreshing the page.`;
  }
}

window.onload = setup;

function populateShowSelector(shows) {
  const showSelector = document.getElementById("show-selector");

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });

  // Event listener for when a show is selected
  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;
    const rootElem = document.getElementById("root");
    const searchInput = document.getElementById("search-bar");
    const episodeSelector = document.getElementById("episode-selector");

    // Reset search bar and episode selector on new show selection
    searchInput.value = "";
    episodeSelector.value = "";

    if (!showId) {
      rootElem.textContent =
        "Please select a show from the dropdown to view episodes.";
      document.getElementById("search-count").innerText = "";
      populateEpisodeSelector([]);
      return;
    }

    rootElem.textContent = "Loading episodes...";

    // Requirement 6: Check cache first to avoid duplicate fetches
    if (episodeCache[showId]) {
      currentEpisodes = episodeCache[showId];
      populateEpisodeSelector(currentEpisodes);
      makePageForEpisodes(currentEpisodes);
      updateSearchCount(currentEpisodes.length, currentEpisodes.length);
    } else {
      // If not in cache, fetch, store in cache, then display
      try {
        const response = await fetch(
          `https://api.tvmaze.com/shows/${showId}/episodes`,
        );
        if (!response.ok) {
          throw new Error(`Failed to load episodes.`);
        }
        const episodesData = await response.json();

        episodeCache[showId] = episodesData; // Save to cache
        currentEpisodes = episodesData; // Update current state

        populateEpisodeSelector(currentEpisodes);
        makePageForEpisodes(currentEpisodes);
        updateSearchCount(currentEpisodes.length, currentEpisodes.length);
      } catch (error) {
        rootElem.textContent = `Error loading episodes: ${error.message}`;
      }
    }
  });
}

function updateSearchCount(filteredCount, totalCount) {
  const searchCount = document.getElementById("search-count");
  searchCount.innerText = `Displaying ${filteredCount} / ${totalCount} episodes`;
}

function populateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-selector");

  // Clear existing options except the first placeholder
  episodeSelector.innerHTML = '<option value="">Select an episode...</option>';

  episodes.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  // Event listener for when an episode is selected
  episodeSelector.addEventListener("change", (event) => {
    const episodeId = event.target.value;
    const searchInput = document.getElementById("search-bar");

    // Reset search bar when selecting a specific episode
    searchInput.value = "";

    if (!episodeId) {
      // If no episode selected, show all episodes
      updateSearchCount(currentEpisodes.length, currentEpisodes.length);
      makePageForEpisodes(currentEpisodes);
      return;
    }

    // Find and display only the selected episode
    const selectedEpisode = currentEpisodes.find(
      (ep) => ep.id === parseInt(episodeId),
    );
    if (selectedEpisode) {
      makePageForEpisodes([selectedEpisode]);
      updateSearchCount(1, currentEpisodes.length);
    }
  });
}

function setupSearch() {
  const searchInput = document.getElementById("search-bar");
  const episodeSelector = document.getElementById("episode-selector");

  searchInput.addEventListener("input", (event) => {
    // If no show is selected yet, do nothing
    if (currentEpisodes.length === 0) return;

    // Reset episode selector when searching
    episodeSelector.value = "";

    const searchTerm = event.target.value.toLowerCase();

    const filteredEpisodes = currentEpisodes.filter((episode) => {
      const episodeName = episode.name.toLowerCase();
      const episodeSummary = episode.summary
        ? episode.summary.toLowerCase()
        : "";
      return (
        episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
      );
    });

    updateSearchCount(filteredEpisodes.length, currentEpisodes.length);
    makePageForEpisodes(filteredEpisodes);
  });
}

// Set up search functionality to filter episodes by name or summary

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

  // Handle case where episode may not have an image
  const imageHtml = episode.image?.medium
    ? `<img src="${episode.image.medium}" alt="Screenshot from ${episode.name}" />`
    : "";

  card.innerHTML = `
    <h2>${episode.name} - ${episodeCode}</h2>
    ${imageHtml}
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
