let tg = window.Telegram.WebApp;

let p = document.getElementById('p');
let api = document.getElementById('api');
let pop = document.getElementById('pop');
let data = document.getElementById('data');
let switch_button = document.getElementById('siq');


switch_button.addEventListener('click', () => {
    p.innerHTML = '1';
    tg.switchInlineQuery('123')
});
pop.addEventListener('click', () => {
    p.innerHTML = tg.version;
    init = tg.initDataUnsafe;
    data.innerHTML = init.query_id;
});
api.addEventListener('click', async () => {
    try {
        let call = await fetch('https://emerging-quality-raccoon.ngrok-free.app/initData', {
            method: 'GET',
        });
        let result = await call.json();
        data.innerHTML = result;
    } catch(error) {
        data.innerHTML = error;
    }
});
