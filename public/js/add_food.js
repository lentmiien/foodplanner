const unit_options = ['g', 'dl', 'cc', 'tbs', 'tsp', 'unit', 'kg', 'l', 'pinch'];

const ingredients = document.getElementById("ingredients");
let ingredients_row_count = 0;
function AddIngredientRow() {
  // Add row in table
  // Ingredient (name), Amount (number), Unit (select)
  const row = document.createElement('tr');
  const ingredient = document.createElement('td');
  const amount = document.createElement('td');
  const unit = document.createElement('td');

  // Ingredient (name)
  const ingredient_input = document.createElement('input');
  ingredient.appendChild(ingredient_input);
  ingredient_input.id = `ingredient_input${ingredients_row_count}`;
  ingredient_input.name = `ingredient_input${ingredients_row_count}`;
  ingredient_input.style.width = "100%";
  ingredient_input.type = "text";

  // Amount (number)
  const amount_input = document.createElement('input');
  amount.appendChild(amount_input);
  amount_input.id = `amount_input${ingredients_row_count}`;
  amount_input.name = `amount_input${ingredients_row_count}`;
  amount_input.style.width = "100%";
  amount_input.type = "number";

  // Unit (select)
  const unit_input = document.createElement('select');
  unit_options.forEach(uo => {
    const option = document.createElement('option');
    option.value = uo;
    option.innerText = uo;
    unit_input.appendChild(option);
  });
  unit.appendChild(unit_input);
  unit_input.id = `unit_input${ingredients_row_count}`;
  unit_input.name = `unit_input${ingredients_row_count}`;
  unit_input.style.width = "100%";

  row.appendChild(ingredient);
  row.appendChild(amount);
  row.appendChild(unit);
  ingredients.appendChild(row);

  ingredients_row_count++;
}

const make = document.getElementById("make");
let make_row_count = 0;
function AddStepRow() {
  // Add row in table
  // Step (text)
  const row = document.createElement('tr');
  const step = document.createElement('td');

  // Step (text)
  const step_input = document.createElement('input');
  step.appendChild(step_input);
  step_input.id = `step_input${make_row_count}`;
  step_input.name = `step_input${make_row_count}`;
  step_input.style.width = "100%";
  step_input.type = "text";

  row.appendChild(step);
  make.appendChild(row);

  make_row_count++;
}

const tags = document.getElementById("tag");
let tags_row_count = 0;
function AddTagRow() {
  // Add row in table
  // Tag (name)
  const row = document.createElement('tr');
  const tag = document.createElement('td');

  // Tag (name)
  const tag_input = document.createElement('input');
  tag.appendChild(tag_input);
  tag_input.id = `tag_input${tags_row_count}`;
  tag_input.name = `tag_input${tags_row_count}`;
  tag_input.style.width = "100%";
  tag_input.type = "text";
  tag_input.setAttribute("list", "tag_data");

  row.appendChild(tag);
  tags.appendChild(row);

  tags_row_count++;
}
