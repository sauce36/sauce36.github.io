//let tg = window.Telegram.WebApp;
const cards = document.getElementById('cards');
const cardsDesc = document.getElementById('cardsDesc');
const body = document.getElementsByTagName('body')[0];

const icons = document.getElementById('svg');


window.addEventListener('popstate', async () => {
    if (history.state == null) {
        let cardDesc = cardsDesc.querySelector('[class="cardDesc"]');
        await hideCard(cardDesc);
    }
});

cardsDesc.addEventListener('transitionend', () => {
    if (cardsDesc.classList.contains('hide')) {
        for (let cDesc of cardsDesc.getElementsByClassName('cardDesc')) {
            if (!cDesc.classList.contains('hide')) {
                toggleClass(cDesc, 'hide')
            }
        }
    };
    if (history.state != null & cardsDesc.classList.contains('hide')) {
        history.back();
    }
});

cardsDesc.addEventListener('transitioncancel', () => {
    let c = cardsDesc.querySelectorAll('[class="cardDesc"]');
    if (c.length <= 1) {
        return
    } else {
        for (let i=c.length-1; i>0; i--) {
            toggleClass(c[i], 'hide')
        }
    };
});


function toggleClass(elem, cName) {
    elem.classList.toggle(cName);
};

//https://emerging-quality-raccoon.ngrok-free.app
//http://127.0.0.1:8000
async function getGoods() {
    let resp = await fetch('https://emerging-quality-raccoon.ngrok-free.app/getGoods', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        }
    });
    return await resp.json();
};

async function createCard(item) {
    let card = document.createElement('article');
    let cardDesc = document.createElement('div');
    card.className = "item";
    cardDesc.classList.add('cardDesc', 'hide');
    cardDesc.setAttribute('data-id', `${item.id}`);
    card.innerHTML = `
        <div class="card" data-id="${item.id}">
            <img src="${item.photos[0]}" alt="${item.title} img">
            <h3>${item.title}</h3>
            <p class="desc">${item.desc}</p>
            <p class="price">${item.price} ${item.currency}</p>
        </div>
        <button class="like" data-id="${item.id}">${icons.getElementsByClassName('like')[0].outerHTML}</button>
    `;
    cardDesc.innerHTML = `
        <button>Close</button>
        <img src="${item.photos[0]}" alt="${item.title} img">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <p>${item.price} ${item.currency}</p>
    `;
    cards.append(card);
    cardsDesc.append(cardDesc);
};

async function hideCard(card) {
    let cId = card.getAttribute('data-id');
    let cDesc = cardsDesc.querySelector(`[data-id="${cId}"]`);
    toggleClass(body, 'hide');
    if (cDesc.classList.contains('hide')) {
        toggleClass(cDesc, 'hide');
    };
    toggleClass(cards, 'blur');
    toggleClass(cardsDesc, 'hide');
};

let content = getGoods().then(async (result) => {
    for await (let item of result) {
        await createCard(item)
    };
    for await (let card of cards.getElementsByClassName('card')) {
        card.addEventListener('click', async (e) => {
            if (history.state == null) {
                history.pushState({'state':card.getAttribute('data-id')}, null, `${card.getAttribute('data-id')}`);
            } else if (history.state.state != card.getAttribute('data-id')) {
                history.replaceState({'state':card.getAttribute('data-id')}, null, `${card.getAttribute('data-id')}`);
            };
            await hideCard(card);
            e.preventDefault();
        })
    };
    for await (let like of cards.querySelectorAll('button.like')) {
        like.addEventListener('click', async (e) => {
            like.classList.toggle('active');
            if (like.classList.contains('active')) {
                console.log(like.getAttribute('data-id'));
            } else {
                console.log('removed');
            };
            e.preventDefault();
        })
    };
    for await (let card of cardsDesc.getElementsByClassName('cardDesc')) {
        card.getElementsByTagName('button')[0].addEventListener('click', async (e) => {
            if (history.state) {
                history.back();
            };
            e.preventDefault();
        })
    };
});