let tg = window.Telegram.WebApp;
let p = document.getElementById('p');
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
