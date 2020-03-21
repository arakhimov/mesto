// создание карточек
class Card {
  constructor(elementPopup, userInfoWrapper) {
    this.popup = elementPopup;
    this.userInfoWrapper = userInfoWrapper;
  }

  // отметка нравится
  like(event) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }

  // удаление карточки
  remove(event) {
    const deletedCard = event.target.closest('.place-card');
    deletedCard.parentElement.removeChild(deletedCard);
  }

  // создание шаблона со значениями полей из input
  getTemplate(place) {
    return `<div class="place-card">
              <div class="place-card__image" style="background-image: url(${place.link})">
                <button class="place-card__delete-icon"></button>
              </div>
              <div class="place-card__description">
                <h3 class="place-card__name">${place.name}</h3>
                <div class="place-card__like-container">
                  <button class="place-card__like-icon"></button>
                  <p class="place-card__like-counter">${place.likes.length}</p>
                </div>
              </div>
            </div>`;
  }

  // создание карточки
  create(place) {
    const cardContainer = document.createElement('div');
    cardContainer.insertAdjacentHTML('beforeend', this.getTemplate(place));
    this.card = cardContainer.firstElementChild;
    // сохранение идентификатора карточки в data-атрибуте
    this.card.dataset.cardId = place._id;
    // добавление отметки удалить для созданных карточек
    if (place.owner._id === this.userInfoWrapper.dataset.ownerId) {
      this.card.querySelector('.place-card__delete-icon').classList.add('place-card__delete-icon_active');
    }
    // проверяем, если в массиве лайков есть лайк текущего пользователя, то ставим отметку like при создании карточки
    if (place.likes.find(elem => elem._id === this.userInfoWrapper.dataset.ownerId)) {
      this.card.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
    }
    return this.card;
  }
}
