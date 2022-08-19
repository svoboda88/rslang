import { storage } from '../storage/storage';
import renderCardWords from './renderCardWords';

export default function groupWords() {
    const textbookLvls = document.querySelector('.textbook__lvls') as HTMLDivElement;

    textbookLvls.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const target = event.target as HTMLDivElement;
        const count = Array.from(textbookLvls.children).indexOf(target) as number;
        storage.groupCount = count;
        renderCardWords();
    });
}
