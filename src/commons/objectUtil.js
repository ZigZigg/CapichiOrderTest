export const testObject = () => {}

export const getObject = (value, object) => {
  const ar = object.split('.')
  let returnValue = value

  for (let index = 0; index < ar.length; index += 1) {
    if (typeof returnValue === 'object') returnValue = returnValue[ar[index]]
  }
  return returnValue
}
