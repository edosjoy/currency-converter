'use strict';

const API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

const dateUpdate = document.querySelector('.date-update');
const inputNameCurrency = document.querySelector('.input-name-currency');
const cross = document.querySelector('.cross');
const listNameCurrencies = document.querySelector('.list-name-currencies');
const status = document.querySelector('.status');
const resultRur = document.querySelector('.result-rur');
const resultChooseCurrency = document.querySelector('.result-choose-currency');
const charCodeChooseCurrency = document.querySelector('.char-code-choose-currency');
const buttonReload = document.querySelector('.button-reload');

// Ввод в инпутах только цифр
const noChar = event => {
    event.value = event.value.replace(/\D/g, '');
}

// Очистка инпутов и обновление страницы
buttonReload.addEventListener('click', () => {
    inputNameCurrency.value = '';
    resultChooseCurrency.value = '';
    resultRur.value = '100';
    location.reload();
});

fetch(API_URL).then(response => {

    // Обработка статусов ответа сервера
    console.log(response.status); // В консоль дублирую ответ сервера, для проверки
    if (response.status >= 400 && response.status <= 499 ) {
        status.innerText = 'На сайте произошла ошибка. Повторите попытку позже.';
    } else if (response.status >= 500 && response.status <= 599) {
        status.innerText = 'На сервере произошла ошибка. Повторите попытку позже.';
    } else if (response.status < 200 || response > 299) {
        status.innerText = 'Произошла ошибка. Повторите попытку позже.';
    } else {
        return response.json();
    }

}).then(objectCurrencies => {

    // Получаю и вывожу дату обновления курса валют
    const date = new Date(objectCurrencies.Date);
    dateUpdate.innerText = `Дата обновления курса валют ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

    // Для селекта создаю список с названиями полученных валют
    Object.keys(objectCurrencies.Valute).forEach(key => {
        let newElement = document.createElement('option');
        newElement.setAttribute('value', `${objectCurrencies.Valute[key].CharCode}`);
        newElement.innerText = `${objectCurrencies.Valute[key].Name} (${objectCurrencies.Valute[key].CharCode})`;
        listNameCurrencies.append(newElement);
    });

    // Поиск валюты по вводимому тексту
    const allItemsCurrency = document.querySelectorAll('option');
    inputNameCurrency.addEventListener('keyup', event => {
        allItemsCurrency.forEach(item => {
            item.innerText.toLowerCase().includes(event.target.value.toLowerCase()) ? item.classList.remove('item-name-currency_none') : item.classList.add('item-name-currency_none');
        });
    });

    // Сброс поиска валюты по названию
    cross.addEventListener('click', () => {
        inputNameCurrency.value = '';
        allItemsCurrency.forEach(item => {
            item.classList.remove('item-name-currency_none');
        });
    });

    // После выбора валюты вывожу результат курса
    listNameCurrencies.addEventListener('click', event => {
        resultChooseCurrency.value = (resultRur.value / (objectCurrencies.Valute[event.target.value].Value / objectCurrencies.Valute[event.target.value].Nominal)).toFixed(2);
        charCodeChooseCurrency.innerText = event.target.value;

        // При изменении значения "рубли", пересчитываю результат
        resultRur.addEventListener('keyup', () => {
            resultChooseCurrency.value = (resultRur.value / (objectCurrencies.Valute[event.target.value].Value / objectCurrencies.Valute[event.target.value].Nominal)).toFixed(2);
        });

        // При изменении значения выбранной валюты, пересчитываю результат
        resultChooseCurrency.addEventListener('keyup', () => {
            resultRur.value = (resultChooseCurrency.value * (objectCurrencies.Valute[event.target.value].Value / objectCurrencies.Valute[event.target.value].Nominal)).toFixed(2);
        });
    });

});

// add comment for commit


