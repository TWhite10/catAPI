import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
    "live_OBDjG8qEZoYQmlIbzIr1QlQKJwcKigRRd4QneSkNdhpO9Nf4haxFN0AIBsnWh1Gf";
    axios.defaults.headers.common['x-api-key']= API_KEY;

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
function buildCarouselItems (imageDataArray,CarouselElement){
    CarouselElement.innerHTML = "";
    imageDataArray.forEach((imageData, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";

        // if(response.data.length === 0){
        //     const noFavouriteImg = "catAssign/img/image.png";
        //     buildCarouselItems([ {url:noFavouriteImg}],carousel);
        // }

        if (index === 0) {
            carouselItem.classList.add("active");
        }
        
        const img = document.createElement("img");
        //image for when there is no cat image this is not working 
        //const noImg = "catAssign/img/image.png";
        img.src = imageData.url
        //|| noImg;
        img.className = "d-block w-100 ";

        carouselItem.appendChild(img);

        CarouselElement.appendChild(carouselItem);
    });
}

async function initialLoad() {

    try {

        const response = await axios.get("https://api.thecatapi.com/v1/breeds");
        const breeds = response.data;

        breeds.forEach((breed) => {
            const option = document.createElement(`option`);
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option)
        });


        breedSelect.addEventListener("change", (event) => {
            const selectedBreedId = event.target.value;
            progressBar.style.width = "0%";


            const carousel = document.getElementById("carouselInner");

            carousel.innerHTML = "";
            infoDump.innerHTML = "";

            function updateProgress(progressEvent) {

                const percent = (progressEvent.loaded / progressEvent.total) * 100;
                progressBar.style.width = percent + "%";
                console.log(`Loading: ${Math.round(percent)}%`);

            }

            axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId}&limit=10`, {
                onDownloadProgress: updateProgress
            })
            progressBar.style.width = '100%';


            axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId}&limit=10`)
                .then((response) => {

                    const data = response.data;
                    buildCarouselItems(data,carousel);
                    

                  

                })
            axios.get(`https://api.thecatapi.com/v1/breeds/${selectedBreedId}`)

                .then((response) => {
                    const breed = response.data;
                    infoDump.innerHTML = `
                    <h3>${breed.name}</h3>
                    <p>${breed.description}</p>
                    <p><strong>Temperament:</strong> ${breed.temperament}</p>
                    <p><strong>Origin:</strong> ${breed.origin}</p>
                    <p><strong>Weight:</strong> ${breed.weight} kg</p>
                    <p><strong>Life Span:</strong> ${breed.life_span} years</p>`;
                })
                .catch((error) => {
                    console.error("There was a problem:", error);
                    infoDump.innerHTML = "<p>Error loading cat information</p>";
                });
            progressBar.style.width = "0%";





        }); console.log(response);
    } catch (error) {
        console.error(error);
        progressBar.style.width = "0%";

    }

}
initialLoad()

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use(

    config => {
        console.log(
            `${config.method.toUpperCase()} sent request to ${config.url} at ${new Date().getTime()}`
        );
        document.body.style.cursor = `progress`;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
    progressBar.style.width = "0%"


);
axios.interceptors.response.use(
    response => {
        document.body.style.cursor = `default`;
        return response;
    }
)


/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
    // i cant seem to get the favourite image to work
    

    try {
        //what are all the images in favourites
        const responseFav = await axios.get("https://api.thecatapi.com/v1/favourites/");
        console.log(responseFav);
        //check if the image already exist 
        const ifImgExist = responseFav.data.find(r => r.image_id === imgId)
        if (ifImgExist) {
            await axios.delete(`https://api.thecatapi.com/v1/favourites/${ifImgExist.id}`)
                console.log(`Deleted post with ID ${ifImgExist.id}`);
                
        } else {
            await axios.post(`https://api.thecatapi.com/v1/favourites`, {
                "image_id": imgId,
                "sub_id": "optional unique id of your user"

            }
        ),console.log(`Deleted post with ID ${ifImgExist.id}`);
              
        }

    }
    catch (error) {
        console.error(`Error :`, error);
    }

}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */



getFavouritesBtn.addEventListener("click", async function () {

    const carousel = document.getElementById("carouselInner");
    const response = await axios.get("https://api.thecatapi.com/v1/favourites/")

    if(response.data.length === 0){
        const noFavouriteImg = "catAssign/img/image.png";
        buildCarouselItems([ {url:noFavouriteImg}],carousel);
    }

     const favouriteImgs = response.data.map(favourite => ({
        url: favourite.image.url
     }));

     buildCarouselItems(favouriteImgs,carousel);

     (error => {
        console.error(`Error :`, error);
    })
    
    
  });


/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */


//create array to post favourite list 
// press button you will see all fav
//display go by the src which is a link to that picture 
//the response from the api is an empty array, you need to add the logic 
//fetch api if it is empty array, if the cat selected has no picture you create a picture that will go that is a dummy img display to the use that the images are not available 
//dummy images - put the link put the img from imgs folder  


