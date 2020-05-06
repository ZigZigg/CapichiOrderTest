import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
// import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { I18n } from '../../config'
import { mainColor } from '../../constants/styles'

export default function FormDialog(props) {
  const { open, onCancel, onOk, content } = props

  return (
    <div>
      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{I18n.t('warn')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onOk}
            variant="contained"
            style={{ marginTop: '15px', backgroundColor: mainColor, color: '#ffffff' }}
          >
            {I18n.t('restaurantText.ok')}
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
  content: PropTypes.string,
}
