const translate = function (mapping, originalText, translatedText) {
  let current = ''
  for (let i = 0; i < originalText.length; i++) {
    if (mapping[originalText[i]] !== undefined) {
      if (current !== mapping[originalText[i]]) {
        translatedText += mapping[originalText[i]]
        current = mapping[originalText[i]]
      }
    } else {
      translatedText += originalText[i]
      current = originalText[i]
    }
  }
  return translatedText
}

export {translate}
