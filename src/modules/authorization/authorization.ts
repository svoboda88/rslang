export class Authorize {
    userInfo: string | null;
    loginEmail: HTMLInputElement | null;
    loginPassword: HTMLInputElement | null;
    signInButton: HTMLElement | null;
    incorrectDataWarning: HTMLElement | null;
    modalWindow: HTMLElement | null;
    loggedButtons: HTMLElement | null;
    headerLogin: HTMLElement | null;

    constructor() {
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo') as string);
        this.loginEmail = document.querySelector('.login-email');
        this.loginPassword = document.querySelector('.login-password');
        this.signInButton = document.querySelector('.modal__login-btn');
        this.incorrectDataWarning = document.querySelector('.correct-data_validation');
        this.modalWindow = document.querySelector('.modal');
        this.loggedButtons = document.querySelector('.header__logged');
        this.headerLogin = document.querySelector('.header__login');
    }
    signIn() {
        const listener = (e: Event): void => {
            //  const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
            const userData = {
                email: (this.loginEmail as HTMLInputElement).value,
                password: JSON.stringify((this.loginPassword as HTMLInputElement).value),
            };
            if (e.target === this.signInButton) {
                this.sendData(userData);
                this.modalWindow?.classList.add('hidden');
                this.loggedButtons?.classList.add('header__logged-active');
                this.headerLogin?.classList.add('header__login-disabled');
                window.localStorage.setItem('Logged', 'logged');
            }
        };
        window.addEventListener('click', listener);
        window.addEventListener('load', () => {
            if (window.localStorage.getItem('Logged') === 'logged') {
                this.loggedButtons?.classList.add('header__logged-active');
                this.headerLogin?.classList.add('header__login-disabled');
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
        } else {
            this.incorrectDataWarning?.classList.add('correct-data_validation-active');
            window.addEventListener('click', (e) => {
                if (e.target !== this.signInButton) {
                    this.incorrectDataWarning?.classList.remove('correct-data_validation-active');
                }
            });
        }
    }

    /*    async getData(id: string) {
        const rawResponse = await fetch(`https://react-learnwords-english.herokuapp.com/users/{${id}}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const content = await rawResponse.json();
        console.log(content);
    } */
}
