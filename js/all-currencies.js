'use strict';

const API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

const status = document.querySelector('.status');
const currenciesList = document.querySelector('.currencies-list');
const btnClearFavorites = document.querySelector('.clear-favorites');

let request = new XMLHttpRequest();
request.open('GET', API_URL);
request.send();
request.addEventListener('load', () => {

    console.log(request.status);
    if (request.status >= 400 && request.status <= 499 ) {
        status.innerText = 'На сайте произошла ошибка. Повторите попытку позже.';
    } else if (request.status >= 500 && request.status <= 599) {
        status.innerText = 'На сервере произошла ошибка. Повторите попытку позже.';
    } else if (request.status < 200 || request > 299) {
        status.innerText = 'Произошла ошибка. Повторите попытку позже.';
    } else {

        // Преобразование строки в объект
        const objectResponse = JSON.parse(request.response);

        // Получение сохраненных валют
        const favoriteCurrencies = Object.keys(localStorage);

        // Создание списка всех полученных валют
        Object.keys(objectResponse.Valute).forEach(item => {
            if (favoriteCurrencies.indexOf(objectResponse.Valute[item].CharCode) > -1) {
                let newSpan = document.createElement('span');
                newSpan.setAttribute('data-code', objectResponse.Valute[item].CharCode);
                newSpan.setAttribute('title', 'Удалить из избранного');
                newSpan.setAttribute('class', 'remove-favorite');
                newSpan.innerHTML = '&#9829;';
                let newLi = document.createElement('li');
                newLi.setAttribute('class', 'item-currency');
                newLi.setAttribute('id', objectResponse.Valute[item].CharCode);
                newLi.append(newSpan);
                newLi.append(` ${objectResponse.Valute[item].Nominal} ${objectResponse.Valute[item].Name} = ${(objectResponse.Valute[item].Value).toFixed(2)} руб.`);
                currenciesList.prepend(newLi);
            } else {
                let newSpan = document.createElement('span');
                newSpan.setAttribute('data-code', objectResponse.Valute[item].CharCode);
                newSpan.setAttribute('title', 'Добавить в избранное');
                newSpan.setAttribute('class', 'add-favorite');
                newSpan.innerHTML = '&#9825;';
                let newLi = document.createElement('li');
                newLi.setAttribute('class', 'item-currency');
                newLi.setAttribute('id', objectResponse.Valute[item].CharCode);
                newLi.append(newSpan);
                newLi.append(` ${objectResponse.Valute[item].Nominal} ${objectResponse.Valute[item].Name} = ${(objectResponse.Valute[item].Value).toFixed(2)} руб.`);
                currenciesList.append(newLi);
            }
        });

        // Сохранение и удаление из избранного
        currenciesList.addEventListener('click', event => {
            let tagLi = event.target.parentNode;
            if (event.target.className === 'add-favorite') {
                localStorage.setItem(event.target.getAttribute('data-code'), 'true');
                currenciesList.prepend(tagLi);
                event.target.innerHTML = '&#9829;';
                event.target.classList = 'remove-favorite';
                event.target.setAttribute('title', 'Удалить из избранного');
            } else if (event.target.className === 'remove-favorite') {
                currenciesList.append(tagLi);
                localStorage.removeItem(event.target.getAttribute('data-code'));
                event.target.innerHTML = '&#9825;';
                event.target.classList = 'add-favorite';
                event.target.setAttribute('title', 'Добавить в избранное');
            }
        });

    }

});

btnClearFavorites.addEventListener('click', () => {
    if (localStorage.length === 0) {
        alert('Ничего не добавлено в избранное');
    } else {
        localStorage.clear();
        location.reload();
    }
});

// add comment for second commit