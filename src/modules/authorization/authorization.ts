import { UI } from '../ui/ui';

export class Authorize {
    UI: UI;
    userInfo: string | null;
    loginEmail: HTMLInputElement | null;
    loginPassword: HTMLInputElement | null;
    signInButton: HTMLElement | null;
    incorrectDataWarning: HTMLElement | null;
    modalWindow: HTMLElement | null;
    loggedButtons: HTMLElement | null;
    headerLogin: HTMLElement | null;
    usernameBtn: HTMLElement | null;

    constructor(UI: UI) {
        this.UI = UI;
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo') as string);
        this.loginEmail = document.querySelector('.login-email');
        this.loginPassword = document.querySelector('.login-password');
        this.signInButton = document.querySelector('.modal__login-btn');
        this.incorrectDataWarning = document.querySelector('.correct-data_validation');
        this.modalWindow = document.querySelector('.modal');
        this.loggedButtons = document.querySelector('.header__logged');
        this.headerLogin = document.querySelector('.header__login');
        this.usernameBtn = document.querySelector('.username__btn');
    }
    signIn() {
        const listener = (e: Event): void => {
            const userData = {
                email: (this.loginEmail as HTMLInputElement).value,
                password: JSON.stringify((this.loginPassword as HTMLInputElement).value),
            };
            if (e.target === this.signInButton) {
                this.sendData(userData)
                    .then(this.getData)
                    .then(() => {
                        (this.usernameBtn as HTMLElement).textContent = JSON.parse(
                            window.localStorage.getItem('UserInfo') as string
                        ).name;
                    })
                    .then(() => {
                        window.localStorage.removeItem('modal');
                        this.UI.showAuthorizedSections();
                    });
            }
        };
        window.addEventListener('click', listener);
        window.addEventListener('load', () => {
            if (window.localStorage.getItem('Logged') === 'logged') {
                this.loggedButtons?.classList.add('header__logged-active');
                this.headerLogin?.classList.add('header__login-disabled');
                (this.usernameBtn as HTMLElement).textContent = JSON.parse(
                    window.localStorage.getItem('UserInfo') as string
                ).name;
            }
        });
    }

    async sendData(data: { email: string | null; password: string | null } | null) {
        const rawResponse = await fetch('https://react-learnwords-english.herokuapp.com/signin', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (rawResponse.ok) {
            const content = await rawResponse.json();
            window.localStorage.setItem('UserToken', JSON.stringify(content));
            this.modalWindow?.classList.add('hidden');
            this.loggedButtons?.classList.add('header__logged-active');
            this.headerLogin?.classList.add('header__login-disabled');
            window.localStorage.setItem('Logged', 'logged');
        } else {
            this.incorrectDataWarning?.classList.add('correct-data_validation-active');
            window.addEventListener('click', (e) => {
                if (e.target !== this.signInButton) {
                    this.incorrectDataWarning?.classList.remove('correct-data_validation-active');
                }
            });
        }
    }

    async getData() {
        const token = JSON.parse(window.localStorage.getItem('UserToken') as string).token;
        const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
        const rawResponse = await fetch(`https://react-learnwords-english.herokuapp.com/users/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const content = await rawResponse.json();
        window.localStorage.setItem('UserInfo', JSON.stringify(content));
        return content;
    }
}
