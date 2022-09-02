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
            const activeBtnsOnPage = document.querySelectorAll<HTMLElement>('.word__btns--checked');
            activeBtnsOnPage.forEach((btn) => btn.classList.remove('word__btns--checked'));

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
            const activeBtns = document.querySelectorAll('.word__btns--checked');
            const activeHardBtnsArray = [];
            activeBtns.forEach((el) => {
                if (el.classList.contains('word__btns--hard')) {
                    activeHardBtnsArray.push(el);
                }
            });
            if (activeBtns.length === 20 && activeHardBtnsArray.length !== 20) {
                textbook?.classList.add('textbook-learned');
            } else {
                textbook?.classList.remove('textbook-learned');
            }

            const gameSection = document.querySelector<HTMLElement>('.textbook__games');
            const activeEasyBtnsArray = [];
            activeBtns.forEach((el) => {
                if (el.classList.contains('word__btns--learned')) {
                    activeEasyBtnsArray.push(el);
                }
            });
            if (activeEasyBtnsArray.length === 20) {
                gameSection?.classList.add('hidden');
            } else if (
                activeEasyBtnsArray.length < 20 &&
                localStorage.getItem('Logged') === 'logged' &&
                Number(localStorage.getItem('groupCount')) !== 6 &&
                !localStorage.getItem('easy')
            ) {
                gameSection?.classList.remove('hidden');
            }
        });
};

export const TextbookSwitchListener = function () {
    const textbookButton = document.querySelector('#section-textbook');
    window.addEventListener('click', (e) => {
        if (e.target === textbookButton) {
            checkUserWords();
        }
    });
};
