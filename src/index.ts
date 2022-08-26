import { Authorize } from './modules/authorization/authorization';
import { Logout } from './modules/authorization/logout';
import { Register } from './modules/authorization/registration';
import { UI } from './modules/ui/ui';
import { Textbook } from './modules/textbook/textbook';
import './style.css';
import { hardWords } from './modules/wordList/userCards';
import { checkUserWords } from './modules/wordList/checkUserWords';

const ui = new UI();
const textbook = new Textbook(ui);

ui.init();

textbook.init().then(hardWords.getWordCards).then(checkUserWords);

const authorization = new Register();
authorization.createUser();

const userSignIn = new Authorize(ui);
userSignIn.signIn();

const logOut = new Logout(ui);
logOut.goOut();
