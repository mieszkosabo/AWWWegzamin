const renderEntries = (entries) => {
  const entriesDiv = document.getElementById("ostatnie-wpisy");
  entries.forEach((entry) => {
    const singleEntry = document.createElement('li');
    singleEntry.innerText = `${entry.login_osoby}: ${entry.tresc}`;
    entriesDiv.appendChild(singleEntry);
  });
};

const request = new XMLHttpRequest();
request.open('GET', `http://localhost:3000/getNewEntries`, true);
// request.setRequestHeader('CSRF-Token', csrfToken);
request.onreadystatechange = () => {
  if (request.readyState === XMLHttpRequest.DONE) {
    var status = request.status;
    if (status === 0 || (status >= 200 && status < 400)) {
      const entries = JSON.parse(request.responseText);
      renderEntries(entries);
    }
  }
}
request.send();