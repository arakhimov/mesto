// валидация полей формы
class FormValidator {
  constructor(wordTemplate) {
    this.wordTemplate = wordTemplate;
  }
  // проверка валидности тестового поля
  checkInputValidity(elementInput) {
    const errorElem = elementInput.nextElementSibling;
    // функция для проверки ссылки
    function linkCheked() {
      const regExp = /^https:\/\/[\w/.\-~:?#@[\]%&!$()+,;*=]*$/;
      if (!regExp.test(elementInput.value)) {
        errorElem.textContent = this.wordTemplate.link;
        errorElem.classList.add('active');
        return false;
      }
      errorElem.textContent = '';
      errorElem.classList.remove('active');
      return true;
    }

    // проверка обязательное поле
    if (elementInput.value.length < 1) {
      errorElem.textContent = this.wordTemplate.necessaryField;
      errorElem.classList.add('active');
      return false;
    }
    // проверка на валидную ссылку
    if (elementInput.name === 'link' || elementInput.name === 'linkAvatar') {
      return linkCheked.call(this);
    }
    // проверка, что длина не менее 2 символов
    if (elementInput.validity.tooShort) {
      errorElem.textContent = this.wordTemplate.validationLength;
      errorElem.classList.add('active');
      return false;
    }
    // проверка, что длина не более 30 символов
    if (elementInput.validity.tooLong) {
      errorElem.textContent = this.wordTemplate.validationLength;
      errorElem.classList.add('active');
      return false;
    }

    errorElem.textContent = '';
    errorElem.classList.remove('active');
    return true;
  }
  // функция проверяет значение обоих текстовых полей и делает активной кнопку отправки формы
  setSubmitButtonState(elementForm) {
    this.form = elementForm;
    this.form.querySelector('.popup__button').classList.remove('popup__button_active');
    const flags = {};
    const inputArray = Array.from(this.form.elements).filter(elem => elem.type === 'text');
    for (const element of inputArray) {
      flags[element.name] = this.checkInputValidity(element);
    }
    if (Object.values(flags).every(elem => elem === true)) {
      this.form.querySelector('.popup__button').classList.add('popup__button_active');
      return;
    }
  }
}