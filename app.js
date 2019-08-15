// Set API ID
const apiID = '692ff0ff';
// Set API key
const apiKey = '8e5c003afc2e09b6105e6175f1006b88';
// Get input value (user enters: broccoli)
let query = document.getElementById('input');
// Set the link to fetch data later
const url = 'https://api.edamam.com/search';
// Get the form
const search = document.getElementById('search');


// Event on the form - hit enter or click button gets you results
search.addEventListener('submit', getRecipe);

input.addEventListener("animationend", () => {
    input.classList.remove("apply-shake");
});

// Fetch results
function getRecipe(e) { // pass the event
    e.preventDefault(); // prevents reload on page 

    // Get input value
    const userQuery = document.querySelector('#input').value;

    // Check if input is empty
    if(userQuery === '') {
        // shake input
        input.classList.add("apply-shake");
        // change input placeholder and color
        input.placeholder = 'Please enter something';
        input.style.setProperty("--placeholder", "red");

        // Clear error message
        setTimeout(() => {
            input.placeholder = 'Type a food or a meal...';
            input.style.setProperty("--placeholder", "#800870");
        }, 3000);

         return;
    } else {

    // Cuz it's not working on empty input - fix that in the future
    let link = `${url}?q=${query.value}&app_id=${apiID}&app_key=${apiKey}&from=0&to=12`; // show 12 items : look for count implementation
    console.log("URL:", link); // check if it actually calls - just to be sure for syntax errors
    fetch(link) // make api call
    
    .then(response => {
        console.log(response); // check if you got 200 ok
        return response.json(); // get data so you can work with it
    })
        .then(data => {
            console.log(data); // check that you actually got the data which is json object and
            // look for hits array  which holds recipies and the parameters you need to work with later
            // via dot notation to access them (object access dummy!)

            // Query not found
            if(data.hits.length === 0) {
                const div = document.createElement('div');

                // Add the HTML
                div.innerHTML = `
                    <div class="err">
                    There\'re no results. 
                    </div>
                `;
                    // Insert before input field
                    const reference = document.querySelector('#input');
                    const parentNode = reference.parentElement;
                    parentNode.insertBefore(div, reference);

                    // Remove error box after 3s
                    setTimeout(() => {
                        document.querySelector('.err').remove();
                   }, 3000);
                return;
            } else {

            let recipes = []; // create an empty array to hold each recipie
            let output = ''; // create a variable to hold the markup for each recipe item
            for(i = 0; i < data.hits.length; i++) { // loop through each element (object) hits contains
                recipes.push(data.hits[i].recipe); // place every item into the array that contains the recipe obj
            }
            console.log(recipes); // see what you actually got

            recipes.forEach((recipe) => {
                output += `<div class="item">
                <div class="img"><img src="${recipe.image}" alt="${recipe.label}"></div>
                <h2>${recipe.label}</h2>
                <p>By ${recipe.source}</p>
                <figcaption><a href="${recipe.url}" target="_blank">Read Cooking Instructions</a></figcaption>
                <p>Total time: ${recipe.totalTime}</p>
                <details>
                <summary>Ingredients list</summary>
          `;
                // Loop through each of the lines
                recipe.ingredientLines.forEach((line) => {
                      output += `<li> ${line}</li>`;
                });

                output += `</details>
                    <div class="info">
                        <div class="pill">Yield: ${recipe.yield}</div>
                        <div class="danger">Cautions: ${recipe.cautions}</div>
                    </div>
                </div>`;
            });
        

            // Show container that you hid in css goddamnit!! 
            document.querySelector('.item-container').style.display = 'grid';
            // Insert results
            document.getElementById('results').innerHTML = output;
            
            console.log(output);
        }
    })
        // if error occurs
        .catch((error) => {console.log(error)});
        }
    }
