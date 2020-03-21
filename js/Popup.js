class Popup {
  //открытие меню
  open(elementPopup) {
    this.element = elementPopup;
    this.element.classList.add('popup_is-opened');
    this.element.querySelector('.popup__close').addEventListener('click', this.close.bind(this.element));
    document.addEventListener('keydown', this.close.bind(this.element));
  }
  // закрытие меню при нажатии на x или ESC
  close(event) {
    if ((event.type === 'keydown') && (event.key !== 'Escape')) {
      return;
    }
    // закрытие картинки, открытой в развернутом виде
    if (this.firstElementChild.classList.contains('popup__content_image-fullscreen')) {
      this.content.removeChild(this.image);
      this.content.classList.remove('popup__content_image-fullscreen');
      this.querySelector('.popup__title').classList.remove('popup__title_is-hidden');
      this.querySelector('.popup__form').classList.remove('popup__form_is-hidden');
    }
    this.classList.remove('popup_is-opened');
  }
  // открытие картинки в развернутом виде в popup
  imageFullScreen(elementPopup, event) {
    if (event.target.classList.contains('place-card__image')) {
      this.open(elementPopup);
      this.element.content = this.element.querySelector('.popup__content');
      this.element.content.classList.add('popup__content_image-fullscreen');
      this.element.image = document.createElement('img');
      this.element.content.appendChild(this.element.image);
      this.element.image.classList.add('popup__open-image');
      this.element.image.src = event.target.style.backgroundImage.match(/https:\/\/[^'"]*/);
      this.element.image.alt = '';
      this.element.querySelector('.popup__title').classList.add('popup__title_is-hidden');
      this.element.querySelector('.popup__form').classList.add('popup__form_is-hidden');
    }
  }
}