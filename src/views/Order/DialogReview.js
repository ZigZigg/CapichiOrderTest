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

export default function DialogReview(props) {
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
          <Button onClick={onOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

DialogReview.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}
