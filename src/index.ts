import { Authorize } from './modules/authorization/authorization';
import { Logout } from './modules/authorization/logout';
import { Register } from './modules/authorization/registration';
import { UI } from './modules/ui/ui';
import { Textbook } from './modules/textbook/textbook';
import './style.css';
import { SprintController } from './modules/sprint/sprint-controller';
import { SprintView } from './modules/sprint/sprint-view';
import { SprintModel } from './modules/sprint/sprint-model';

const ui = new UI();
const textbook = new Textbook(ui);

ui.init();
textbook.init();

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
