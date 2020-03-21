// данные пользователя
class UserInfo {
  constructor(container, form, api) {
    this.container = container;
    this.form = form;
    this.api = api;
    this.avatar = null;
    this.name = null;
    this.job = null;
    this.ownerId = null;
  }

  // начальная установка данных профиля
  initialize() {
    this.api.getProfile()
      .then(res => {
        this.ownerId = res._id;
        this.name = res.name;
        this.about = res.about;
        this.avatar = res.avatar;
        this.updateUserInfo();
      })
      .catch(err => console.log(err));
  }

  // обновление значение экземпляра класса
  setUserInfo({ name = this.name, about = this.about, avatar = this.avatar }, { formElement = this.form }) {
    // для редактирования профиля
    if (formElement.name === 'edit') {
      formElement.querySelector('.popup__button').textContent = 'Загрузка...';
      this.api.setProfileEdit(name, about)
        .then(res => {
          this.name = res.name;
          this.about = res.about;
          this.updateUserInfo();
          formElement.closest('.popup_type_edit-unfo').classList.remove('popup_is-opened');
          formElement.reset();
        })
        .catch(err => console.log(err))
        .finally(() => formElement.querySelector('.popup__button').textContent = 'Сохранить');
    }
    // для редактирования аватара
    if (formElement.name === 'avatar') {
      formElement.querySelector('.popup__button').textContent = 'Загрузка...'
      this.api.setAvatarEdit(avatar)
        .then(res => {
          this.avatar = res.avatar;
          this.updateUserInfo();
          formElement.closest('.popup_type_edit-avatar').classList.remove('popup_is-opened');
          formElement.querySelector('.popup__button').classList.remove('popup__button_active');
          formElement.reset();
        })
        .catch(err => console.log(err))
        .finally(() => formElement.querySelector('.popup__button').textContent = 'Сохранить');
    }
  }

  // отображение данных на странице
  updateUserInfo() {
    this.container.querySelector('.user-info__name').textContent = this.name;
    this.container.querySelector('.user-info__job').textContent = this.about;
    this.container.querySelector('.user-info__photo').style.backgroundImage = `url(${this.avatar})`;
    // сохранение личного идентификатора в дата-атрибуте .user-info
    this.container.dataset.ownerId = this.ownerId;
    // запись начальных значений в input редактирования профиля
    if (this.form.name === 'edit') {
      this.form.elements.nameAuthor.value = this.name;
      this.form.elements.aboutMe.value = this.about;
    }
  }
}
