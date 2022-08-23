import { UI } from '../ui/ui';

export class Logout {
    UI: UI;
    logoutBtn: HTMLElement | null;
    loggedButtons: HTMLElement | null;
    headerLogin: HTMLElement | null;

    constructor(UI: UI) {
        this.UI = UI;
        this.logoutBtn = document.querySelector('.logout__btn');
        this.loggedButtons = document.querySelector('.header__logged');
        this.headerLogin = document.querySelector('.header__login');
    }
    goOut() {
        this.logoutBtn?.addEventListener('click', () => {
            window.localStorage.clear();
            if (!window.localStorage.getItem('Logged')) {
                this.loggedButtons?.classList.remove('header__logged-active');
                this.headerLogin?.classList.remove('header__login-disabled');
                this.UI.hideAuthorizedSections();
            }
        });
    }
}
