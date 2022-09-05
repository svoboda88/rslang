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

export interface Answers {
    id: string;
    audio: string;
    word: string;
    translate: string;
}

export interface GetUserCards {
    difficulty: string;
    optional: Optional;
    id: string;
    wordId: string;
}

export interface Game {
    wordsToPlay: GetWords[];
    isWordCorrect: boolean;
    wordIndex: number;
    wordPrice: number;
    resultCount: number;
    series: number;
    correctAnswersSeries: number[];
    correctAnswers: GetWords[];
    wrongAnswers: GetWords[];
    extraWords: GetWords[];
    newWords: number;
    learnedWords: number;
}

export interface Optional {
    sprintRight: number;
    sprintTries: number;
    audiocallRight: number;
    audiocallTries: number;
    mistakeAt: number;
}

export interface Statistics {
    learnedWords: number;
    optional: StatisticsOptional;
}

export interface StatisticsOptional {
    today: TodayStatistics;
    longterm: string;
}

export interface TodayStatistics {
    date: Date;
    newWords: number;
    sprintWords: number;
    sprintPercent: number;
    sprintSeries: number;
    audiocallWords: number;
    audiocallPercent: number;
    audiocallSeries: number;
}

export interface LongtermStatistics {
    date: Date;
    newWords: number;
    learnedWords: number;
}

export interface BarData {
    date: string;
    learnedWords: number;
}

export interface LineData {
    date: string;
    newWords: number;
}
