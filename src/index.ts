import { Authorize } from './modules/authorization/authorization';
import { Logout } from './modules/authorization/logout';
import { Register } from './modules/authorization/registration';
import { UI } from './modules/ui/ui';
import { Textbook } from './modules/textbook/textbook';
import { Audiocall } from './modules/audiocall/audiocall';
import './style.css';
import { getCards } from './modules/wordList/userCards';
import { checkUserWords } from './modules/wordList/checkUserWords';
import { SprintController } from './modules/sprint/sprint-controller';
import { SprintView } from './modules/sprint/sprint-view';
import { SprintModel } from './modules/sprint/sprint-model';
import { listenPages } from './modules/pagelistener/pageListener';

const ui = new UI();
const textbook = new Textbook(ui);
const audiocall = new Audiocall();

ui.init();

textbook.init().then(getCards.getWordCards).then(checkUserWords);
audiocall.init();

const authorization = new Register();
authorization.createUser();

const userSignIn = new Authorize(ui);
userSignIn.signIn();

const logOut = new Logout(ui);
logOut.goOut();

const sprintModel = new SprintModel();
const sprintView = new SprintView();
const sprintController = new SprintController(sprintModel, sprintView);

sprintController.init();

listenPages.listen();
