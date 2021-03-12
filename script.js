const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveComfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;   
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites ={};

function showContent(page) {
    window.scrollTo({top:0, behavior:'instant'});
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultArray : Object.values(favorites);
    console.log(page,currentArray);
    currentArray.forEach((result) => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add to Favorite';
            saveText.setAttribute('onclick',`saveFavourites('${result.url}')`);
        }else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick',`removeFavourites('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date 
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent =` ${copyrightResult}`;
        // Append
        footer.append(date,copyright);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    })
}

function updateDOM(page){
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log(favorites);
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const responce = await fetch(apiUrl);
        resultArray = await responce.json();
        updateDOM('results');
    }catch {

    }
}

// OnLoad
getNasaPictures();

// Add result to favorites
function saveFavourites(itemUrl){
    // Loop through resultsarray to select favorites
    resultArray.forEach((item) => {
       if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
           favorites[itemUrl] = item;
           // Show save conformation for 2 seconds
           saveComfirmed.hidden = false;
           setTimeout(() => {
               saveComfirmed.hidden = true;
            },2000);
            // Set favorites in local storage
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
       } 
    });
}

// Remove item form favorites
function removeFavourites(itemUrl) {
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        // Set favorites in local storage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDOM('favorites')
    }
}