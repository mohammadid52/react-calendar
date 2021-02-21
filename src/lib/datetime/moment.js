import { getSharedPreferences } from 'lib/storage/index'
import moment from 'moment-timezone'

let timezone = 'Asia/Calcutta'

getSharedPreferences('timezone', timezone, value => {
  timezone = value
})

const momentCustomized = (iValue = null, format) => (iValue ? moment(iValue, format).tz(timezone) : moment().tz(timezone))

export default momentCustomized
