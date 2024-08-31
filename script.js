document.addEventListener('DOMContentLoaded', function() {
    const addRecipeBtn = document.getElementById('add-recipe');
    const viewRecipesBtn = document.getElementById('view-recipes');
    const recipeFormSection = document.getElementById('recipe-form');
    const recipeListSection = document.getElementById('recipe-list');
    const recipeForm = document.getElementById('recipe-form-element');
    const recipesContainer = document.getElementById('recipes-container');

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    function displaySection(section) {
        recipeFormSection.classList.add('hidden');
        recipeListSection.classList.add('hidden');
        section.classList.remove('hidden');
    }

    function displayRecipes() {
        recipesContainer.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <button onclick="toggleIngredients(${index})">View Ingredients</button>
                <div class="ingredients-list" id="ingredients-${index}">
                    ${recipe.ingredients.split(',').map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
                </div>
                <div class="recipe-options">
                    <button class="recipe-options-btn">...</button>
                    <div class="recipe-options-menu hidden" id="options-${index}">
                        <button onclick="editRecipe(${index})">Edit</button>
                        <button onclick="deleteRecipe(${index})">Delete</button>
                    </div>
                </div>
            `;
            recipeCard.querySelector('.recipe-options-btn').addEventListener('click', function() {
                const optionsMenu = document.getElementById(`options-${index}`);
                optionsMenu.classList.toggle('hidden');
            });
            recipesContainer.appendChild(recipeCard);
        });
    }

    recipeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('recipe-name').value;
        const ingredients = document.getElementById('recipe-ingredients').value;
        const imageFile = document.getElementById('recipe-image').files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
            const newRecipe = {
                name,
                ingredients,
                image: reader.result
            };
            recipes.push(newRecipe);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            recipeForm.reset();
            alert('Recipe saved successfully!');
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            alert('Please add an image.');
        }
    });

    window.toggleIngredients = function(index) {
        const ingredientsList = document.getElementById(`ingredients-${index}`);
        ingredientsList.style.display = ingredientsList.style.display === 'block' ? 'none' : 'block';
    };
    window.editRecipe = function(index) {
        const recipe = recipes[index];
        document.getElementById('recipe-name').value = recipe.name;
        document.getElementById('recipe-ingredients').value = recipe.ingredients;
        displaySection(recipeFormSection);

        // Remove the old recipe and replace it with the updated one
        recipeForm.removeEventListener('submit', addNewRecipe);
        recipeForm.addEventListener('submit', function updateRecipe(event) {
            event.preventDefault();
            const updatedName = document.getElementById('recipe-name').value;
            const updatedIngredients = document.getElementById('recipe-ingredients').value;
            const updatedImageFile = document.getElementById('recipe-image').files[0];
            const updatedReader = new FileReader();

            updatedReader.onloadend = function() {
                recipes[index] = {
                    name: updatedName,
                    ingredients: updatedIngredients,
                    image: updatedReader.result || recipe.image
                };
                localStorage.setItem('recipes', JSON.stringify(recipes));
                recipeForm.reset();
                displaySection(recipeListSection);
                displayRecipes();
                alert('Recipe updated successfully!');
            };

            if (updatedImageFile) {
                updatedReader.readAsDataURL(updatedImageFile);
            } else {
                updatedReader.onloadend();
            }
        }, { once: true });
    };

    window.deleteRecipe = function(index) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            recipes.splice(index, 1);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            displayRecipes();
        }
    };

    addRecipeBtn.addEventListener('click', function() {
        displaySection(recipeFormSection);
        recipeForm.addEventListener('submit', addNewRecipe);
    });

    viewRecipesBtn.addEventListener('click', function() {
        displaySection(recipeListSection);
        displayRecipes();
    });
    function addNewRecipe(event) {
        event.preventDefault();
        const name = document.getElementById('recipe-name').value;
        const ingredients = document.getElementById('recipe-ingredients').value;
        const imageFile = document.getElementById('recipe-image').files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
            const newRecipe = {
                name,
                ingredients,
                image: reader.result
            };
            recipes.push(newRecipe);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            recipeForm.reset();
            displaySection(recipeListSection);
            displayRecipes();
            alert('Recipe added successfully!');
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            alert('Please add an image.');
        }
    }



    // Display recipes by default
    displaySection(recipeListSection);
    displayRecipes();
});
