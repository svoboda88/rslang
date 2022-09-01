class ListenPages {
    mainButton: HTMLElement | null;
    textbookButton: HTMLElement | null;
    gamesButton: HTMLElement | null;
    statisticsButton: HTMLElement | null;
    headerLogo: HTMLElement | null;
    loginButton: HTMLElement | null;
    signUpButton: HTMLElement | null;

    constructor() {
        this.mainButton = document.querySelector('#main-btn');
        this.textbookButton = document.querySelector('#textbook-btn');
        this.gamesButton = document.querySelector('#games-btn');
        this.statisticsButton = document.querySelector('#stats-btn');
        this.headerLogo = document.querySelector('.header__logo');
        this.loginButton = document.querySelector('#login-btn');
        this.signUpButton = document.querySelector('#signup-btn');
    }
    listen() {
        window.addEventListener('click', (e) => {
            if (e.target === this.textbookButton) {
                window.localStorage.removeItem('CurrentPage');
                window.localStorage.setItem('CurrentPage', 'textbook');
            } else if (e.target === this.gamesButton) {
                window.localStorage.removeItem('CurrentPage');
                window.localStorage.setItem('CurrentPage', 'games');
            } else if (e.target === this.statisticsButton) {
                window.localStorage.removeItem('CurrentPage');
                window.localStorage.setItem('CurrentPage', 'statistics');
            } else if (e.target === this.mainButton || e.target === this.headerLogo) {
                window.localStorage.removeItem('CurrentPage');
                window.localStorage.setItem('CurrentPage', 'main');
            }
        });
    }
}

export const listenPages = new ListenPages();
