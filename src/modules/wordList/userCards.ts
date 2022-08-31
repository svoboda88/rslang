export class GetCards {
    levelCards: NodeList | null;
    paginationBtns: NodeList | null;

    constructor() {
        this.levelCards = document.querySelectorAll('.lvl__card');
        this.paginationBtns = document.querySelectorAll('.pagination__btn');
    }
    async getWordCards() {
        const arrOfId: string[] = [];
        const hardWords = await document.querySelectorAll('.words__card');
        hardWords.forEach((el) => arrOfId.push(el.id));
        window.localStorage.setItem('CardsOnPage', JSON.stringify(arrOfId));
    }

    async getUserCards() {
        const token = JSON.parse(window.localStorage.getItem('UserToken') as string).token;
        const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
        const rawResponse = await fetch(`https://react-learnwords-english.herokuapp.com/Users/${userId}/Words/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });
        const content = await rawResponse.json();
        return content;
    }
}

export const getCards = new GetCards();
