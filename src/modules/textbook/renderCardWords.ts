import { getWords } from './requestWords';
import cardWord from './cardWord';
import { storage } from '../storage/storage';
import groupWords from './groupWords';
import paginationWords from './paginationWords';

export default function renderCardWords() {
    const textbookWords = document.querySelector('.textbook__words') as HTMLDivElement;
    getWords(storage.groupCount, storage.pageCount).then((result) => {
        console.log(result)
        textbookWords.innerHTML = cardWord(result);
    });

    groupWords();
    paginationWords();
}
