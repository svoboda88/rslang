export class UI {
    mainPage: HTMLElement | null;

    textbookPage: HTMLElement | null;

    dictPage: HTMLElement | null;

    gamesPage: HTMLElement | null;

    statsPage: HTMLElement | null;

    logo: HTMLElement | null;

    mainPageBtn: HTMLElement | null;

    dictPageBtn: HTMLElement | null;

    gamesPageBtn: HTMLElement | null;

    statsPageBtn: HTMLElement | null;

    textbookSections: HTMLElement | null;

    modal: HTMLElement | null;

    modalGame: HTMLElement | null;

    loginBtn: HTMLElement | null;

    signupBtn: HTMLElement | null;

    constructor() {
        this.mainPage = document.getElementById('main-page');
        this.textbookPage = document.getElementById('textbook-page');
        this.dictPage = document.getElementById('dictionary-page');
        this.gamesPage = document.getElementById('games-page');
        this.statsPage = document.getElementById('stats-page');
        this.textbookSections = document.querySelector<HTMLElement>('.textbook__sections');

        this.logo = document.querySelector('.header__logo');
        this.mainPageBtn = document.getElementById('main-btn');
        this.dictPageBtn = document.getElementById('dictionary-btn');
        this.gamesPageBtn = document.getElementById('games-btn');
        this.statsPageBtn = document.getElementById('stats-btn');

        this.modal = document.querySelector<HTMLElement>('.modal');
        this.modalGame = document.querySelector<HTMLElement>('.game__modal');
        this.loginBtn = document.getElementById('login-btn');
        this.signupBtn = document.getElementById('signup-btn');
    }

    init() {
        this.checkIfLogged();
        this.listenLogo();
        this.listenMainPageBtn();
        this.listenGamesBtn();
        this.listenStatsBtn();
        this.listenLogin();
        this.listenSignup();
        this.listenModalClosure();
        this.listenCurrentPage();
    }

    checkIfLogged() {
        const isLogged = localStorage.getItem('Logged');
        if (isLogged !== 'logged') {
            this.hideAuthorizedSections();
        } else {
            this.showAuthorizedSections();
        }
    }

    showAuthorizedSections() {
        const textbookSections = document.querySelector<HTMLElement>('.textbook__sections');
        const wordBtns = document.querySelectorAll('.word__btns');
        const wordGames = document.querySelectorAll('.word__games');
        const hardLvlBtn = document.getElementById('hard-lvl');
        const gamesBtns = document.querySelector('.textbook__games');
        const statisticsBtn = document.getElementById('stats-btn');

        if (textbookSections && wordBtns && wordGames && hardLvlBtn && gamesBtns && statisticsBtn) {
            textbookSections.classList.remove('hidden');
            wordBtns.forEach((card) => card.classList.remove('hidden'));
            wordGames.forEach((card) => card.classList.remove('hidden'));
            hardLvlBtn.classList.remove('hidden');
            statisticsBtn.classList.remove('hidden');
        }
    }

    hideAuthorizedSections() {
        const textbookSections = document.querySelector<HTMLElement>('.textbook__sections');
        const wordBtns = document.querySelectorAll('.word__btns');
        const wordGames = document.querySelectorAll('.word__games');
        const hardLvlBtn = document.getElementById('hard-lvl');
        const gamesBtns = document.querySelector('.textbook__games');
        const textbookWords = document.querySelector('.textbook__words');
        const statisticsBtn = document.getElementById('stats-btn');

        if (textbookSections && wordBtns && wordGames && hardLvlBtn && gamesBtns && textbookWords && statisticsBtn) {
            textbookSections.classList.add('hidden');
            wordBtns.forEach((card) => card.classList.add('hidden'));
            wordGames.forEach((card) => card.classList.add('hidden'));
            hardLvlBtn.classList.add('hidden');
            textbookWords.classList.remove('textbook-learned');
            statisticsBtn.classList.add('hidden');
        }
    }

    listenLogo() {
        if (this.logo) {
            this.logo.addEventListener('click', () => {
                if (this.mainPage && this.mainPageBtn) {
                    this.showPage(this.mainPage, this.mainPageBtn);
                }
            });
        }
    }

    listenMainPageBtn() {
        if (this.mainPageBtn) {
            this.mainPageBtn.addEventListener('click', () => {
                if (this.mainPage && this.mainPageBtn) {
                    this.showPage(this.mainPage, this.mainPageBtn);
                }
            });
        }
    }

    listenGamesBtn() {
        if (this.gamesPageBtn) {
            this.gamesPageBtn.addEventListener('click', () => {
                if (this.gamesPage && this.gamesPageBtn) {
                    this.showPage(this.gamesPage, this.gamesPageBtn);
                }
            });
        }
    }

    listenStatsBtn() {
        if (this.statsPageBtn) {
            this.statsPageBtn.addEventListener('click', () => {
                if (this.statsPage && this.statsPageBtn) {
                    this.showPage(this.statsPage, this.statsPageBtn);
                }
            });
        }
    }

    listenLogin() {
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => {
                window.localStorage.removeItem('modal');
                window.localStorage.setItem('modal', 'login');
                this.showModal('login');
            });
        }
    }

    listenSignup() {
        if (this.signupBtn) {
            this.signupBtn.addEventListener('click', () => {
                window.localStorage.removeItem('modal');
                window.localStorage.setItem('modal', 'signup');
                this.showModal('signup');
            });
        }
    }

    showPage(page: HTMLElement, pageBtn?: HTMLElement) {
        const pagesArray = document.querySelectorAll('.page');
        const navBtsArray = document.querySelectorAll('.nav__btn');

        pagesArray.forEach((page) => page.classList.add('hidden'));
        navBtsArray.forEach((btn) => {
            if (btn.classList.contains('nav__btn--active')) {
                btn.classList.remove('nav__btn--active');
            }
        });
        page.classList.remove('hidden');
        pageBtn?.classList.add('nav__btn--active');
        if (page === this.textbookPage) {
            this.listenScrollBtn();
            this.listenTextbookScroll();
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
        const modal = document.getElementById('modal');

        if (crossBtn) {
            crossBtn.addEventListener('click', this.closeModal);
        }

        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target instanceof HTMLElement && event.target.classList.contains('modal')) {
                    this.closeModal();
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            window.localStorage.removeItem('modal');
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

    listenScrollBtn() {
        const scrollBtn = document.querySelector<HTMLElement>('.scroll-btn');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                if (scrollBtn.classList.contains('btn-down')) {
                    window.scrollTo(0, document.body.scrollHeight);
                } else if (scrollBtn.classList.contains('btn-up')) {
                    window.scrollTo(document.body.scrollHeight, 0);
                }
            });
        }
    }

    listenTextbookScroll() {
        const scrollBtn = document.querySelector<HTMLElement>('.scroll-btn');

        window.onscroll = function () {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && scrollBtn) {
                scrollBtn.classList.remove('btn-down');
                scrollBtn.classList.add('btn-up');
                scrollBtn.style.bottom = '100px';
                scrollBtn.innerHTML = `
                <span class="material-symbols-outlined">
                arrow_upward
                </span>
              `;
            } else if (document.body.scrollTop === 0 && scrollBtn) {
                scrollBtn.classList.add('btn-down');
                scrollBtn.classList.remove('btn-up');
                scrollBtn.style.bottom = '20px';
                scrollBtn.innerHTML = `
                <span class="material-symbols-outlined">
                arrow_downward
                </span>
              `;
            }
        };
    }
    listenCurrentPage() {
        window.addEventListener('load', () => {
            if (window.localStorage.getItem('CurrentPage') === 'textbook') {
                this.showPage(this.textbookPage as HTMLElement, this.dictPageBtn as HTMLElement);
                document.querySelector('#textbook-btn')?.classList.add('nav__btn--active');
            }
            if (window.localStorage.getItem('CurrentPage') === 'games') {
                this.showPage(this.gamesPage as HTMLElement, this.gamesPageBtn as HTMLElement);
                document.querySelector('#games-btn')?.classList.add('nav__btn--active');
            }
            if (window.localStorage.getItem('CurrentPage') === 'statistics') {
                this.showPage(this.statsPage as HTMLElement, this.statsPageBtn as HTMLElement);
                document.querySelector('#stats-btn')?.classList.add('nav__btn--active');
            }
            if (window.localStorage.getItem('CurrentPage') === 'main') {
                this.showPage(this.mainPage as HTMLElement, this.mainPageBtn as HTMLElement);
                document.querySelector('#main-btn')?.classList.add('nav__btn--active');
            }
            if (window.localStorage.getItem('modal') === 'login') {
                this.showModal('login');
            }
            if (window.localStorage.getItem('modal') === 'signup') {
                this.showModal('signup');
            }
        });
    }
}
