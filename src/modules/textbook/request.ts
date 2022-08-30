import { GetWords } from '../types/types';

const base = 'https://react-learnwords-english.herokuapp.com/words';

export const getWordsResult = async (group: number, page: number): Promise<GetWords[]> => {
    const response = await fetch(`${base}?group=${group}&page=${page}`);
    const items = await response.json();
    return items;
};

export const getWordResult = async (id: string): Promise<GetWords> => {
    const response = await fetch(`${base}/${id}`);
    const item = await response.json();
    return item;
};
