/* eslint-disable no-extend-native */
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const getMonthName = month => monthNames[month]
export const getShortMonthName = month => getMonthName(month).substr(0, 3)
