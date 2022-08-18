const base = 'https://react-learnwords-english.herokuapp.com/words';

export interface GetWords {
    id: 'string';
    group: 0;
    page: 0;
    word: 'string';
    image: 'string';
    audio: 'string';
    audioMeaning: 'string';
    audioExample: 'string';
    textMeaning: 'string';
    textExample: 'string';
    transcription: 'string';
    wordTranslate: 'string';
    textMeaningTranslate: 'string';
    textExampleTranslate: 'string';
}

export const getWords = async (group: number, page: number): Promise<GetWords[]> => {
    const response = await fetch(`${base}?group=${group}&page=${page}`);
    const items = await response.json();
    return items;
};

export const getWord = async (id: string): Promise<GetWords> => {
    const response = await fetch(`${base}/${id}`);
    const item = await response.json();
    return item;
};
