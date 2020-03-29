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
    this.setState({
      [name]: value,
    })
    if (name === 'email') {
      this.setState({
        error: {
          email: validateEmail(value),
        },
      })
    }
    if (name === 'name') {
      this.setState({
        error: {
          name: validateName(value),
        },
      })
    }
    if (name === 'phone') {
      this.setState({
        error: {
          phone: validatePhone(value),
        },
      })
    }
    if (name === 'address') {
      this.setState({
        error: {
          address: validateAddress(value),
        },
      })
    }
    if (name === 'note') {
      this.setState({
        error: {
          note: validateNote(value),
        },
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
      <Grid item xs={12} md={6} lg={3} className={classes.itemOrder}>
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
    const { name, phone, email, address, note, itemSelected, restaurant } = this.state
    if (name === '') {
      this.setState({
        error: {
          name: 'Please input Customer name',
        },
      })
      return
    }
    if (phone === '') {
      this.setState({
        error: {
          phone: 'Please input Phone number',
        },
      })
      return
    }
    if (address === '') {
      this.setState({
        error: {
          address: 'Please input Address',
        },
      })
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
        if (filterSelected.length > 0) {
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
    const { history } = this.props
    this.setState({
      isOpenPopup: false,
    })
    history.push('/category')
  }

  handleCloseWarning = () => {
    const { history } = this.props
    this.setState({
      isOpenWarning: false,
    })
    history.push('/category')
  }

  render() {
    const { classes } = this.props
    const {
      itemSelected,
      restaurant,
      isLoadingSubmit,
      error,
      name,
      phone,
      address,
      email,
      note,
      isOpenPopup,
      isOpenWarning,
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
                <span className={classes.textItem}>名前</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={name}
                    error={error && error.name}
                    onChange={this.onChangeText}
                    type="text"
                    name="name"
                    maxLength={3}
                    className={classes.input}
                  />
                  {error && error.name && <span className={classes.error}>{error.name}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>電話番号</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={phone}
                    error={error && error.phone}
                    onChange={this.onChangeText}
                    type="number"
                    name="phone"
                    className={classes.input}
                  />
                  {error && error.phone && <span className={classes.error}>{error.phone}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>住所</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={address}
                    error={error && error.address}
                    onChange={this.onChangeText}
                    type="text"
                    name="address"
                    className={classes.input}
                  />
                  {error && error.address && <span className={classes.error}>{error.address}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>メアド</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={email}
                    error={error && error.email}
                    onChange={this.onChangeText}
                    type="email"
                    name="email"
                    className={classes.input}
                  />
                  {error && error.email && <span className={classes.error}>{error.email}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>Note</span>

                <div className={classes.inputContainer}>
                  <Input
                    value={note}
                    error={error && error.note}
                    onChange={this.onChangeText}
                    type="text"
                    name="note"
                    multiline
                    rows={3}
                    className={classes.input}
                  />
                </div>
              </div>
            </div>
            <div style={{ width: '100%', height: '60px', marginTop: '10px' }}>
              <p style={{ fontSize: '9px' }}>
                (メールアドレスを入力すれば注文情報が確認としてメールに届きます)
              </p>
            </div>
            <div style={{ width: '100%', height: '100px' }} />
          </div>
        )}
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="primary"
            className="btn-login"
            onClick={this.onSubmitForm}
            style={{ backgroundColor: '#F7941D' }}
          >
            {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `注文`}
          </Button>
        </div>
        <Dialog onClose={this.handleClose} style={{ width: '100%' }} open={isOpenPopup}>
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Order success</p>
          <span style={{ textAlign: 'center', margin: '0px 20px' }}>
            Your order information will be sent to your email
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
            Submit order failed
          </p>
          <span style={{ textAlign: 'center' }}>Please order again!</span>
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
