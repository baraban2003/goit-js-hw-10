import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputData: document.querySelector('input#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { inputData, list, countryInfo } = refs;

inputData.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const inputForSearch = e.target.value.trim();
  if (inputForSearch === '') {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  } else {
    return fetchCountries(inputForSearch)
      .then(countries => renderCountries(countries))
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}
function renderCountries(countries) {
  //Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление
  if (countries.length > 10) {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    return Notify.info('Too many matches found. Please enter a more specific name.');
  }
  //Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран
  if (countries.length > 1) {
    const markup = countries
      .map(({ name, flags }) => {
        return `<li style="font-size: 20px; display: flex; align-items: center; "><img style = "padding-right: 5px" src="${flags.svg}" width="40" /> ${name}</li>`; /* name, capital, population, flags.svg, languages; */
      })
      .join('');
    list.innerHTML = markup;
    countryInfo.innerHTML = '';
  }
  if (countries.length === 1) {
    const markupList = countries
      .map(({ name, flags }) => {
        return `<li style="font-size: 30px; font-weight: 700; display: flex-end; align-items: center; margin-bottom: 10px">
        <img style = "padding-right: 5px" src="${flags.svg}" width="40" /> ${name}</li>
        `;
      })
      .join('');
    const markupDivInfo = countries
      .map(({ capital, population, languages }) => {
        return `<p style="font-size: 20px; font-weight: 700 "> Capital: <span style="font-weight: 400 ">${capital}</span></p>
        <p style="font-size: 20px; font-weight: 700 "> Population: <span style="font-weight: 400 ">${population}</span></p>
        <p style="font-size: 20px; font-weight: 700 "> Languages: <span style="font-weight: 400 ">${languages[0].name}</span></p>`;
      })
      .join('');
    list.innerHTML = markupList;
    countryInfo.innerHTML = markupDivInfo;
  }
}
