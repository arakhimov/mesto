//карточка
const placesList = document.querySelector('.places-list');
const deleteButton = document.querySelector('.place-card__delete-icon');
// форма для создания карточек
const form = document.forms.new;
const nameCard = form.elements.name;
const nameLink = form.elements.link;
// форма редактирования информации о себе
const formEdit = document.forms.edit;
const nameEdit = formEdit.elements.name;
const aboutMeEdit = formEdit.elements.aboutMe;
// текстовые шаблоны
const wordTemplate = {
  necessaryField: 'Обязательное поле',
  validationLength: 'Должно быть от 2 до 30 символов',
  link: 'Должна быть ссылка'
};
// меню добавления карточек
const popup = document.querySelector('.popup_type_add-card');
const buttonAdd = document.querySelector('.user-info__button');
// создание карточки
const regExp = /^https:\/\/[\w/.\-~:?#@[\]%&!$()+,;*]+?\.[a-z]{3,4}$/;
const addButtonSubmit = document.querySelector('.popup_type_add-card .popup__button');
let nameCardState = false;
let nameLinkState = false;
// меню редактирования профиля
const menuEditOpen = document.querySelector('.user-info__edit');
const popupEdit = document.querySelector('.popup_type_edit-unfo');
const menuEditClose = document.querySelector('.popup_type_edit-unfo .popup__close');
const menuEditSubmit = document.querySelector('.popup_type_edit-unfo .popup__button');
let nameEditState = false;
let aboutMeState = false;
// открытие картинки в popup создания карточки
const popupTitle = document.querySelector('.popup_type_add-card .popup__title');
const popupContent = document.querySelector('.popup_type_add-card .popup__content');
const popupImage = document.createElement('img');


// создание шаблона со значениями полей из input 
function getTemplate(place) {
  return `<div class="place-card"> 
    <div class="place-card__image" style="background-image: url(${place.link})"> 
      <button class="place-card__delete-icon"></button>
    </div>
    <div class="place-card__description">
      <h3 class="place-card__name">${place.name}</h3>
      <button class="place-card__like-icon"></button>
    </div>
  </div>`;
}


// начальная инициализация - создаем 10 исходных карточек
function addListCard(container, initialCards) {
  for (const place of initialCards) {
    container.innerHTML += getTemplate(place);
  }
}
addListCard(placesList, initialCards);


// закрытие меню добавления карточки при нажатии на x
function menuClosed(event) {
  if ((event.target.classList.contains('popup__close')) || (event.key === 'Escape')) {
    popup.classList.remove('popup_is-opened');
    if (popupContent.classList.contains('popup__content_image-fullscreen')) {
      popupContent.removeChild(popupImage);
      popupContent.classList.remove('popup__content_image-fullscreen');
      popupTitle.classList.remove('popup__title_is-hidden');
      form.classList.remove('popup__form_is-hidden');
    }
  }
}


//отметка нравится
function markLike(event) {
  if (event.target.classList.contains('place-card__like-icon')) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }
}


// создание картотчки
// функция проверки валидности введенных значений формы
function checkInputValidity(inputElem, errorElem) {
  if (inputElem.value.length < 1) {
    errorElem.textContent = wordTemplate.necessaryField;
    errorElem.classList.add('active');
    return false;
  }
  if ((inputElem.value.length < 2) || (inputElem.value.length > 30)) {
    errorElem.textContent = wordTemplate.validationLength;
    errorElem.classList.add('active');
    return false;
  }
  errorElem.textContent = '';
  errorElem.classList.remove('active');
  return true;
}

// функция проверки валидности введенных значений ссылки
function checkInputValidityLink(inputElem, errorElem) {
  if (inputElem.value.length < 1) {
    errorElem.textContent = wordTemplate.necessaryField;
    errorElem.classList.add('active');
    return false;
  }
  if (!regExp.test(inputElem.value)) {
    errorElem.textContent = wordTemplate.link;
    errorElem.classList.add('active');
    return false;
  }
  errorElem.textContent = '';
  errorElem.classList.remove('active');
  return true;
}

// функция проверяет значение обоих текстовых полей и делает активной кнопку отправки формы
function setSubmitButtonState() {
  addButtonSubmit.classList.remove('popup__button_active');
  nameCardState = checkInputValidity(nameCard, nameCard.nextElementSibling);
  nameLinkState = checkInputValidityLink(nameLink, nameLink.nextElementSibling);
  // 1 здесь нужны скобки
  // 2 нет необходимости в else, достаточно return сделать
  if (nameCardState && nameLinkState) {
    addButtonSubmit.classList.add('popup__button_active');
    return;
  } 
}

// создание карточки из шаблона template
function createCards(event) {
  const place = { name: nameCard.value, link: nameLink.value };
  event.preventDefault();
  if (addButtonSubmit.classList.contains('popup__button_active')) {
    placesList.insertAdjacentHTML('beforeend', getTemplate(place));
    form.reset();
    popup.classList.remove('popup_is-opened');
    addButtonSubmit.classList.remove('popup__button_active');
  }
}


// удаление карточки - ищем предка через closest и передаем его в removeChild
function deleteCards(event) {
  if (event.target.classList.contains('place-card__delete-icon')) {
    placesList.removeChild(event.target.closest('.place-card'));
  }
}


// закрытие меню редактироввания профиля при нажатии на х или нажатии Esc
function closeMenuEdit(event) {
  if ((event.target.classList.contains('popup__close')) || (event.key === 'Escape')) {
    popupEdit.classList.remove('popup_is-opened');
  }
}


// редактирование имени и информации о себе на странице после сохранения данных формы
// функция проверяет значение обоих текстовых полей и делает активной кнопку отправки формы
function setSubmitButtonEditState() {
  menuEditSubmit.classList.remove('popup__button_active');
  nameEditState = checkInputValidity(nameEdit, nameEdit.nextElementSibling);
  aboutMeState = checkInputValidity(aboutMeEdit, aboutMeEdit.nextElementSibling);
  /* Можно лучше: удалите else а внутри условия добавьте return
   например было: 
   if(условие){  
     // ваш код 
   } else if(условие2){ 
     // ваш код 
   } 
   стало : 
   if(условие){  
       // ваш код 
    return; 
  } 
 
   if(условие2){ 
    // ваш код 
    return; 
  } 
 
*/
  if (nameEditState && aboutMeState) {
    menuEditSubmit.classList.add('popup__button_active');
    return;
  } 
}


// открытие меню редактирования профиля при нажатии на Edit
function openMenuEdit() {
  nameEdit.value = document.querySelector('.user-info__name').textContent;
  aboutMeEdit.value = document.querySelector('.user-info__job').textContent;
  popupEdit.classList.add('popup_is-opened');
  setSubmitButtonEditState();
}


//функция записывает значение имени и информации в профиле
function writeProfile(event) {
  event.preventDefault();
  if (nameEdit.parentElement.lastElementChild.classList.contains('popup__button_active')) {
    document.querySelector('.user-info__name').textContent = nameEdit.value;
    document.querySelector('.user-info__job').textContent = aboutMeEdit.value;
    popupEdit.classList.remove('popup_is-opened');
  }
}


// открытие картинки в popup по клику по ней
function imageFullScreen(event) {
  if (event.target.classList.contains('place-card__image')) {
    popup.classList.add('popup_is-opened');
    popupContent.classList.add('popup__content_image-fullscreen');
    popupTitle.classList.add('popup__title_is-hidden');
    form.classList.add('popup__form_is-hidden');
    popupContent.appendChild(popupImage);
    popupImage.classList.add('popup__open-image');
    popupImage.src = event.target.style.backgroundImage.match(/(?<=['"]).+?jpg/);
    popupImage.alt = '';
  }
}


// закрытие меню добавления карточки при нажатии на x или клавишу ESC
document.addEventListener('click', menuClosed);
document.addEventListener('keydown', menuClosed);
// открытие меню добавления карточки при нажатии на +
buttonAdd.addEventListener('click', () => popup.classList.add('popup_is-opened'));
//отметка нравится
document.addEventListener('click', markLike);
// проверка валидности обоих текстовых полей формы создания карточек
form.addEventListener('input', setSubmitButtonState);
// создание карточки
form.addEventListener('submit', createCards);
// удаление карточки
document.addEventListener('click', deleteCards);
// открытие меню редактирования профиля при нажатии на Edit
menuEditOpen.addEventListener('click', openMenuEdit);
// закрытие меню редактироввания профиля при нажатии на х или нажатии Esc
document.addEventListener('click', closeMenuEdit);
document.addEventListener('keydown', closeMenuEdit);
// проверка валидности обоих текстовых полей формы редактирования информации о себе
formEdit.addEventListener('input', setSubmitButtonEditState);
// запись значения имени и информации о себе в профиль
formEdit.addEventListener('submit', writeProfile);
// открытие картинки в popup по клику по ней
placesList.addEventListener('click', imageFullScreen);

/**
* Здравствуйте.
* --------------------------------------------------------------------
* Код чистый и хорошо читается
* Вы используете логические группировки операций
*  Вы используете делегирование
* --------------------------------------------------------------------
* Все проблемы в коде были помечены как нужно исправить
*
* Так же надо исправить ошибку в редактировании профиля
*В форме редактировать профиль должна работать лайв-валидация и должны показываться красные ошибки под полями, если валидация не прошла.
*
* так же при редактировании профиля должны оставаться старые данные из профиля.
*
*
*
*

*/

// Здравствуйте.
// Спасибо за ваши комментарии, исправления и особенно рекоммендации. Такие код-ревью для меня особенно
// полезны.

// Исправил все пункты, указанные как "нужно исправить". Из пунктов "можно лучше" не использовал только
// метод element.setCustomValidity(), т.к. он не соответствует требуемому стилевому оформлению. Надеюсь 
// ничего не упустил.

// Обдумывал варианты создания универсальных функций для обеих форм с помощью передачи в колбек аргументов с 
// помощью замыкания, но посчитал не целесообразным. Подскажите, что более предпочтительно - делать более 
// сложные функции, но более универсальные или несколько более простых функций?

/**
 * Усложнять проще, тяжело упрощать
 *
 * Делайте простые функции, более понятные. Следуйте этому правилу и всё у вас будет хорошо
 *
 * Все функции которые в функции setEventListeners надо вынести отдельно. Так делать можно, но считается очень плохой практикой
 * так как функции нельзя переиспользовать. Так вы инкапсулируете функции без возможности переиспользования.
 *
 * Про валидацию
 // на русском https: //msiter.ru/tutorials/javascript/js_validation
 // на русском https://htmlacademy.ru/blog/useful/html/form-validation-techniques
 // на английском очень хорошая статья с примерами https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/
 //
 // как пример, если вы установите  <input type="text" min="10" max="100" >
 // то сразу сможете определить что текст слишком короткий, например так:
 //
 // if (validity.tooShort) {
 // // Значение слишком короткое
 // }
 // if (validity.tooLong) {
 // // Значение слишком длинное
 // }
 *
 *
 *
 *
 */

//  Еще раз спасибо.

/**
 * Надо исправить
 * Теперь вы два раза создаёте и используете шаблон создания карточек.
 * Первый раз при переборе карточек, второй раз в функции  getTemplate(place)
 * Достаточно при переборе карточек вызвать функцию getTemplate(place)
 *
 * Перенесите все слушатели в конеч код, в одно место. Наведите порядок в коде, тяжело читать и анализировать
 *
 * Не очень хорошая практика вешать листнер на window Так вы засоряете глобальное пространство.
 * А есть ли необходимость вешать на window слушатель ???
 *
 * переменной template в функции getTemplate(place) нет необходимости, можно сразу сделать return
 *
 *
 *
 */


//  Я хотел использовать  слушатель на window для того чтобы при первоначальной загрузке страницы если поля 
// формы редактирования профиля заполнены верно, то кнопка отправки будет активна. Сейчас я понял, что 
// если поля формы были заполнены верно, то нет и потребности в редактировании, а если неверно, тогда
// будет активен слушатель input на поля формы. Т.о. потребности в слушателе load на window нет. 
// 
// Не было полного понимания - необходимо было проверять значение текстовых полей не только при изменении
// значений текстовых полей, но и при открытии popup - чего я и пытался добиться при помощи слушателя load 
// на window.
// Теперь есть более полное понимание логики работы.
// Еще раз спасибо. Надеюсь все исправил.
