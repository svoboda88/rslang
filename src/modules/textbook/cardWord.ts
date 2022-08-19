import { GetWords } from './requestWords';

export default function cardWord(result: GetWords[]) {
    let card = '';
    result.forEach((item) => {
        card += `
            <div class="words__card">
                <img class="word__img" src="https://react-learnwords-english.herokuapp.com/${item.image}" alt="word image">
                <div class="word__card--right">
                    <h2 class="word__title">${item.word} ${item.transcription}
                        <audio src="https://react-learnwords-english.herokuapp.com/${item.audio}" controls></audio>
                        <span class="material-symbols-outlined">
                            volume_up
                        </span>
                    </h2>
                    <p class="word__translate">${item.wordTranslate}</p>
                    <br>
                    <p>${item.textMeaning}</p>
                    <audio src="https://react-learnwords-english.herokuapp.com/${item.audioMeaning}" controls></audio>
                    <p class="word__translate">${item.textMeaningTranslate}</p>
                    <br>
                    <p>${item.textExample}</p>
                    <audio src="https://react-learnwords-english.herokuapp.com/${item.audioExample}" controls></audio>
                    <p class="word__translate">${item.textExampleTranslate}</p>
                </div>
            </div>
        `;
    });

    return card;
}
