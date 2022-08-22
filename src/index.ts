import { Authorize } from './modules/authorization/authorization';
import { Register } from './modules/authorization/registration';
import { UI } from './modules/ui/ui';
import './style.css';

const ui = new UI();
ui.init();

const authorization = new Register();
authorization.createUser();

const userSignIn = new Authorize();
userSignIn.signIn();
