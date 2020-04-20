/* eslint-disable radix */
/* eslint-disable  no-nested-ternary */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { LocationOn } from '@material-ui/icons'
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

import { Container } from '@material-ui/core'
import { isBrowser } from 'react-device-detect'

import * as firebase from 'firebase/app'
import 'firebase/analytics'
import {
  validateEmail,
  validateAddress,
  validateName,
  validateNote,
  validatePhone,
  getTimeRange,
  checkAvailableTime,
  isDevelopEnvironment,
} from '../../commons'
import '../../assets/css/Order/styles.css'
import { I18n } from '../../config'
import AutoFillForm from './AutoFillForm'
import { getRestaurantDetail, confirmOrder, getListMenuByRestaurant } from '../../api'
import Header from '../../components/Header'
import LanguageBox from '../../components/LanguageBox'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
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
      timePicker: null,
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
      suggestEnable: '',
      dataAutofill: [],
      localeSelect: null,
    }
  }

  componentDidMount() {
    if (isDevelopEnvironment()) {
      firebase.analytics().logEvent('order_view_debug')
    } else {
      firebase.analytics().logEvent('order_view')
    }
    // const formData = [
    //   {
    //     name:'Zig',
    //     address:'Ha noi',
    //     phone:'90039302930923'
    //   }
    // ]
    // localStorage.setItem('form_data', JSON.stringify(formData))
    const dataSuggest = localStorage.getItem('DATA_SUGGEST')
    if (dataSuggest) {
      const dataFormat = JSON.parse(dataSuggest)
      if (dataFormat.length > 0) {
        this.onSetDefaultData(dataFormat)
      }
    }
    this.onGetRestaurantDetail()
  }

  onSetDefaultData = dataSuggest => {
    const { name, phone, address, email } = dataSuggest[dataSuggest.length - 1]
    this.setState({
      name,
      phone,
      address,
      email,
    })
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
        suggestEnable: '',
      })
    }
    if (name === 'name') {
      this.setState({
        [name]: value,
        errorName: validateName(value),
        suggestEnable: '',
      })
    }
    if (name === 'phone') {
      this.setState({
        [name]: value.replace(/[\D]/g, ''),
        errorPhone: validatePhone(value.replace(/[\D]/g, '')),
        suggestEnable: '',
      })
    }
    if (name === 'address') {
      this.setState({
        [name]: value,
        errorAddress: validateAddress(value),
        suggestEnable: '',
      })
    }
    if (name === 'note') {
      this.setState({
        [name]: value,
        errorNote: validateNote(value),
        suggestEnable: '',
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
        errorName: name.trim().length === 0 ? 'orderText.error.name' : '',
        errorPhone: phone.length === 0 ? 'orderText.error.phone' : '',
        errorAddress: address.trim().length === 0 ? 'orderText.error.address' : '',
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
            if (isDevelopEnvironment()) {
              firebase.analytics().logEvent('order_submit_success_debug', {
                name: name.trim(),
                phone,
                email: email.trim(),
                address: address.trim(),
                restaurantId: restaurant.id,
              })
            } else {
              firebase.analytics().logEvent('order_submit_success', {
                name: name.trim(),
                phone,
                email: email.trim(),
                address: address.trim(),
                restaurantId: restaurant.id,
              })
            }
            const dataFill = {
              name: name.trim(),
              phone,
              email: email.trim(),
              address: address.trim(),
            }
            this.onSetAutoFill(dataFill)
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

  onSetAutoFill = data => {
    const dataSuggest = localStorage.getItem('DATA_SUGGEST')
    const dataSuggestFormat = JSON.parse(dataSuggest)
    if (!dataSuggestFormat) {
      const dataArray = []
      dataArray.push(data)

      localStorage.setItem('DATA_SUGGEST', JSON.stringify(dataArray))
    } else if (dataSuggestFormat.length > 0) {
      const { name, phone, address, email } = data
      const findItem = _.find(
        dataSuggestFormat,
        value =>
          _.isEqual(value.name, name) &&
          _.isEqual(value.phone, phone) &&
          _.isEqual(value.address, address) &&
          _.isEqual(value.email, email)
      )
      if (!findItem) {
        dataSuggestFormat.push(data)
        localStorage.setItem('DATA_SUGGEST', JSON.stringify(dataSuggestFormat))
      }
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
    // const value = moment(e).format('HH:mm')
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
    // const currentTime = moment().format('HH:mm')
    // const convertCurrentTime = moment(currentTime, 'HH:mm')
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
    // if (/_/.test(inputTime) && checkTime) {
    //   this.setState({
    //     errorTime: I18n.t('orderText.error.timeFormat'),
    //   })
    //   return
    // }
    const timeAvailable = checkAvailableTime(restaurant.active_time_csv, inputTime)
    if (inputTime && !timeAvailable && !inputTime.match(/_/g)) {
      this.setState({
        errorTime: I18n.t('orderText.error.timeOpen'),
      })
    }
  }

  handleChangeRadio = event => {
    const { value } = event.target
    this.setState({
      typePicker: value,
    })
  }

  onChangeTimePicker = date => {
    const { restaurant } = this.state
    const dateFormat = moment(date).format('HH:mm')
    this.setState({
      timePicker: date,
      time: dateFormat,
    })
    // const currentTime = moment().format('HH:mm')
    // const convertCurrentTime = moment(currentTime, 'HH:mm')
    const inputTime = `${dateFormat}`
    const timeAvailable = checkAvailableTime(restaurant.active_time_csv, inputTime)
    if (inputTime && !timeAvailable) {
      this.setState({
        errorTime: 'orderText.error.timeOpen',
      })
    } else {
      this.setState({
        errorTime: '',
      })
    }
  }

  onClearTime = () => {
    this.setState({
      timePicker: null,
      errorTime: '',
      time: '',
    })
  }

  onFocusInput = e => {
    const { name } = e.nativeEvent.target
    const dataAutofill = localStorage.getItem('DATA_SUGGEST')
    this.setState({
      suggestEnable: name,
      dataAutofill: JSON.parse(dataAutofill),
    })
  }

  onClickOutside = () => {
    this.setState({
      suggestEnable: '',
    })
  }

  autoFillInput = value => {
    const { errorName, errorPhone, errorAddress, errorEmail } = this.state
    const { name, phone, address, email } = value
    this.setState({
      name,
      phone,
      address,
      email,
      errorName: name.length > 0 ? validateName(name) : errorName,
      errorPhone: phone.length > 0 ? validatePhone(phone) : errorPhone,
      errorAddress: address.length > 0 ? validateAddress(address) : errorAddress,
      errorEmail: email.length > 0 ? validateEmail(email) : errorEmail,
    })
  }

  onClearFormData = () => {
    this.setState({
      name: '',
      phone: '',
      address: '',
      email: '',
    })
  }

  onChangeLanguage = locale => {
    this.setState({
      localeSelect: locale,
      // errorName:errorName !== '' ? I18n.t('orderText.error.name') : ''
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
      typePicker,
      timePicker,
      suggestEnable,
      dataAutofill,
    } = this.state
    console.log(errorName)
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
          <Header
            onGoBack={this.onGoBack}
            headerText={I18n.t('orderText.header')}
            rightComponent={<LanguageBox onChangeLanguage={this.onChangeLanguage} />}
          />
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
                  <span>{I18n.t('orderText.shippingFee')}</span>
                  <span>
                    {isHideShip
                      ? I18n.t('orderText.freeShip')
                      : `${this.convertPrice(parseInt(shippingFee))} VND`}
                  </span>
                </div>
              </div>
              <div className={classes.totalBox}>
                <div style={{ width: '40px' }} />
                <div className={classes.shippingContent} style={{ fontSize: '21px' }}>
                  <span>{I18n.t('orderText.grandTotal')}</span>
                  <span>{`${this.convertPrice(
                    total + (isHideShip ? 0 : parseInt(shippingFee))
                  )} VND`}</span>
                </div>
              </div>
              <form
                method="post"
                style={{ marginTop: '20px' }}
                className="fluid-pc"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              >
                <p className={classes.textItem} style={{ textAlign: 'center' }}>
                  {I18n.t('orderText.orderInformation')}
                </p>
                {/* DONT TOUCH */}
                <Input
                  value={name}
                  error={!!errorName}
                  onChange={this.onChangeText}
                  type="text"
                  name="name"
                  onFocus={this.onFocusInput}
                  style={{ display: 'none' }}
                  placeholder={I18n.t('orderText.labelName')}
                  autoComplete="off"
                />
                {/* THIS INPUT */}
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{I18n.t('orderText.labelName')}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={name}
                      error={!!errorName}
                      onChange={this.onChangeText}
                      type="text"
                      name="name"
                      onFocus={this.onFocusInput}
                      className={classes.input}
                      placeholder={I18n.t('orderText.labelName')}
                      autoComplete="new-password"
                    />
                    {suggestEnable === 'name' && dataAutofill && dataAutofill.length > 0 && (
                      <AutoFillForm
                        onClearFormData={this.onClearFormData}
                        autoFillInput={this.autoFillInput}
                        dataAutofill={dataAutofill}
                        onClickOutside={this.onClickOutside}
                      />
                    )}

                    {errorName && <span className={classes.error}>{I18n.t(errorName)}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{I18n.t('orderText.labelPhone')}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={phone}
                      error={!!errorPhone}
                      onChange={this.onChangeText}
                      type="text"
                      name="phone"
                      onFocus={this.onFocusInput}
                      className={classes.input}
                      placeholder={I18n.t('orderText.labelPhone')}
                      autoComplete="new-password"
                    />
                    {suggestEnable === 'phone' && dataAutofill && dataAutofill.length > 0 && (
                      <AutoFillForm
                        onClearFormData={this.onClearFormData}
                        autoFillInput={this.autoFillInput}
                        dataAutofill={dataAutofill}
                        onClickOutside={this.onClickOutside}
                      />
                    )}
                    {errorPhone && <span className={classes.error}>{I18n.t(errorPhone)}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{I18n.t('orderText.labelAddress')}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={address}
                      error={!!errorAddress}
                      onChange={this.onChangeText}
                      type="text"
                      name="address"
                      multiline
                      rows={2}
                      onFocus={this.onFocusInput}
                      className={classes.input}
                      placeholder={I18n.t('orderText.labelAddress')}
                      autoComplete="new-password"
                    />
                    {suggestEnable === 'address' && dataAutofill && dataAutofill.length > 0 && (
                      <AutoFillForm
                        onClearFormData={this.onClearFormData}
                        autoFillInput={this.autoFillInput}
                        dataAutofill={dataAutofill}
                        onClickOutside={this.onClickOutside}
                      />
                    )}
                    {errorAddress && <span className={classes.error}>{I18n.t(errorAddress)}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{I18n.t('orderText.labelMethod')}</span>
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
                    {I18n.t('orderText.labelTime')}
                  </span>
                  <div className={classes.inputContainer}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <TimePicker
                        error={false}
                        helperText=""
                        ampm={false}
                        value={timePicker}
                        placeholder="HH:MM"
                        format="HH:mm"
                        onChange={this.onChangeTimePicker}
                        style={{ width: '50%' }}
                        // onBlur={this.onBlurStartTime}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className="btn-login"
                        onClick={this.onClearTime}
                        style={{ backgroundColor: 'red', marginLeft: '20px' }}
                      >
                        {I18n.t('orderText.clear')}
                      </Button>
                    </div>

                    {errorTime && <span className={classes.error}>{I18n.t(errorTime)}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem}>{I18n.t('orderText.labelEmail')}</span>
                  <div className={classes.inputContainer}>
                    <Input
                      value={email}
                      error={!!errorEmail}
                      onChange={this.onChangeText}
                      type="email"
                      name="email"
                      onFocus={this.onFocusInput}
                      className={classes.input}
                      placeholder={I18n.t('orderText.labelEmail')}
                      autoComplete="new-password"
                    />
                    {suggestEnable === 'email' && dataAutofill && dataAutofill.length > 0 && (
                      <AutoFillForm
                        onClearFormData={this.onClearFormData}
                        autoFillInput={this.autoFillInput}
                        dataAutofill={dataAutofill}
                        onClickOutside={this.onClickOutside}
                      />
                    )}
                    {errorEmail && <span className={classes.error}>{I18n.t(errorEmail)}</span>}
                  </div>
                </div>
                <div className={classes.inputBox}>
                  <span className={classes.textItem} style={{ maxWidth: '35%' }}>
                    {I18n.t('orderText.labelNote')}
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
                      autoComplete="off"
                    />
                    {errorNote && <span className={classes.error}>{I18n.t(errorNote)}</span>}
                  </div>
                </div>
              </form>
              <div
                style={{ width: '100%', height: '60px', marginTop: '10px' }}
                className="fluid-pc"
              >
                <p style={{ fontSize: '9px', lineHeight: '15px' }}>{I18n.t('orderText.note')}</p>
              </div>
              <div style={{ width: '100%', height: '100px' }} />
            </Container>
          )}
          <div className={classes.btnContainer}>
            {isSuccess ? (
              <span>{I18n.t('orderText.success')}</span>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className="btn-login"
                onClick={this.onSubmitForm}
                style={{ backgroundColor: '#F7941D' }}
              >
                {isLoadingSubmit ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  I18n.t('orderText.submit')
                )}
              </Button>
            )}
          </div>
          <Dialog onClose={this.handleClose} style={{ width: '100%' }} open={isOpenPopup}>
            <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              {I18n.t('orderText.dialogSuccess.header')}
            </p>
            <span style={{ textAlign: 'center', margin: '0px 20px', fontSize: '12px' }}>
              {I18n.t('orderText.dialogSuccess.text1')}
            </span>
            <span style={{ textAlign: 'center', margin: '0px 20px', fontSize: '12px' }}>
              {I18n.t('orderText.dialogSuccess.text2')}
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
              {I18n.t('orderText.dialogFailed.header')}
            </p>
            <span style={{ textAlign: 'center', fontSize: '12px' }}>
              {I18n.t('orderText.dialogFailed.text')}
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
