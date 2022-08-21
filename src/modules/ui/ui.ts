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
        const modalTextLogin = document.querySelector<HTMLElement>('.modal__text--login');
        const modalTextSignup = document.querySelector<HTMLElement>('.modal__text--signup');
        if (modalTextLogin && modalTextSignup) {
            if (string === 'login') {
                modalTextLogin.classList.remove('hidden');
                modalTextSignup.classList.add('hidden');
                this.listenSignupSpan();
            } else if (string === 'signup') {
                modalTextLogin.classList.add('hidden');
                modalTextSignup.classList.remove('hidden');
                this.listenLoginSpan();
            }
        }
    }
}
