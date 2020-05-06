import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
// import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
// import { I18n } from '../../config'
import Grid from '@material-ui/core/Grid'
import '../../assets/css/Order/styles.css'
import _ from 'lodash'
import OrderItem from './OrderItem'
import { I18n } from '../../config'

export default function DialogReview(props) {
  const {
    open,
    onCancel,
    onOk,
    dataReview,
    classes,
    convertPrice,
    typePicker,
    deliveryAddress,
  } = props
  const { shipFee, restaurant, itemSelected } = dataReview
  const { total_fee, distance, currency, duration } = shipFee || {}
  const { name, address } = restaurant || {}
  const time = `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}p ${duration %
    60}s`
  const total = _.reduce(
    itemSelected,
    (sum, item) => {
      return sum + item.price * item.count
    },
    0
  )
  const currentCurrency = typePicker === 'delivery' ? currency : 'VND'
  // const getShippingFee = () =>{
  //   const { geometry, formatted_address } = locationGG.data.result || {}
  //   const { location } = geometry
  //   if (typePicker === 'delivery') {
  //     let path = this.formatPath(formatted_address, location)
  //     const city = this.getCity(formatted_address)
  //     let service_id = 'HAN-BIKE'
  //     if (city === 'Hanoi') service_id = 'HAN-BIKE'
  //     if (city === 'Ho Chi Minh City') service_id = 'SGN-BIKE'
  //     path = JSON.stringify(path)
  //     getDistanceAhamove({ token, path, service_id }).then(res => {
  //       if(res.isSuccess){
  //         setShipFee(res.data)
  //       }else{
  //         setShipFee({})
  //       }

  //     })
  //   }
  // }
  // useEffect(() => {
  //   if(open && !shipFee){
  //     getShippingFee()
  //   }
  //   // eslint-disable-next-line
  // }, [open])
  return (
    <div>
      <Dialog
        id="order-container"
        classes={{ paperFullWidth: 'dialog-review' }}
        fullWidth
        open={open}
        onClose={onCancel}
        aria-labelledby="form-dialog-title"
      >
        <span className={classes.titleDialog} id="form-dialog-title">
          {I18n.t('orderText.orderInformation')}
        </span>
        <Grid container style={{ marginTop: '10px' }}>
          {itemSelected &&
            itemSelected.length > 0 &&
            itemSelected.map(value => {
              return <OrderItem item={value} classes={classes} gridStyle={{ lg: 6 }} />
            })}
        </Grid>
        <div
          style={{ width: '100%', height: '1px', backgroundColor: '#c2c2c2', margin: '10px 0' }}
        />
        <Grid container>
          <Grid item lg={6} xs={12} className={`${classes.footerOrder} footer-order`}>
            <span className={classes.titleDialog} id="form-dialog-title">
              {I18n.t('orderText.shippingInformation')}
            </span>
            <div style={{ padding: '0 10px' }}>
              <div className={classes.itemOrderStyle}>
                <span className={classes.textItem}>{`${I18n.t('orderText.storeName')}:`}</span>
                <span className={classes.itemOrderRight}>{name}</span>
              </div>
              <div className={classes.itemOrderStyle}>
                <span className={classes.textItem}>{`${I18n.t('orderText.storeAddress')}:`}</span>
                <span className={classes.itemOrderRight}>{address}</span>
              </div>
              {typePicker === 'delivery' && (
                <>
                  <div className={classes.itemOrderStyle}>
                    <span className={classes.textItem}>{`${I18n.t(
                      'orderText.deliveryAddress'
                    )}:`}</span>
                    <span className={classes.itemOrderRight}>{deliveryAddress}</span>
                  </div>
                  <div className={classes.itemOrderStyle}>
                    <span className={classes.textItem}>{`${I18n.t('orderText.distance')}:`}</span>
                    <span className={classes.itemOrderRight}>{distance}Km</span>
                  </div>
                  <div className={classes.itemOrderStyle}>
                    <span className={classes.textItem}>{`${I18n.t(
                      'orderText.deliveryTime'
                    )}:`}</span>
                    <span className={classes.itemOrderRight}>{time}</span>
                  </div>
                </>
              )}
            </div>
          </Grid>
          <Grid item lg={6} xs={12} className={`${classes.footerOrder} footer-order`}>
            <span className={classes.titleDialog} id="form-dialog-title">
              {I18n.t('orderText.priceInformation')}
            </span>
            <div style={{ padding: '0 10px' }}>
              <div className={classes.itemOrderStyle}>
                <span className={classes.textItem}>{`${I18n.t('orderText.totalPrice')}:`}</span>
                <span className={classes.itemOrderRight}>
                  {convertPrice(total)} {currentCurrency}
                </span>
              </div>
              <div className={classes.itemOrderStyle}>
                <span className={classes.textItem}>{`${I18n.t('orderText.shippingFee')}:`}</span>
                <span className={classes.itemOrderRight}>
                  {typePicker === 'delivery' ? convertPrice(total_fee) : 0} {currentCurrency}
                </span>
              </div>
              <div className={classes.itemOrderStyle}>
                <span className={classes.textItem}>{`${I18n.t('orderText.grandTotal')}:`}</span>
                <span className={classes.itemOrderRight}>
                  {typePicker === 'delivery'
                    ? convertPrice(total + total_fee)
                    : convertPrice(total)}{' '}
                  {currentCurrency}
                </span>
              </div>
            </div>
          </Grid>
        </Grid>

        <DialogActions>
          <Button onClick={onOk} color="primary" variant="contained" style={{ marginTop: '15px' }}>
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
  convertPrice: PropTypes.func,
  onOk: PropTypes.func,
  dataReview: PropTypes.any,
  classes: PropTypes.any,
  typePicker: PropTypes.any,
  deliveryAddress: PropTypes.any,
  // token: PropTypes.any,
  // locationGG: PropTypes.any,
  // getDistanceAhamove:PropTypes.func
}
