import { getWords } from './requests';
import wordCard from './wordCard';

export default class ViewCards {
    cardLayout() {
        const textbookWords = document.querySelector('.textbook__words') as HTMLDivElement;
        getWords(0, 0).then((result) => {
            textbookWords.innerHTML = wordCard(result);
        });
    }
}
