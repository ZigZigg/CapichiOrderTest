/* eslint-disable radix */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { KeyboardArrowLeft, LocationOn } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import MomentUtils from '@date-io/moment'
// import Datefns from '@date-io/date-fns'
import moment from 'moment'
// import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import classNames from 'classnames'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
import { getRestaurantDetail, confirmOrder, getListMenuByRestaurant } from '../../api'
import {
  validateEmail,
  validateAddress,
  validateName,
  validateNote,
  validatePhone,
  getTimeRange,
  checkAvailableTime,
} from '../../commons'
import '../../assets/css/Order/styles.css'
import { Container, TextField } from '@material-ui/core'
import { isMobileOnly, isTablet, isBrowser, isMobile } from 'react-device-detect'
import {orderText} from '../../variables/texts'
// const useStyles = makeStyles({
//   label:{
//     fontSize:12
//   },
// });

class Index extends PureComponent {
  constructor(props) {
    super(props)
    const { location } = props
    this.state = {
      itemSelected: location.state ? location.state.listItemSelected : [],
      objectRestaurant: location.state ? location.state.objectRestaurant : null,
      pages: location.state ? location.state.pages : 1,
      restaurant: null,
      name: '',
      phone: '',
      address: '',
      email: '',
      note: '',
      time: '',
      timePicker:null,
      typePicker: 'delivery',
      isOpenPopup: false,
      isOpenWarning: false,
      isSuccess: false,
      isHideShip: false,
      errorName: '',
      errorPhone: '',
      errorEmail: '',
      errorAddress: '',
      errorNote: '',
      errorTime: '',
    }
  }

  componentDidMount() {
    this.onGetRestaurantDetail()
  }

  onGetRestaurantDetail = async () => {
    const { objectRestaurant } = this.state
    try {
      const data = await getRestaurantDetail({ restaurantId: objectRestaurant.id })
      if (data.isSuccess) {
        this.setState({
          restaurant: data.data,
          isHideShip: data.data.hide_fee,
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }

  onChangeText = event => {
    const { name, value } = event.target
    if (name === 'email') {
      this.setState({
        [name]: value,
        errorEmail: validateEmail(value),
      })
    }
    if (name === 'name') {
      this.setState({
        [name]: value,
        errorName: validateName(value),
      })
    }
    if (name === 'phone') {
      this.setState({
        [name]: value.replace(/[\D]/g, ''),
        errorPhone: validatePhone(value.replace(/[\D]/g, '')),
      })
    }
    if (name === 'address') {
      this.setState({
        [name]: value,
        errorAddress: validateAddress(value),
      })
    }
    if (name === 'note') {
      this.setState({
        [name]: value,
        errorNote: validateNote(value),
      })
    }
  }

  convertPrice = price => {
    const priceFormat = price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
    return priceFormat
  }

  renderItem = item => {
    const { classes } = this.props
    // const { isLoadingSubmit } = this.state
    const itemClass = classNames({
      [classes.textItem]: true,
      [classes.textContent]: true,
    })
    const rowTotalPrice = item.count * item.price
    return (
      <Grid
        id="order-grid-item"
        key={item.id}
        item
        xs={12}
        md={6}
        lg={4}
        className={classNames({ [classes.gridItem]: isBrowser })}
      >
        <div className={classNames({ [classes.itemOrder]: true, 'item-order': true })}>
          <div className={classNames({ [classes.imgView]: true, 'img-view': isBrowser })}>
            <img src={item.image} alt={item.name} className={classes.imgItem} />
          </div>
          <div className={classes.itemContent}>
            <div className={classes.nameItem}>
              <span className={itemClass} style={{ marginTop: '10px' }}>
                {item.name}
              </span>
              <span className={itemClass}>{`${this.convertPrice(item.price)}VND`}</span>
            </div>
            <span
              className={classes.textItem}
              style={{ width: '10%', textAlign: 'right' }}
            >{`x${item.count}`}</span>
            <span
              className={classes.textItem}
              style={{ width: '45%', textAlign: 'right' }}
            >{`${this.convertPrice(rowTotalPrice)}VND`}</span>
          </div>
        </div>
      </Grid>
    )
  }

  onGoBack = () => {
    const { history } = this.props
    const { pages, itemSelected, restaurant } = this.state
    history.push(`/restaurant/${restaurant.id}`, { item: restaurant, pages, itemSelected })
  }

  onSubmitForm = async () => {
    const {
      name,
      phone,
      address,
      errorName,
      errorAddress,
      errorPhone,
      errorEmail,
      errorNote,
      errorTime,
    } = this.state
    if (address.trim().length === 0 || phone.length === 0 || name.trim().length === 0) {
      this.setState({
        errorName: name.trim().length === 0 ? orderText.error.name : '',
        errorPhone: phone.length === 0 ? orderText.error.phone : '',
        errorAddress: address.trim().length === 0 ? orderText.error.address : '',
        name: name.trim().length === 0 ? '' : name,
        address: address.trim().length === 0 ? '' : address,
      })
      return
    }
    if (errorAddress || errorPhone || errorName || errorEmail || errorNote || errorTime) {
      return
    }
    this.onConfirmOrder()

    // this.setState({
    //   isOpenPopup: true,
    // })
  }

  onConfirmOrder = async () => {
    const {
      restaurant,
      pages,
      itemSelected,
      name,
      phone,
      email,
      address,
      note,
      time,
      typePicker,
      isHideShip,
    } = this.state
    try {
      const data = await getListMenuByRestaurant({
        page: 1,
        limit: pages * 10,
        restaurantId: restaurant.id,
      })
      if (data.isSuccess) {
        const arraySelect = []
        _.map(itemSelected, value => {
          const selectValue = _.find(data.data, { id: value.id })
          if (!selectValue) {
            arraySelect.push({ ...value, isShow: false })
          } else {
            arraySelect.push(selectValue)
          }
        })

        const filterSelected = _.filter(
          arraySelect,
          value => !value.active || value.isShow === false
        )
        const dataRestaurant = await getRestaurantDetail({ restaurantId: restaurant.id })
        let isOpen = true
        if (dataRestaurant.data) {
          // const currentTime = moment().format('HH:mm')
          // const convertCurrentTime = moment(currentTime, 'HH:mm')
          // const openTime = moment(dataRestaurant.data.open_time, 'HH:mm')
          // const closeTime = moment(dataRestaurant.data.closed_time, 'HH:mm')
          isOpen = this.isRestaurantOpen(dataRestaurant.data)
        } else {
          isOpen = false
        }
        if (filterSelected.length > 0 || !isOpen) {
          this.setState({
            isOpenWarning: true,
          })
        } else {
          const dataOrder = await confirmOrder({
            name: name.trim(),
            phone,
            email: email.trim(),
            address: address.trim(),
            note: note.trim(),
            restaurantId: restaurant.id,
            items: itemSelected,
            hide_ship: isHideShip,
            time,
            typePicker,
          })
          if (dataOrder.isSuccess) {
            this.setState({
              isOpenPopup: true,
            })
          }
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  isRestaurantOpen = dataItem => {
    if (dataItem) {
      const timeRange = getTimeRange(dataItem.active_time_csv)
      const findOpen = _.find(timeRange, { isOpen: true })
      if (findOpen && dataItem.active) {
        return true
      }
      return false
    }
    return null
  }

  handleClose = () => {
    this.setState({
      isOpenPopup: false,
      isSuccess: true,
    })
    // history.push('/category')
  }

  handleCloseWarning = () => {
    this.setState({
      isOpenWarning: false,
    })
  }

  onChangeStartTime = e => {
    console.log('Index -> e', e)
    const value = moment(e).format('HH:mm')
    // if (Number(value[1]) > 3 && Number(value[0]) >= 2) return
    // if (Number(value[0]) >= 3) return
    // if (Number(value[0]) === 2 && Number(value[1]) > 3) {
    //   return
    // }

    // if (Number(value[3] > 5)) return

    this.setState({ time: e, errorTime: '' })
  }

  onBlurStartTime = () => {
    const { time, restaurant } = this.state
    const currentTime = moment().format('HH:mm')
    const convertCurrentTime = moment(currentTime, 'HH:mm')
    const inputTime = `${moment(time, 'HH:mm')}`
    const checkTime = inputTime.match(/_/g) && inputTime.match(/_/g).length < 4
    if (inputTime.match(/_/g) && inputTime.match(/_/g).length === 4) {
      this.setState({
        time: '',
      })
    }
    // if (time && !/_/.test(time)) {
    //   const check = inputTime.isBefore(convertCurrentTime)
    //   if (check) {
    //     this.setState({
    //       errorTime: '配達時間は現在の時間より長くなければなりません',
    //     })
    //     return
    //   }
    // }
    if (/_/.test(inputTime) && checkTime) {
      this.setState({
        errorTime: orderText.error.timeFormat,
      })
      return
    }
    const timeAvailable = checkAvailableTime(restaurant.active_time_csv, inputTime)
    if (inputTime && !timeAvailable && !inputTime.match(/_/g)) {
      this.setState({
        errorTime: orderText.error.timeOpen,
      })
    }
  }

  handleChangeRadio = event => {
    const { value } = event.target
    this.setState({
      typePicker: value,
    })
  }

  onChangeTimePicker = date =>{
    const {restaurant} = this.state
    const dateFormat = moment(date).format('HH:mm')
    this.setState({
      timePicker:date,
      time:dateFormat
    })
    const currentTime = moment().format('HH:mm')
    const convertCurrentTime = moment(currentTime, 'HH:mm')
    const inputTime = `${dateFormat}`
    const timeAvailable = checkAvailableTime(restaurant.active_time_csv, inputTime)
    if (inputTime && !timeAvailable) {
      this.setState({
        errorTime: orderText.error.timeOpen,
      })
    }else{
      this.setState({
        errorTime: '',
      })
    }
  }

  onClearTime = () =>{
    this.setState({
      timePicker:null,
      errorTime:'',
      time:''
    })
  }

  render() {
    const { classes } = this.props
    const {
      itemSelected,
      restaurant,
      isLoadingSubmit,
      errorName,
      errorPhone,
      errorAddress,
      errorEmail,
      errorNote,
      errorTime,
      name,
      phone,
      address,
      email,
      note,
      isOpenPopup,
      isOpenWarning,
      isSuccess,
      isHideShip,
      time,
      typePicker,
      timePicker
    } = this.state
    const total = _.reduce(
      itemSelected,
      (sum, item) => {
        return sum + item.price * item.count
      },
      0
    )
    const shippingFee = typePicker === 'pick_up' ? 0 : restaurant ? restaurant.fee : 0
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
        <div className={classes.wrapper}>
          <Container
            className={classes.header}
            style={{ position: isBrowser && 'inherit', padding: '0' }}
          >
            <KeyboardArrowLeft
              onClick={this.onGoBack}
              style={{ fontSize: '40px', marginLeft: '10px' }}
            />
            <span className={classes.headerLabel}>{orderText.header}</span>
            <div style={{ marginRight: '24px', width: '30px' }} />
          </Container>
          {restaurant && (
            <Container className={classes.container}>
              <div>
                <span className={classes.name}>{restaurant.name}</span>
                <div>
                  <LocationOn style={{ fontSize: '17px', marginBottom: '-3px' }} />
                  <span className={classes.address}>{restaurant.address}</span>
                </div>
              </div>
              <Grid container style={{ marginTop: '10px' }}>
                {itemSelected &&
                  itemSelected.length > 0 &&
                  itemSelected.map(value => {
                    return this.renderItem(value)
                  })}
              </Grid>
              <div className={classes.shippingBox}>
                <div style={{ width: '95px' }} />
                <div className={classes.shippingContent}>
                  <span>{orderText.shippingFee}</span>
                  <span>
                    {isHideShip ? `別途` : `${this.convertPrice(parseInt(shippingFee))} VND`}
                  </span>
                </div>
              </div>
              <div className={classes.totalBox}>
                <div style={{ width: '40px' }} />
                <div className={classes.shippingContent} style={{ fontSize: '21px' }}>
                  <span>{orderText.grandTotal}</span>
                  <span>{`${this.convertPrice(
                    total + (isHideShip ? 0 : parseInt(shippingFee))
                  )} VND`}</span>
                </div>
              </div>
              <div style={{ marginTop: '20px' }} className="fluid-pc">
                <p className={classes.textItem} style={{ textAlign: 'center' }}>
                {orderText.orderInformation}
                </p>

                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{orderText.labelName}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={name}
                      error={!!errorName}
                      onChange={this.onChangeText}
                      type="text"
                      name="name"
                      maxLength={3}
                      className={classes.input}
                    />
                    {errorName && <span className={classes.error}>{errorName}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{orderText.labelPhone}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={phone}
                      error={!!errorPhone}
                      onChange={this.onChangeText}
                      type="text"
                      name="phone"
                      className={classes.input}
                    />
                    {errorPhone && <span className={classes.error}>{errorPhone}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{orderText.labelAddress}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={address}
                      error={!!errorAddress}
                      onChange={this.onChangeText}
                      type="text"
                      name="address"
                      multiline
                      rows={2}
                      className={classes.input}
                    />
                    {errorAddress && <span className={classes.error}>{errorAddress}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{orderText.labelMethod}</span>
                  <div className={classes.inputContainer}>
                    <RadioGroup value={typePicker} onChange={this.handleChangeRadio}>
                      <FormControlLabel
                        classes={{ label: 'radio-label' }}
                        value="delivery"
                        control={<Radio size="small" />}
                        label="デリバリー"
                      />
                      <FormControlLabel
                        classes={{ label: 'radio-label' }}
                        value="pick_up"
                        control={<Radio size="small" />}
                        label="お持ち帰り"
                      />
                    </RadioGroup>
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span style={{ maxWidth: '35%' }} className={classes.textItem}>
                  {orderText.labelTime}
                  </span>
                  <div className={classes.inputContainer}>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <TimePicker
                      error={false}
                      helperText=""
                      ampm={false}
                      value={timePicker}
                      placeholder="hh/mm"
                      format="HH:mm"
                      onChange={this.onChangeTimePicker}
                      style={{width:'50%'}}
                      // onBlur={this.onBlurStartTime}
                    />
                      <Button
                        variant="contained"
                        color="primary"
                        className="btn-login"
                        onClick={this.onClearTime}
                        style={{ backgroundColor: 'red', marginLeft:'20px' }}
                      >
                        {orderText.clear}
                      </Button>
                    </div>

                    {errorTime && <span className={classes.error}>{errorTime}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{orderText.labelEmail}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={email}
                      error={!!errorEmail}
                      onChange={this.onChangeText}
                      type="email"
                      name="email"
                      className={classes.input}
                    />
                    {errorEmail && <span className={classes.error}>{errorEmail}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem} style={{ maxWidth: '35%' }}>
                  {orderText.labelNote}
                  </span>

                  <div className={classes.inputContainer}>
                    <Input
                      value={note}
                      error={!!errorNote}
                      onChange={this.onChangeText}
                      type="text"
                      name="note"
                      multiline
                      rows={4}
                      className={classes.input}
                    />
                    {errorNote && <span className={classes.error}>{errorNote}</span>}
                  </div>
                </div>
              </div>
              <div
                style={{ width: '100%', height: '60px', marginTop: '10px' }}
                className="fluid-pc"
              >
                <p style={{ fontSize: '9px', lineHeight: '15px' }}>
                {orderText.note}
                </p>
              </div>
              <div style={{ width: '100%', height: '100px' }} />
            </Container>
          )}
          <div className={classes.btnContainer}>
            {isSuccess ? (
              <span>{orderText.success}</span>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className="btn-login"
                onClick={this.onSubmitForm}
                style={{ backgroundColor: '#F7941D' }}
              >
                {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `注文`}
              </Button>
            )}
          </div>
          <Dialog onClose={this.handleClose} style={{ width: '100%' }} open={isOpenPopup}>
            <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            {orderText.dialogSuccess.header}
            </p>
            <span style={{ textAlign: 'center', margin: '0px 20px', fontSize: '12px' }}>
            {orderText.dialogSuccess.text1}
            </span>
            <span style={{ textAlign: 'center', margin: '0px 20px', fontSize: '12px' }}>
            {orderText.dialogSuccess.text2}
            </span>
            <div
              style={{
                width: '100%',
                margin: '20px 0px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                className="btn-login"
                onClick={this.handleClose}
                style={{ backgroundColor: '#F7941D' }}
              >
                Ok
              </Button>
            </div>
          </Dialog>
          <Dialog onClose={this.handleCloseWarning} style={{ width: '100%' }} open={isOpenWarning}>
            <p
              style={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '10px 40px',
              }}
            >
              {orderText.dialogFailed.header}
            </p>
            <span style={{ textAlign: 'center', fontSize: '12px' }}>{orderText.dialogFailed.text}</span>
            <div
              style={{
                width: '100%',
                margin: '20px 0px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                className="btn-login"
                onClick={this.handleCloseWarning}
                style={{ backgroundColor: '#F7941D' }}
              >
                Ok
              </Button>
            </div>
          </Dialog>
        </div>
      </MuiPickersUtilsProvider>
    )
  }
}

Index.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  classes: PropTypes.any,
}

export default withStyles(styles)(Index)
