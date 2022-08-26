import { hardWords } from './userCards';

export const checkUserWords = async function () {
    const cardsOnPage = JSON.parse(window.localStorage.getItem('CardsOnPage') as string);
    await hardWords
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
        })
        .then(() => {
            window.addEventListener('click', checkIfPageLearned);
        });
};

const checkIfPageLearned = (e: MouseEvent) => {
    const hardBtns = Array.from(document.querySelectorAll('.word__btns--hard'));
    const learnedBtns = Array.from(document.querySelectorAll('.word__btns--learned'));
    const lvlCards = Array.from(document.querySelectorAll('.lvl__card'));
    const paginationBtns = Array.from(document.querySelectorAll('.pagination__btn'));
    const buttons = [...hardBtns, ...learnedBtns, ...lvlCards, ...paginationBtns];
    const textBook = document.querySelector('.textbook__words');
    /*  const buttons = [
        ...Array.from(document.querySelectorAll('.word__btns--hard')),
        ...Array.from(document.querySelectorAll('.word__btns--learned')),
    ]; */
    const checkedLearnedBtns = learnedBtns.filter((el) => {
        return el.classList.contains('word__btns--checked');
    });

    const checkedHardBtns = hardBtns.filter((el) => {
        return el.classList.contains('word__btns--checked');
    });
    console.log(checkedHardBtns.length);
    console.log(checkedLearnedBtns.length);
    console.log(buttons);
    buttons.forEach((el) => {
        if (
            checkedLearnedBtns.length + checkedHardBtns.length === 20 &&
            checkedLearnedBtns.length > 0 &&
            e.target === el
        ) {
            textBook?.classList.add('textbook-learned');
        } else if (checkedHardBtns.length + checkedLearnedBtns.length < 20 && e.target === el) {
            textBook?.classList.remove('textbook-learned');
        }
    });
};
