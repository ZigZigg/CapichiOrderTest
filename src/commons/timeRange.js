import moment from 'moment'

export const getTimeRange = timeRange => {
  if (timeRange) {
    const currentTime = moment().format('HH:mm')
    const convertCurrentTime = moment(currentTime, 'HH:mm')
    const timeArray = timeRange.split(',')
    const restaurantTimeRange = timeArray.map(value => {
      const timeSplit = value.split('-')
      const openTime = moment(timeSplit[0], 'HH:mm')
      const closeTime = moment(timeSplit[1], 'HH:mm')
      const isOpen = convertCurrentTime.isBefore(closeTime) && convertCurrentTime.isAfter(openTime)
      return { time: `${timeSplit[0]} - ${timeSplit[1]}`, isOpen, sort: isOpen ? 1 : 0 }
    })
    return restaurantTimeRange
  }
  return []
}
export const testTime = () => {}
