const form = document.getElementById('form');
const search = document.getElementById('search');
const resultContainer = document.getElementById('result');
const moreContainer = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

function showData (data) {
        resultContainer.innerHTML = `
        <ul class="songs">
        ${data.data.map( song => 
        `<li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span
        ><button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">
          Get Lyrics
        </button>
        </li> `).join('')}
        </ul>
    `;

    if (data.next || data.prev) {
      moreContainer.innerHTML = `
      ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`: ''}
      ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`: ''}  
      
      `;
    } else {
      more.innerHTML = '';
    }
}

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>
  `

  more.innerHTML = '';
  
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}


form.addEventListener('submit', function (e) {
    e.preventDefault();

    const searchTerm = search.value.trim();
    
    if (!searchTerm) {
      alert('Please type in a search term')
    } else {
      searchSongs(searchTerm)
    }
})

resultContainer.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');


    getLyrics(artist, songTitle)
  }
});