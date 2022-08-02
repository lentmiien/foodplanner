const output = document.getElementById("output");
const food = JSON.parse(document.getElementById("food").innerHTML);
const schedule = JSON.parse(document.getElementById("schedule").innerHTML);
const from = document.getElementById("from");
const to = document.getElementById("to");
const food_lookup = [];
food.forEach(f => food_lookup.push(f._id));

let copy_content = '';

function GenerateList() {
  const needed = [];
  const needed_lookup = [];

  // Check schedule
  schedule.forEach(s => {
    const d = new Date(s.date);
    const dstr = `${d.getFullYear()}-${d.getMonth() > 8 ? d.getMonth()+1 : '0' + (d.getMonth()+1)}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()}`;

    if (dstr >= from.value && dstr <= to.value) {
      const portions = parseInt(document.getElementById(`portions_${dstr}`).value);
      const index = food_lookup.indexOf(s.food_id);
      const portion_multiplier = portions / food[index].portions;
      food[index].ingredients.forEach(i => {
        const nix = needed_lookup.indexOf(i.name);
        if (nix == -1) {
          needed.push({
            name: i.name,
            amount: [ `${Math.round(10 * portion_multiplier * i.amount) / 10} ${i.unit}` ]
          });
          needed_lookup.push(i.name);
        } else {
          needed[nix].amount.push(`${Math.round(10 * portion_multiplier * i.amount) / 10} ${i.unit}`);
        }
      });
    }
  });

  // Print output
  let outstr = '';
  copy_content = '';
  needed.forEach(n => {
    outstr += `<div><b>${n.name}</b><br>${n.amount.join(' + ')}</div><hr>`;
    copy_content += `${n.name}: ${n.amount.join(' + ')}\r\n`;
  });
  output.innerHTML = outstr;

  CopyList();
}

function CopyList() {
  // Copy to clipboard
  function listener(e) {
    // e.clipboardData.setData('text/html', output);
    e.clipboardData.setData('text/plain', copy_content);
    e.preventDefault();
  }
  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
}
