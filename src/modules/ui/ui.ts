export class UI {

  mainPage: HTMLElement | null;

  textbookPage: HTMLElement | null;

  logo: HTMLElement | null;

  mainPageBtn: HTMLElement | null;

  textbookPageBtn: HTMLElement | null;

  modal: HTMLElement | null;

  loginBtn: HTMLElement | null;

  signupBtn: HTMLElement | null;


  constructor() {
    this.mainPage = document.getElementById('main-page');
    this.textbookPage = document.getElementById('textbook-page');

    this.logo = document.querySelector('.header__logo');
    this.mainPageBtn = document.getElementById('main-btn');
    this.textbookPageBtn = document.getElementById('textbook-btn');

    this.modal = document.querySelector<HTMLElement>('.modal');
    this.loginBtn = document.getElementById('login-btn');
    this.signupBtn = document.getElementById('signup-btn');
  }

  init() {
    this.listenLogo();
    this.listenMainPageBtn();
    this.listenTextbookPageBtn();
    this.listenLogin();
    this.listenSignup();
    this.listenModalClosure();
  }

  listenLogo() {
    if (this.logo) {
      this.logo.addEventListener('click', () => {
        if (this.mainPage && this.textbookPage) {
          this.mainPage.classList.remove('hidden');
          this.textbookPage.classList.add('hidden');
        }
      });
    }
  }

  listenMainPageBtn() {
    if (this.mainPageBtn) {
      this.mainPageBtn.addEventListener('click', () => {
        if (this.mainPage && this.textbookPage) {
          this.mainPage.classList.remove('hidden');
          this.textbookPage.classList.add('hidden');
        }
      });
    }
  }

  listenTextbookPageBtn() {
    if (this.textbookPageBtn) {
      this.textbookPageBtn.addEventListener('click', () => {
        if (this.mainPage && this.textbookPage) {
          this.textbookPage.classList.remove('hidden');
          this.mainPage.classList.add('hidden');
        }
      });
    }
  }

  listenLogin() {
    if (this.loginBtn) {
      this.loginBtn.addEventListener('click', () => this.showModal('login'));
    }
  }

  listenSignup() {
    if (this.signupBtn) {
      this.signupBtn.addEventListener('click', () => this.showModal('signup'));
    }
  }

  listenLoginSpan() {
    const loginSpan = document.querySelector<HTMLElement>('.login-span');
    if (loginSpan) {
      loginSpan.addEventListener('click', () => this.renderModalText('login'));
    }
  }

  listenSignupSpan() {
    const loginSpan = document.querySelector<HTMLElement>('.signup-span');
    if (loginSpan) {
      loginSpan.addEventListener('click', () => this.renderModalText('signup'));
    }
  }


  listenModalClosure() {
    const crossBtn = document.querySelector<HTMLElement>('.modal__close-btn');
    if (crossBtn) {
      crossBtn.addEventListener('click', this.closeModal);
    }
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showModal(string: 'login' | 'signup') {
    if (this.modal) {
      this.renderModalText(string);
      this.modal.classList.remove('hidden');
    }
  }

  renderModalText(string: 'login' | 'signup') {
    const modalText = document.querySelector<HTMLElement>('.modal__text');
    if (modalText) {
      if (string === 'login') {
        modalText.innerHTML = `
        <h2>Уже с нами?</h2>
        <p>войди в свой аккаунт RSLang</p>
        <form id="form" class="modal__form">
          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Введите email" name="email" required>
          <label for="psw"><b>Пароль</b></label>
          <input type="password" placeholder="Введите пароль" name="psw" required>
          <button class="modal__login-btn">Войти!</button>
          <p class="modal__login">Ещё не зарегистрированы?<span class="signup-span"> Регистрация</span></p>
        `;
        this.listenSignupSpan()
      } else if (string === 'signup') {
        modalText.innerHTML = `
        <h2>Регестрируйся в RSLang</h2>
        <p>и начни своё путешествие в мир английского языка вместе с нами!</p>
        <form id="form" class="modal__form">
          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Введите email" name="email" required>
          <label for="email"><b>Имя</b></label>
          <input type="text" name="username" placeholder="Введите имя" required>
          <label for="psw"><b>Пароль</b></label>
          <input type="password" placeholder="Введите пароль" name="psw" required>
          <label for="psw"><b>Подтверждение пароля</b></label>
          <input type="password" placeholder="Введите пароль ещё раз, для проверки" name="psw2" required>
        </form>
        <div class="modal__btns">
          <input class="file-upload hidden" type="file" accept="image/*" id="avatar" />
          <label class="modal__avatar-btn" for="avatar">
            Загрузить аватар</label>
          <button class="modal__signup-btn">Зарегестрироваться!</button>
          <p class="modal__login">Уже зарегестрированы? <span class="login-span">Войти</span></p>
        </div>`;
        this.listenLoginSpan();
      }
    }
  }

}