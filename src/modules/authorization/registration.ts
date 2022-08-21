export class Register {
    closeBtn: HTMLElement | null;
    signUpBtn: HTMLButtonElement | null;
    emailInput: HTMLInputElement | null;
    usernameInput: HTMLInputElement | null;
    passwordInput: HTMLInputElement | null;
    confirmPasswordInput: HTMLInputElement | null;

    constructor() {
        this.closeBtn = document.querySelector('.modal__close-btn');
        this.signUpBtn = document.querySelector('.modal__signup-btn');
        this.emailInput = document.querySelector('.registration-email');
        this.usernameInput = document.querySelector('.registration-name');
        this.passwordInput = document.querySelector('.registration-password');
        this.confirmPasswordInput = document.querySelector('.registration-password-confirm');
    }

    createUser() {
        const emailWarning = document.querySelector('.email_validation');
        const emptyFieldsWarning = document.querySelector('.name_validation');
        const passwordWarning = document.querySelector('.password_validation');
        window.addEventListener('click', (e) => {
            const extendedUserData = {
                email: (this.emailInput as HTMLInputElement).value,
                password: JSON.stringify((this.passwordInput as HTMLInputElement).value),
                name: (this.usernameInput as HTMLInputElement).value,
                confirmPassword: JSON.stringify((this.confirmPasswordInput as HTMLInputElement).value),
            };
            const userData = {
                email: (this.emailInput as HTMLInputElement).value,
                password: JSON.stringify((this.passwordInput as HTMLInputElement).value),
            };
            if (
                this.validateEmail(extendedUserData) &&
                this.validatePassword(extendedUserData) &&
                this.validateEmptyFields(extendedUserData) &&
                e.target === this.signUpBtn
            ) {
                this.sendData(userData);
            }
            if (!this.validateEmail(extendedUserData) && e.target === this.signUpBtn) {
                emailWarning?.classList.add('email_validation-active');
            }
            if (!this.validateEmail(extendedUserData) && e.target !== this.signUpBtn) {
                emailWarning?.classList.remove('email_validation-active');
            }
            if (!this.validateEmptyFields(extendedUserData) && e.target === this.signUpBtn) {
                emptyFieldsWarning?.classList.add('name_validation-active');
            }
            if (!this.validateEmptyFields(extendedUserData) && e.target !== this.signUpBtn) {
                emptyFieldsWarning?.classList.remove('name_validation-active');
            }
            if (!this.validatePassword(extendedUserData) && e.target === this.signUpBtn) {
                passwordWarning?.classList.add('password_validation-active');
            }
            if (!this.validatePassword(extendedUserData) && e.target !== this.signUpBtn) {
                passwordWarning?.classList.remove('password_validation-active');
            }
        });
    }

    async sendData(data: { email: string | null; password: string | null } | null) {
        const dataResponse = await fetch('https://react-learnwords-english.herokuapp.com/users', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (dataResponse.ok) {
            const content = await dataResponse.json();
            window.localStorage.setItem('userInfo', JSON.stringify(content));
        }
        if (dataResponse.status === 417) {
            alert('жи есть');
        }
    }

    validateEmail(data: {
        email: string | null;
        password: string;
        name: string | null;
        confirmPassword: string | null;
    }): boolean {
        const EMAIL_REGEXP =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu; // https://ru.hexlet.io/blog/posts/validatsiya-email-na-javascript взято для валидации email
        return EMAIL_REGEXP.test(data.email as string);
    }

    validatePassword(data: {
        email: string | null;
        password: string | null;
        name: string | null;
        confirmPassword: string | null;
    }): boolean {
        return (
            (data.password as string).length >= 8 &&
            (data.confirmPassword as string).length >= 8 &&
            data.password === data.confirmPassword
        );
    }

    validateEmptyFields(data: {
        email: string | null;
        password: string;
        name: string | null;
        confirmPassword: string | null;
    }): boolean {
        if (data.email && data.password && data.name && data.confirmPassword) {
            return true;
        } else return false;
    }
}
