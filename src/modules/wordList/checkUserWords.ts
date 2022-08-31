import { getCards } from './userCards';

export const checkUserWords = async function () {
    const cardsOnPage = JSON.parse(window.localStorage.getItem('CardsOnPage') as string);
    await getCards
        .getUserCards()
        .then((res) => {
            return cardsOnPage
                .map((el1: string) => {
                    return res.filter((el2: { id: string; difficulty: string; wordId: string }) => el2.wordId === el1);
                })
                .flat();
        })
        .then((res) => {
            const hardBtns = Array.from(document.querySelectorAll('.word__btns--hard'));
            const learnedBtns = Array.from(document.querySelectorAll('.word__btns--learned'));
            const textbook = document.querySelector('.textbook__words');
            const activeHardBtns = res
                .map((el1: { id: string; difficulty: string; wordId: string }) => {
                    return hardBtns.filter(
                        (el2: Element) => el2.getAttribute('data-id') === el1.wordId && el1.difficulty === 'hard'
                    );
                })
                .flat();
            activeHardBtns.forEach((el: Element) => el.classList.add('word__btns--checked'));

            const activeEasyBtns = res
                .map((el1: { id: string; difficulty: string; wordId: string }) => {
                    return learnedBtns.filter(
                        (el2: Element) => el2.getAttribute('data-id') === el1.wordId && el1.difficulty === 'easy'
                    );
                })
                .flat();
            activeEasyBtns.forEach((el: Element) => el.classList.add('word__btns--checked'));
            if (
                activeEasyBtns.length + activeHardBtns.length === 20 ||
                (activeEasyBtns.length / 2 + activeHardBtns.length === 20 && activeEasyBtns.length > 0)
            ) {
                textbook?.classList.add('textbook-learned');
            } else {
                textbook?.classList.remove('textbook-learned');
            }
        });
};

export const TextbookSwitchListener = function () {
    const textbookButton = document.querySelector('#section-textbook');
    console.log('123');
    window.addEventListener('click', (e) => {
        if (e.target === textbookButton) {
            checkUserWords();
        }
    });
};
