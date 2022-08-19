import { storage } from '../storage/storage';
import renderCardWords from './renderCardWords';

export default function paginationWords() {
    const paginationList = document.querySelector('.pagination__list') as HTMLUListElement;

    paginationList.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const target = event.target as HTMLLIElement;

        if (target.id === 'textbook-next') {
            storage.pageCount++;
            renderCardWords();
        }

        if (target.id === 'textbook-prev') {
            storage.pageCount--;
            renderCardWords();
        }

        if (target.id === 'textbook-last') {
            storage.pageCount = 29;
            renderCardWords();
        }

        if (target.id === 'textbook-first') {
            storage.pageCount = 0;
            renderCardWords();
        }
    });
}
