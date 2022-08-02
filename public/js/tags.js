function Update(element) {
  console.log(element.id);
  console.log(element.checked);

  fetch('/tags_post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _id: element.id, important: element.checked })
  });
}