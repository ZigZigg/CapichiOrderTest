export const convertErrorFormServer = error => {
  if (!error) return null
  try {
    const errorServer = error
    errorServer.response.data.message[0] = getMessageErrorFormServer(errorServer)
    return errorServer
  } catch (e) {
    return error
  }
}

export const getMessageErrorFormServer = error => {
  if (!error) return ''
  try {
    const errorServer = error
    const { status } = errorServer.response
    if (status >= 300 && status < 400) {
      errorServer.response.data.message[0] = 'error300'
    }
    if (status >= 400 && status < 500 && status !== 422) {
      errorServer.response.data.message[0] = 'error400'
    }
    if (status >= 500) {
      errorServer.response.data.message[0] = 'error500'
    }
    if (status === 401) {
      errorServer.response.data.message[0] = 'error401'
    }
    if (status === 400 || status === 403 || status === 404) {
      errorServer.response.data.message[0] = 'error404'
    }

    if (status !== 200) errorServer.response.data.message[0] = 'error300'
    const message = errorServer.response.data.message[0]
    return message
  } catch (e) {
    return 'error400'
  }
}
