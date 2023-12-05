//let tg = window.Telegram.WebApp;
const cards = document.getElementById('cards');
const cardsDesc = document.getElementById('cardsDesc');
const body = document.getElementsByTagName('body')[0];


cardsDesc.addEventListener('transitionend', () => {
    if (cardsDesc.classList.contains('hide')) {
        for (let cDesc of cardsDesc.getElementsByClassName('cardDesc')) {
            if (!cDesc.classList.contains('hide')) {
                toggleClass(cDesc, 'hide')
            }
        }
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
    }
});


function toggleClass(elem, cName) {
    elem.classList.toggle(cName);
};


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
    let card = document.createElement('div');
    let cardDesc = document.createElement('div');
    card.className = "card";
    cardDesc.classList.add('cardDesc', 'hide');
    card.setAttribute('data-id', `${item.id}`);
    cardDesc.setAttribute('data-id', `${item.id}`);
    card.innerHTML = `
        <img src="${item.photos[0]}" alt="${item.title} img">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <p>${item.price} ${item.currency}</p>
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
    let c = document.getElementsByClassName('card');
    let cDesc = document.getElementsByClassName('cardDesc');
    for await (let card of c) {
        card.addEventListener('click', async (e) => {
            await hideCard(card);
            e.preventDefault();
        })
    };
    for await (let card of cDesc) {
        card.getElementsByTagName('button')[0].addEventListener('click', async (e) => {
            await hideCard(card);
            e.preventDefault();
        })
    };
});
