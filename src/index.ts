import { Authorize } from './modules/authorization/authorization';
import { Logout } from './modules/authorization/logout';
import { Register } from './modules/authorization/registration';
import { UI } from './modules/ui/ui';
import { Textbook } from './modules/textbook/textbook';
import { Audiocall } from './modules/audiocall/audiocall';
import './style.css';

const ui = new UI();
const textbook = new Textbook(ui);
const audiocall = new Audiocall();

ui.init();
textbook.init();
audiocall.init();

const authorization = new Register();
authorization.createUser();

const userSignIn = new Authorize(ui);
userSignIn.signIn();

const logOut = new Logout(ui);
logOut.goOut();
