function setFont(font, state) {
  const style = state.fonts[font];
  const hanzi = document.querySelector('.hanzi');
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
  <p class="hanzi" style="${state.fonts[state.currentFont]}">${item.simple}</p>
  <p class="pinyin">${item.pinyin}</p>
  <p class="translation">${item.german}</p>
  <p class="wiktionary">More information on <a href="${item.wiktionary}">Wiktionary</a></p>
  `;
  vocab_area.innerHTML = html;
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