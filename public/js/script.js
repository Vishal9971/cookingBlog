let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientsList = document.querySelector('.ingredientsList');
let ingredientsDiv = document.querySelectorAll('.ingredientsDiv')[0];

addIngredientsBtn.addEventListener('click', function () {
  let newIngredients = ingredientsDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName('input')[0];
  input.value = '';
  ingredientsList.appendChild(newIngredients);
});
