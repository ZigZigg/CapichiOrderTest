export const isDevelopEnvironment = () => {
  console.log(process.env.NODE_ENV)
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return true
  }
  return false
}
export const testDev = () => {}
