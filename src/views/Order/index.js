/* eslint-disable radix */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { KeyboardArrowLeft, LocationOn } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import moment from 'moment'
// import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import ReactInputMask from 'react-input-mask'
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
import { Container } from '@material-ui/core'
import { isMobileOnly, isTablet, isBrowser, isMobile } from 'react-device-detect'
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
        errorName: name.trim().length === 0 ? 'お客様の名前を入力してください' : '',
        errorPhone: phone.length === 0 ? '電話番号を入力してください' : '',
        errorAddress: address.trim().length === 0 ? '住所を入力してください' : '',
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
    const { value } = e.nativeEvent.target
    if (Number(value[1]) > 3 && Number(value[0]) >= 2) return
    if (Number(value[0]) >= 3) return
    if (Number(value[0]) === 2 && Number(value[1]) > 3) {
      return
    }

    if (Number(value[3] > 5)) return

    this.setState({ time: value, errorTime: '' })
  }

  onBlurStartTime = () => {
    const { time, restaurant } = this.state
    const currentTime = moment().format('HH:mm')
    const convertCurrentTime = moment(currentTime, 'HH:mm')
    const inputTime = moment(time, 'HH:mm')
    const checkTime = time.match(/_/g) && time.match(/_/g).length < 4
    if (time.match(/_/g) && time.match(/_/g).length === 4) {
      this.setState({
        time: '',
      })
    }
    if (time && !/_/.test(time)) {
      const check = inputTime.isBefore(convertCurrentTime)
      if (check) {
        this.setState({
          errorTime: '配達時間は現在の時間より長くなければなりません',
        })
        return
      }
    }
    if (/_/.test(time) && checkTime) {
      this.setState({
        errorTime: '正しい時間を記入してください',
      })
      return
    }
    const timeAvailable = checkAvailableTime(restaurant.active_time_csv, time)
    if (time && !timeAvailable && !time.match(/_/g)) {
      this.setState({
        errorTime: '営業時間内の時間を記入してください',
      })
    }
  }

  handleChangeRadio = event => {
    const { value } = event.target
    this.setState({
      typePicker: value,
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
      <div className={classes.wrapper}>
        <Container
          className={classes.header}
          style={{ position: isBrowser && 'inherit', padding: '0' }}
        >
          <KeyboardArrowLeft
            onClick={this.onGoBack}
            style={{ fontSize: '40px', marginLeft: '10px' }}
          />
          <span className={classes.headerLabel}>注文内容確認</span>
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
                <span>配送代</span>
                <span>
                  {isHideShip ? `別途` : `${this.convertPrice(parseInt(shippingFee))} VND`}
                </span>
              </div>
            </div>
            <div className={classes.totalBox}>
              <div style={{ width: '40px' }} />
              <div className={classes.shippingContent} style={{ fontSize: '21px' }}>
                <span>合計</span>
                <span>{`${this.convertPrice(
                  total + (isHideShip ? 0 : parseInt(shippingFee))
                )} VND`}</span>
              </div>
            </div>
            <div style={{ marginTop: '20px' }} className="fluid-pc">
              <p className={classes.textItem} style={{ textAlign: 'center' }}>
                注文者情報入力
              </p>

              <div className={classes.inputBox}>
                <span className={classes.textItem}>名前*</span>
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
                <span className={classes.textItem}>電話番号*</span>
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
                <span className={classes.textItem}>住所*</span>
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
                <span className={classes.textItem}>受取方法</span>
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
                  受取希望時間（特に指定がなく最速で受け取りたい場合は何も入力しないでください)
                </span>
                <div className={classes.inputContainer}>
                  <ReactInputMask
                    mask="99:99"
                    onChange={e => this.onChangeStartTime(e)}
                    onBlur={() => this.onBlurStartTime()}
                    value={time}
                    style={{ width: '40%' }}
                  >
                    {() => (
                      <Input
                        type="text"
                        name="name"
                        placeholder="hh/mm"
                        maxLength={3}
                        className={classes.input}
                      />
                    )}
                  </ReactInputMask>
                  {errorTime && <span className={classes.error}>{errorTime}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>メールアドレス</span>
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
                  追記事項(特定の食材抜き、配達時間の指定などの特別な注文はこちらに記入してください
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
            <div style={{ width: '100%', height: '60px', marginTop: '10px' }} className="fluid-pc">
              <p style={{ fontSize: '9px', lineHeight: '15px' }}>
                入力していたいただいたメールアドレス宛に注文状況、配達状況などをメールでリアルタイムに共有します。
              </p>
            </div>
            <div style={{ width: '100%', height: '100px' }} />
          </Container>
        )}
        <div className={classes.btnContainer}>
          {isSuccess ? (
            <span>注文は完了しました</span>
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
            注文は完了しました
          </p>
          <span style={{ textAlign: 'center', margin: '0px 20px', fontSize: '12px' }}>
            あなたの注文情報はレストランに送信されました
          </span>
          <span style={{ textAlign: 'center', margin: '0px 20px', fontSize: '12px' }}>
            レストランの確認をお待ちください
          </span>
          <div
            style={{ width: '100%', margin: '20px 0px', display: 'flex', justifyContent: 'center' }}
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
            注文に失敗しました
          </p>
          <span style={{ textAlign: 'center', fontSize: '12px' }}>もう一度試してください!</span>
          <div
            style={{ width: '100%', margin: '20px 0px', display: 'flex', justifyContent: 'center' }}
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
    )
  }
}

Index.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  classes: PropTypes.any,
}

export default withStyles(styles)(Index)
