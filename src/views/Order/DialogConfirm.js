import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
// import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// import { I18n } from '../../config'

export default function FormDialog(props) {
  const { open, onCancel, onOk } = props

  return (
    <div>
      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Số điện thoại nhận hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cung cấp số điện thoại để khi người giao hàng tới sẽ liên lạc với bạn. Thông tin này là
            bắt buộc, yêu cầu nhập vào để tiếp tục đặt hàng.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Huỷ
          </Button>
          <Button onClick={onOk} color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

FormDialog.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  // errorPhone: PropTypes.string,
  // phone: PropTypes.string,
  // onChangeText: PropTypes.string,
  // onFocusInput: PropTypes.string,
}
