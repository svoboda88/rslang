export class UI {

  mainPage: HTMLElement | null;

  textbookPage: HTMLElement | null;

  logo: HTMLElement | null;

  mainPageBtn: HTMLElement | null;

  textbookPageBtn: HTMLElement | null;


  constructor() {
    this.mainPage = document.getElementById('main-page');
    this.textbookPage = document.getElementById('textbook-page');

    this.logo = document.querySelector('.header__logo');
    this.mainPageBtn = document.getElementById('main-btn');
    this.textbookPageBtn = document.getElementById('textbook-btn');

  }

  init() {
    this.listenLogo();
    this.listenMainPageBtn();
    this.listenTextbookPageBtn();
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

}