import { GetWords } from '../types/types';

export interface Game {
    wordsToPlay: GetWords[];
    isWordCorrect: boolean;
    wordIndex: number;
    wordPrice: number;
    resultCount: number;
    correctAnswers: GetWords[];
    wrongAnswers: GetWords[];
}
