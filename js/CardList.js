//хранение и отрисовка карточек
class CardList {
  constructor(container, popup, popupElement) {
    this.container = container;
    // переменная и экземпляр класса для открытия картинки в развернутом виде
    this.popup = popup;
    this.popupElement = popupElement;
  }
  //добавление карточки в список
  addCard(card) {
    this.container.insertAdjacentElement('beforeend', card);
  }
  // начальная инициализация
  render(initialArray, card) {
    for (const places of initialArray) {
      this.container.insertAdjacentElement('beforeend', card.create(places));
    }
    // слушатель на открытие картинки в развернутом виде
    this.container.addEventListener('click', () => this.popupElement.imageFullScreen(this.popup, event));
  }
}