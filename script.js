const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false; //to indicate images are ready to be loaded 
let imagesLoaded = 0; //the count of images loaded
let totalImages = 0; // it will be 30 as per the count specified, i.e. the data coming from the API
let photosArray = [];

let isInitialLoad = true // check if it is the first time loading the page or on refresh click

//Unsplash API
let initialCount = 5; //initially 5 photos will be loaded instead of 30 
const apiKey = 'V2F-j0YvHlt2JWuV-zwumnNWbyB3PevBYwNjZKMp_fY';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`; //pass 5 photos to load

// update the apiUrl with 30 photos as picCount after initial load
function updateAPIURLWithNewCount (picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}


//Check if all images were loaded
function imageLoaded(){
    imagesLoaded++; //as an image loads, increase the count by 1
    if(imagesLoaded === totalImages){   //when images loaded equals total number of images 
        ready = true;                   //indicate ready as true 
        loader.hidden = true;           //hide the loader
    }
}

//Create elements for links and photos, add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    //Run forEach loop for each photoArray element
    photosArray.forEach((photo) => {
        //Create <a> to link to unsplash
        const item = document.createElement('a');
        item.setAttribute('href', photo.links.html);
        item.setAttribute('target', '_blank');
        //Create <img> for a photo
        const img = document.createElement('img');
        img.setAttribute('src', photo.urls.regular);
        img.setAttribute('alt', photo.alt_description);
        img.setAttribute('title', photo.alt_description);
        //Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);
        //Put <img> inside <a>, then put both inside imageContainer element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
    
}

//Get photos from API
async function getPhotos(){
    try{
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) { // if it is the first time loading the page
            updateAPIURLWithNewCount(30) // update count with 30
            isInitialLoad = false // set it to false, it becomes true when we refresh or reload the page
        }
    }
    catch{
        //catch error here
    }
}

//Check to see if scrolling near bottom of the page, Load more photos
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready){
        ready = false;
        getPhotos();
    }
});


//On load
getPhotos();