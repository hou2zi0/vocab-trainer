const state = {
    kana: document.getElementById('kana'),
    kanji: document.getElementById('kanji'),
    textinput: document.getElementById('text-input'),
    button: document.getElementById('submit'),
    currentIndex: 0,
    vocab: '',
    falseItems: []
};

function setUp(state) {
  
    const vocab = fetch('https://raw.githubusercontent.com/hou2zi0/vocab-trainer/master/data/japanese/jlpt_level_N5_all.json')
      .then(r => r.text())
      .then(t => JSON.parse(t))
      .then((vocab) => {
        console.log(vocab);
        state.vocab = vocab;
        return vocab
      })
      .then((vocab) => {
          console.log(state);
          setVocab(state, vocab, state.currentIndex);
          
          state.textinput.addEventListener('keyup', (e) => {
            if (e.key == 'Enter'){
                console.log(state.textinput.value);
            const answer = state.textinput.value.trim();
            const correct = state.vocab[state.currentIndex].translation.german.split(';').join(' ');
            var re = new RegExp(`${answer}`);
            if (correct.match(re) && !(answer == '')){
              state.textinput.value = '';
              state.currentIndex += 1;
              setVocab(state, state.vocab, state.currentIndex);
              console.log('correct');
            } else {
                document.body.classList.add('shake');
                document.body.onanimationend = (e) => {
                    e.target.classList.remove('shake');
                };
              console.log('false');
            }
            }
        })

          state.button.addEventListener('click', (e) => {
              console.log(state.textinput.value);
              const answer = state.textinput.value.trim();
              const correct = state.vocab[state.currentIndex].translation.german.split(';').join(' ');
              var re = new RegExp(`${answer}`);
              if (correct.match(re) && !(answer == '')){
                state.textinput.value = '';
                state.currentIndex += 1;
                setVocab(state, state.vocab, state.currentIndex);
                console.log('correct');
              } else {
                  document.body.classList.add('shake');
                  document.body.onanimationend = (e) => {
                      e.target.classList.remove('shake');
                  };
                console.log('false');
              }
          })
      });
    }

function setVocab(state, vocab, i){
    if (vocab.length >   i) {
        if (vocab[i].kanji == '') {
            state.kana.textContent = '';
            state.kanji.textContent = vocab[i].kana;
        } else {
            state.kana.textContent = vocab[i].kana;
            state.kanji.textContent = vocab[i].kanji;
        }
    } else {
        state.kana.textContent = '';
        state.kanji.textContent = 'Fertig!';
    }
}

