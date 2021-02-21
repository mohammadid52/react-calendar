/* eslint-disable */
const ArabicNumerals = (() => {
  const utf8Codes = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669']

  return {
    fromInteger: x => {
      const digits = Math.floor(x).toString().split('')
      return digits
        .map(digit => {
          return parseInt(digit, 10)
        })
        .map(digit => {
          return utf8Codes[digit]
        })
        .join('')
        .toString()
    },
  }
})()

export default ArabicNumerals
