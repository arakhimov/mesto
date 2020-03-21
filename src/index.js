import Api from '../js/Api.js';
import Card from '../js/Card.js';
import CardList from '../js/CardList.js';
import FormValidator from '../js/FormValidator.js';
import Popup from '../js/Popup.js';
import UserInfo from '../js/UserInfo.js';

import './style.css';

(function () {
    // контейнер для карточек
  const placesList = document.querySelector('.places-list');
  // форма для создания карточек
  const form = document.forms.new;
  // форма редактирования информации о себе
  const formEdit = document.forms.edit;
  // форма для создания карточек
  const formAvatar = document.forms.avatar;
  // меню добавления карточек
  const popup = document.querySelector('.popup_type_add-card');
  const buttonAdd = document.querySelector('.user-info__button');
  // меню редактирования профиля
  const popupEdit = document.querySelector('.popup_type_edit-unfo');
  const menuEditOpen = document.querySelector('.user-info__edit');
  // меню редактирования аватара
  const popupAvatar = document.querySelector('.popup_type_edit-avatar');
  const editAvatar = document.querySelector('.user-info__photo');
  // текстовые шаблоны
  const wordTemplate = {
    necessaryField: 'Обязательное поле',
    validationLength: 'Должно быть от 2 до 30 символов',
    link: 'Должна быть ссылка'
  };


  // классы
  // обмен данными с сервером
  const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort8',
    headers: {
      authorization: 'bdc62542-0425-49bb-96fc-ec4d621a5e2b',
      'Content-Type': 'application/json'
    }
  });
  // данные пользователя
  const userInfo = new UserInfo(document.querySelector('.user-info'), formEdit, api);
  // создание карточки
  const card = new Card(popup, document.querySelector('.user-info'));
  // всплывающее окно
  const popupElement = new Popup();
  // хранение и отрисовка карточек
  const cardList = new CardList(placesList, popup, popupElement);
  // валидация полей формы
  const validation = new FormValidator(wordTemplate);


  // получение данных профиля
  userInfo.initialize();

  // получение данных карточек
  api.getInitialCards()
    .then(cardArray => {
    const filteredCardArray = cardArray.filter(card => card.owner._id === 'c4428527249f042fd506f38a');    
    cardList.render(filteredCardArray, card);
    })
    // .then(cardArray => cardList.render(cardArray, card))
    .catch(err => console.log(err));


  // слушатели
  // открытие меню добавления карточки при нажатии на +
  buttonAdd.addEventListener('click', () => popupElement.open(popup));
  // открытие меню изменения аватара
  editAvatar.addEventListener('click', () => popupElement.open(popupAvatar));
  // проверка валидности обоих текстовых полей формы создания карточек
  form.addEventListener('input', () => validation.setSubmitButtonState(form));
  // проверка валидности обоих текстовых полей формы редактирования информации о себе
  formEdit.addEventListener('input', () => validation.setSubmitButtonState(formEdit));
  // проверка валидности текстового поля формы изменения аватара
  formAvatar.addEventListener('input', () => validation.setSubmitButtonState(formAvatar));

  // создание карточки
  function cardCreate(event) {
    event.preventDefault();
    const nameCard = form.elements.namePlace;
    const nameLink = form.elements.link;
    if (popup.querySelector('.popup__button').classList.contains('popup__button_active')) {
      popup.querySelector('.popup__button').textContent = 'Загрузка...';
      api.uploadCard(nameCard.value, nameLink.value)
        .then(place => {
          cardList.addCard(card.create(place));
          popup.classList.remove('popup_is-opened');
          popup.querySelector('.popup__button').classList.remove('popup__button_active');
          form.reset();
        })
        .catch(err => console.log(err))
        .finally(() => popup.querySelector('.popup__button').textContent = '+');
    }
  }
  form.addEventListener('submit', cardCreate);

  // запись значения имени и информации о себе в профиль
  function setProfile(event) {
    event.preventDefault();
    const nameEdit = formEdit.elements.nameAuthor;
    const aboutMeEdit = formEdit.elements.aboutMe;
    userInfo.setUserInfo({ name: nameEdit.value, about: aboutMeEdit.value }, {});
  }
  formEdit.addEventListener('submit', setProfile);

  // изменение аватара
  function setAvatar(event) {
    event.preventDefault();
    const linkAvatar = formAvatar.elements.linkAvatar;
    userInfo.setUserInfo({ avatar: linkAvatar.value }, { formElement: formAvatar });
  }
  formAvatar.addEventListener('submit', setAvatar);

  // открытие меню редактирования профиля
  menuEditOpen.addEventListener('click', () => {
    popupElement.open(popupEdit);
    userInfo.updateUserInfo();
    validation.setSubmitButtonState(formEdit);
  });

  // удаление созданной карточки
  document.addEventListener('click', event => {
    function deleteCard() {
      if (confirm('Вы действительно хотите удалить эту карточку?')) {
        api.deleteCard(event.target.closest('.place-card').dataset.cardId)
          .then(res => {
            if (res.ok) {
              card.remove(event);
            } 
            else {
              return Promise.reject(`Ошибка: ${res.status}`);
            }
          })
          .catch(err => console.log(err));
      }
    }
    if (event.target.classList.contains('place-card__delete-icon')) {
      deleteCard();
    }
  });

  // отметка like карточки
  function likeMarkToggle(event) {
    if (!event.target.classList.contains('place-card__like-icon_liked')) {
      api.setLikeMark(event.target.closest('.place-card').dataset.cardId)
        .then(res => {
          card.like(event);
          event.target.closest('.place-card__like-container').querySelector('.place-card__like-counter').textContent = res.likes.length;
        })
        .catch(err => console.log(err));
    } else {
      api.deleteLikeMark(event.target.closest('.place-card').dataset.cardId)
        .then(res => {
          card.like(event);
          event.target.closest('.place-card__like-container').querySelector('.place-card__like-counter').textContent = res.likes.length;
        })
        .catch(err => console.log(err));
    }
  }
  placesList.addEventListener('click', event => {
    if (event.target.classList.contains('place-card__like-icon')) {
      likeMarkToggle(event);
    }
  });
}());




