const portions = document.getElementById("portions");
const amounts = document.getElementsByClassName("amounts");
const default_portions = parseInt(document.getElementById("default_portions").innerHTML);
const start_amounts = [];

for (let i = 0; i < amounts.length; i++) {
  start_amounts.push(parseInt(amounts[i].innerHTML));
}

portions.addEventListener('change', UpdateAmounts);

function UpdateAmounts() {
  for (let i = 0; i < amounts.length; i++) {
    amounts[i].innerHTML = Math.round(10 * start_amounts[i] * parseInt(portions.value) / default_portions) / 10;
  }
}
UpdateAmounts();
