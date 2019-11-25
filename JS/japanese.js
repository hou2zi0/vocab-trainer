let state = {
  "currentIndex": 0,
  "currentFont": "default",
  "fonts": {
    "default": "",
    "MPlusRounded": "font-family: 'M PLUS Rounded 1c', sans-serif;",
    "Kosugi": "font-family: 'Kosugi', sans-serif;",
    "SawarabiMincho": "font-family: 'Sawarabi Mincho', sans-serif;",
    "NotoSerifJP": "font-family: 'Noto Serif JP', serif;"
  },
  "available_voices": ""
}

function setUp(state) {

  const vocab = fetch('https://raw.githubusercontent.com/hou2zi0/vocab-trainer/master/data/japanese/jlpt_level_01_all.json')
    .then(r => r.text())
    .then(t => JSON.parse(t))
    .then((vocab) => {
      console.log(vocab);
      setVocab(vocab, state.currentIndex, state);
      return vocab
    })
    .then((vocab) => {

      // list of languages is probably not loaded, wait for it
      if (window.speechSynthesis.getVoices()
        .length == 0) {
        voiceGeneration(state, 'ja-JP', '.kana');
      } else {
        voiceGeneration(state, 'ja-JP', '.kana');
      }

      const style_buttons = Array.from(document.getElementsByClassName('set-font'));
      style_buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
          state.currentFont = setFont(e.target.dataset.font, state);
        })
      })


      document.body.addEventListener('click', (e) => {
        if (e.x < (window.innerWidth / 2)) {
          console.log('left');
          state.currentIndex = previousVocab(vocab, state);
        } else {
          console.log('right');
          state.currentIndex = nextVocab(vocab, state);
        }
      });

      document.querySelector('#outer')
        .addEventListener('click', (e) => {
          e.stopPropagation();
        });

      document.body
        .addEventListener('keydown', function(event) {
          // Add arrow key navigation through sources
          switch (event.keyCode) {
            case 37:
              console.log('Left key pressed');
              state.currentIndex = previousVocab(vocab, state);
              break;
            case 38:
              console.log('Up key pressed');
              state.currentIndex = previousVocab(vocab, state);
              break;
            case 39:
              console.log('Right key pressed');
              state.currentIndex = nextVocab(vocab, state);
              break;
            case 40:
              console.log('Down key pressed');
              state.currentIndex = nextVocab(vocab, state);
              break;
          }
        });
    })
}

function setFont(font, state) {
  const style = state.fonts[font];
  const hanzi = document.querySelector('.kanji');
  hanzi.style = style;
  return font;
}

function generateRandomIndex(vocab) {
  let randomIndex = Math.floor(Math.random() * vocab.length);
  return randomIndex;
}

function setVocab(vocab, index, state) {
  let item = vocab[index];
  let vocab_area = document.getElementById('vocab');
  let html = `
  ${buildKanaKanjiField(item, state)}
  ${buildListField(item.translation.german, ';', 'translation-german',' translation-german-item')}
  <hr>
  ${buildWiktionaryLink(item.kanji,item.kana)}
  ${buildDictionaryLinks('jisho', [item.kana, item.kanji])}
  `;

  vocab_area.innerHTML = html;

  document.querySelector('.kanji')
    .addEventListener('click', (e) => {
      let utter = new SpeechSynthesisUtterance();
      utter.voice = state.voice;
      utter.text = document.querySelector('.kanji')
        .textContent.replace(/[~～]/, '');
      window.speechSynthesis.speak(utter);
    })
}

function randomVocab(vocab, state) {
  let randomIndex = generateRandomIndex(vocab);
  setVocab(vocab, randomIndex, state);
}

function previousVocab(vocab, state) {
  let index = state.currentIndex;
  if (index == 0) {
    return 0;
  }
  index = index - 1;
  setVocab(vocab, index, state);
  return index;
}

function nextVocab(vocab, state) {
  let index = state.currentIndex;
  if (index == vocab.length - 1) {
    return vocab.length - 1;
  }
  index = index + 1;
  setVocab(vocab, index, state);
  return index;
}

function buildListField(field, separator, ulClass, liClass) {
  const main_list_class = (ulClass == 'undefined') ? 'field-unordered-list' : ulClass;
  const list_item_class = (ulClass == 'undefined') ? 'field-list-item' : ulClass;
  const fields = field.split(separator)
    .map((entry) => {
      return `<li class="${list_item_class}">${entry.trim()}</li>`
    });
  console.log(fields);
  const builtField = `
      <ol class="${main_list_class}">
          ${fields.join('\n')}
      </ol>`;
  return builtField;
}

function buildKanaKanjiField(item, state) {
  if (item.kanji == '') {
    return `<p class="kana">${item.kana}</p>
    <p class="kanji" style="${state.fonts[state.currentFont]}">${item.kana}</p>`;
  } else {
    return `<p class="kana">${item.kana}</p>
    <p class="kanji" style="${state.fonts[state.currentFont]}">${item.kanji}</p>`;
  }
}

function voiceGeneration(state, langCode, query) {
  window.speechSynthesis.addEventListener('voiceschanged', function() {
    state.available_voices = window.speechSynthesis.getVoices();
    // find voice by language locale "en-US"
    // if not then select the first voice
    state.voice = state.available_voices.filter((i) => {
      return i.lang === langCode;
    })[0];

    if (state.voice === '') {
      state.voice = state.available_voices[0];
    }

    document.body
      .addEventListener('keydown', function(event) {
        // Add arrow key navigation through sources
        switch (event.keyCode) {
          case 32:
            let utter = new SpeechSynthesisUtterance();
            utter.voice = state.voice;
            utter.text = document.querySelector(query)
              .textContent.replace(/[~～]/, '');
            window.speechSynthesis.speak(utter);
            break;
        }
      })

  });
}

function buildWiktionaryLink(field, fallback) {
  if (field == '') {
    return `<p class="wiktionary">More information about ${fallback} on <a href="https://en.wiktionary.org/wiki/${fallback.replace(/[~～]/, '').trim()}#Japanese">Wiktionary</a></p>`;
  } else {
    return `<p class="wiktionary">More information about ${field} on <a href="https://en.wiktionary.org/wiki/${field.replace(/[~～]/, '').trim()}#Japanese">Wiktionary</a></p>`;
  }
}

function buildDictionaryLinks(dictionary, arrayOfFields) {
  const dicts = {
    "jisho": {
      "search": "https://jisho.org/search/",
      "main_url": "https://jisho.org/",
      "name": "Jisho"
    }
  }

  const links = arrayOfFields.map((field) => {
    if (field !== '') {
      return `<li class="${dictionary}-item">Loopk up <a href="${dicts[dictionary].search}${field.replace(/[~～]/, '').trim()}">${field}</a> on <a href="${dicts[dictionary].main_url}">${dicts[dictionary].name}</a></li>`;
    } else {
      return '';
    }
  });

  if (links.join('') == '') {
    return '';
  } else {
    return `<ul class="${dictionary}">
      ${links.join('\n')}
    </ul>`;
  }
}