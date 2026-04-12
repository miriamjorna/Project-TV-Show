//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes[0]); // check the episode structure
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; // clear the existing content

  for (const episode of episodeList) {
    const card = document.createElement("div");
    card.classList.add("card");
    
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const SEcode = `S${seasonCode}E${episodeCode}`;
    
    card.innerHTML = `
      <h2>${episode.name} - ${SEcode}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}" />
      <p>${episode.summary}</p>
    `;
    rootElem.appendChild(card);
  }
}

window.onload = setup;
