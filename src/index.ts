import { UI } from './modules/ui/ui';
import { Textbook } from './modules/textbook/textbook';
import './style.css';

const ui = new UI();
const textbook = new Textbook(ui);

ui.init();
textbook.init();
