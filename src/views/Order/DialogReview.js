import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
// import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// import { I18n } from '../../config'

export default function DialogReview(props) {
  const { open, onCancel, onOk, dataReview } = props
  const { shipFee, restaurant } = dataReview
  const { total_fee, distance, currency, duration } = shipFee || {}
  const { name, address } = restaurant || {}
  const time = `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}p ${duration %
    60}s`
  return (
    <div>
      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Thông tin ship</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span>Tên nhà hàng: </span>
            <span>{name}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span>Địa chỉ: </span>
            <span>{address}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span>Khoảng cách: </span>
            <span>{distance}Km</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span>Thời gian Ship: </span>
            <span>{time}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span>Phí Ship: </span>
            <span>
              {total_fee} {currency}
            </span>
          </div>
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
  dataReview: PropTypes.any,
}
