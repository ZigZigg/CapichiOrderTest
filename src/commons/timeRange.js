import moment from 'moment'
import _ from 'lodash'

export const getTimeRange = timeRange => {
  if (timeRange) {
    const currentTime = moment().format('HH:mm')
    const convertCurrentTime = moment(currentTime, 'HH:mm')
    const timeArray = timeRange.split(',')
    const restaurantTimeRange = timeArray.map(value => {
      const timeSplit = value.split('-')
      const openTime = moment(timeSplit[0], 'HH:mm')
      const closeTime = moment(timeSplit[1], 'HH:mm')
      const isOpen =
        convertCurrentTime.isSameOrBefore(closeTime) && convertCurrentTime.isSameOrAfter(openTime)
      return { time: `${timeSplit[0]} - ${timeSplit[1]}`, isOpen, sort: isOpen ? 1 : 0 }
    })
    return restaurantTimeRange
  }
  return []
}

export const checkAvailableTime = (timeRange, selectedTime) => {
  if (timeRange) {
    const convertCurrentTime = moment(selectedTime, 'HH:mm')
    const timeArray = timeRange.split(',')
    const restaurantTimeRange = timeArray.map(value => {
      const timeSplit = value.split('-')
      const openTime = moment(timeSplit[0], 'HH:mm')
      const closeTime = moment(timeSplit[1], 'HH:mm')
      const isAvailable =
        convertCurrentTime.isSameOrBefore(closeTime) && convertCurrentTime.isSameOrAfter(openTime)
      return { time: `${timeSplit[0]} - ${timeSplit[1]}`, isAvailable }
    })
    const availableTime = _.find(restaurantTimeRange, value => value.isAvailable)
    if (!availableTime) {
      return false
    }
    return true
  }
  return true
}

export const testTime = () => {}
