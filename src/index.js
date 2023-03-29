let addToy = false;
const toyDiv = document.querySelector('#toy-collection');
const likeButtons = document.getElementsByClassName('likes');
document.querySelector('.add-toy-form').addEventListener('submit', handleSubmit);

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function getToys() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then ((toys) => {
    toys.forEach(toy => renderToy(toy))
  })
};

getToys();

function renderToy(toy) {
    let card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>
      <span class="likes">${toy.likes}</span>
      <span>likes</span>
    </p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>`
    if (Number(card.querySelector('.likes').textContent) === 1) {
      card.querySelectorAll('span')[1].textContent = 'like'
    }
    toyDiv.appendChild(card)
    card.querySelector('.like-btn').addEventListener('click', () => {
      toy.likes++
      updateLikes(toy, card)
    })
};

function handleSubmit(e) {
  e.preventDefault()
  let toyObj = {
    name: e.target.name.value,
    image: e.target.image_url.value,
    likes: 0
  }
  updateServer(toyObj)
};

function updateServer(toyObj) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify(toyObj)
  })
  .then(res => res.json())
  .then(toy => {
      //render new toy after server updated
      //then add event listener that updates the likes in server + on DOM
    renderToy(toy)
  })
};

function updateLikes(toy, card) { 
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify({
      'likes': toy.likes
    })
  })
    .then(res => res.json())
    .then(updatedToy => {
      card.querySelector('.likes').textContent = updatedToy.likes
        if (updatedToy.likes === 1) {
          card.querySelectorAll('span')[1].textContent = 'like'
      } else {
        card.querySelectorAll('span')[1].textContent = 'likes'
      }
    })
};