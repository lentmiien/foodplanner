function RateFood(element) {
  if (element.dataset.id == "null") return; // No food to rate

  // element: data-id=`food_id`
  //          value is rating
  // Save to data-datestr=`${f.date}` in localstorage
  const food_id = element.dataset.id;
  const datestr = element.dataset.datestr;
  const rating = parseInt(element.value);

  // LocalStorage
  if (localStorage.datearray) {
    const curr_array = JSON.parse(localStorage.datearray);
    curr_array.push(datestr);
    localStorage.datearray = JSON.stringify(curr_array);
  } else {
    localStorage.datearray = JSON.stringify([datestr]);
  }

  // /add_rate_post
  fetch('/add_rate_post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ food_id, rating })
  });

  // Disable further input
  element.disabled = true;
}

async function EditSchedule(element, i, date_str) {
  // element: value is food_id
  // use i to edit id=`cook${i}` -> innerText=`food_name`
  // use i to edit id=`rate${i}` -> data-id=`food_id`
  const food_id = element.value;
  const datestr = date_str;

  // Update HTML
  document.getElementById(`cook${i}`).innerText = element.options[element.selectedIndex].text;
  document.getElementById(`rate${i}`).dataset.id = food_id;

  // Send date_str and food_id to server
  // /add_schedule_post
  await fetch('/add_schedule_post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ food_id, datestr })
  });
}

// Check local storage and disable rating that has been submitted
if (localStorage.datearray) {
  const elements = document.getElementsByClassName("rate_input");
  const date_array = JSON.parse(localStorage.datearray);
  for (let i = 0; i < elements.length; i++) {
    if (date_array.indexOf(elements[i].dataset.datestr) >= 0) {
      elements[i].disabled = true;
    }
  }
}

const rows = document.querySelectorAll('[data-tags]');
function FilterTags(e) {
  if (e.value.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].dataset.tags.indexOf(`|${e.value}|`) >= 0) {
        rows[i].style.display = 'table-row';
      } else {
        rows[i].style.display = 'none';
      }
    }
  } else {
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = 'table-row';
    }
  }
}
