//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// 1: Formats the season and episode numbers
function formatEpisodeCode(season, number) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedEpisode = String(number).padStart(2, "0");
  return `S${paddedSeason}E${paddedEpisode}`;
}

// 2: Creates a single episode card element
function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.classList.add("card");

  const episodeCode = formatEpisodeCode(episode.season, episode.number);

  // Note the change from <p> to <div class="summary"> to fix any nested tag issue
  card.innerHTML = `
    <h2>${episode.name} - ${episodeCode}</h2>
    <img src="${episode.image.medium}" alt="Screenshot from ${episode.name}" />
    <div class="summary">${episode.summary}</div>
  `;

  return card;
}

// MAIN RENDER FUNCTION: Now it only handles looping and attaching to the DOM
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; // clear the existing content

  for (const episode of episodeList) {
    const card = createEpisodeCard(episode);
    rootElem.appendChild(card);
  }
}

window.onload = setup;
