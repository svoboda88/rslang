import { GetWords } from '../textbook/request';

interface Storage {
    groupCount: number;
    pageCount: number;
    argumentsForAudiocall: number[];
    isFromTextbook: boolean;
    wordVariants: GetWords[];
    wordIndex: number;
    correctAnswers: Answers[];
    wrongAnswers: Answers[];
}

interface Answers {
    audio: string;
    word: string;
    translate: string;
}

export interface GetUserCards {
    difficulty: string;
    id: string;
    wordId: string;
}

export const storage: Storage = {
    groupCount: 0,
    pageCount: 0,
    argumentsForAudiocall: [],
    isFromTextbook: false,
    wordVariants: [],
    wordIndex: 0,
    correctAnswers: [],
    wrongAnswers: [],
};
