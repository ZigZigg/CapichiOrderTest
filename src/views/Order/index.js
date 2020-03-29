/* eslint-disable radix */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowLeft, LocationOn } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import moment from 'moment'
// import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import Dialog from '@material-ui/core/Dialog'
import classNames from 'classnames'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
import { getRestaurantDetail, confirmOrder, getListMenuByRestaurant } from '../../api'
import {
  validateEmail,
  validateAddress,
  validateName,
  validateNote,
  validatePhone,
} from '../../commons'

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
      isOpenPopup: false,
      isOpenWarning: false,
      isSuccess: false,
      errorName: '',
      errorPhone: '',
      errorEmail: '',
      errorAddress: '',
      errorNote: '',
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
      <Grid key={item.id} item xs={12} md={6} lg={3} className={classes.itemOrder}>
        <div style={{ width: '60px', height: '60px' }}>
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
    } = this.state
    if (address === '' || phone === '' || name === '') {
      this.setState({
        errorName: name === '' ? 'お客様の名前を入力してください' : '',
        errorPhone: phone === '' ? '電話番号を入力してください' : '',
        errorAddress: address === '' ? '住所を入力してください' : '',
      })
      return
    }
    if (errorAddress || errorPhone || errorName || errorEmail || errorNote) {
      return
    }
    this.onConfirmOrder()

    // this.setState({
    //   isOpenPopup: true,
    // })
  }

  onConfirmOrder = async () => {
    const { restaurant, pages, itemSelected, name, phone, email, address, note } = this.state
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
          arraySelect.push(selectValue)
        })

        const filterSelected = _.filter(arraySelect, value => !value.active)
        const dataRestaurant = await getRestaurantDetail({ restaurantId: restaurant.id })
        let isOpen = true
        if (dataRestaurant.data) {
          const currentTime = moment().format('HH:MM')
          const convertCurrentTime = moment(currentTime, 'hh:mm')
          const openTime = moment(dataRestaurant.data.open_time, 'hh:mm')
          const closeTime = moment(dataRestaurant.data.closed_time, 'hh:mm')
          isOpen = convertCurrentTime.isBefore(closeTime) && convertCurrentTime.isAfter(openTime)
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

  isRestaurantOpen = () => {
    const { restaurant } = this.state
    if (restaurant) {
      const currentTime = moment().format('HH:MM')
      const convertCurrentTime = moment(currentTime, 'hh:mm')
      const openTime = moment(restaurant.open_time, 'hh:mm')
      const closeTime = moment(restaurant.closed_time, 'hh:mm')
      const isOpen = convertCurrentTime.isBefore(closeTime) && convertCurrentTime.isAfter(openTime)
      return isOpen
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
      name,
      phone,
      address,
      email,
      note,
      isOpenPopup,
      isOpenWarning,
      isSuccess,
    } = this.state
    const total = _.reduce(
      itemSelected,
      (sum, item) => {
        return sum + item.price * item.count
      },
      0
    )
    return (
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <KeyboardArrowLeft
            onClick={this.onGoBack}
            style={{ fontSize: '40px', marginLeft: '10px' }}
          />
          <span className={classes.headerLabel}>注文内容確認</span>
          <div style={{ marginRight: '24px', width: '30px' }} />
        </div>
        {restaurant && (
          <div className={classes.container}>
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
                <span>{`${this.convertPrice(parseInt(restaurant.fee))} VND`}</span>
              </div>
            </div>
            <div className={classes.totalBox}>
              <div style={{ width: '40px' }} />
              <div className={classes.shippingContent} style={{ fontSize: '21px' }}>
                <span>合計</span>
                <span>{`${this.convertPrice(total + parseInt(restaurant.fee))} VND`}</span>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
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
            <div style={{ width: '100%', height: '60px', marginTop: '10px' }}>
              <p style={{ fontSize: '9px' }}>
                (メールアドレス〜届きます)→入力されたメールアドレス宛に注文の状況、配達状況などが随時確認のために送信されます)
              </p>
            </div>
            <div style={{ width: '100%', height: '100px' }} />
          </div>
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
              onClick={this.handleClose}
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
