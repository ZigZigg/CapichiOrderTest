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
      errorServer.response.data.message[0] = 'Máy chủ không thể thực hiện yêu cầu của bạn.'
    }
    if (status >= 400 && status < 500 && status !== 422) {
      errorServer.response.data.message[0] = 'Nội dung không tồn tại. Vui lòng thử lại sau.'
    }
    if (status >= 500) {
      errorServer.response.data.message[0] = 'Không thể kết nối đên máy chủ. Vui lòng thử lại sau.'
    }
    if (status === 401) {
      errorServer.response.data.message[0] = 'Vui lòng đăng nhập để thực hiện chức năng.'
    }
    if (status === 400 || status === 403 || status === 404) {
      errorServer.response.data.message[0] =
        'Nội dung yêu cầu không thể tìm thấy hoặc đã bị xoá. Vui lòng thử lại sau.'
    }
    const message = errorServer.response.data.message[0]
    return message
  } catch (e) {
    return 'Nội dung không tồn tại. Vui lòng thử lại sau.'
  }
}
