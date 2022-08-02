function Update(element, food_id) {
  console.log(element.id);
  console.log(element.checked);
  console.log(food_id);

  fetch('/regular_food_post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: element.id, food_id, status: element.checked })
  }).then(response => response.json())
  .then(data => {
    console.log(data);
    element.id = data.new_id;
    ToggleDisable();
  });
}

const MAX_COUNT = 50;
function ToggleDisable() {
  const boxes = document.getElementsByClassName("boxes");
  let count = 0;
  let i;
  for (i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) count++;
  }
  if (count >= MAX_COUNT) {
    for (i = 0; i < boxes.length; i++) {
      if (!(boxes[i].checked)) {
        boxes[i].disabled = true;
      }
    }
  }
  else {
    for (i = 0; i < boxes.length; i++) {
      boxes[i].disabled = false;
    }
  }
}
ToggleDisable();
