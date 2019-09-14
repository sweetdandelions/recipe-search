// Variables declaration
const apiID = '692ff0ff';
const apiKey = '8e5c003afc2e09b6105e6175f1006b88';
const link = 'https://api.edamam.com/search';
const search = document.getElementById('search');


// Event listeners 
search.addEventListener('submit', getRecipe);

input.addEventListener("animationend", () => {
    input.classList.remove("apply-shake");
});

// Fetch results
function getRecipe(e) { 
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

    let url = `${link}?q=${userQuery}&app_id=${apiID}&app_key=${apiKey}&from=0&to=30`; 
    console.log("URL:", url); 
    fetch(url) 
    
    .then(response => {
        //console.log(response); 
        return response.json(); 
    })
        .then(data => {
            //console.log(data); 

            // Query not found
            if(data.hits.length === 0) {
                const div = document.createElement('div');

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

            let recipes = []; // create an empty array to hold each recipe
            let output = ''; // create a variable to hold the markup for each recipe item
            for(i = 0; i < data.hits.length; i++) { 
                recipes.push(data.hits[i].recipe); 
            }
            //console.log(recipes); 

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
        

            // Show container that you hid in css 
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
