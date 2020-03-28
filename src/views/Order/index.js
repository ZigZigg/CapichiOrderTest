/* eslint-disable radix */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowLeft, LocationOn } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
// import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
import { getRestaurantDetail } from '../../api'
import { validateEmail } from '../../commons'

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
      [name]: value.trim(),
    })
    console.log(value)
    if (name === 'email') {
      this.setState({
        error: {
          email: validateEmail(value),
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
    const rowTotalPrice = item.count * item.price
    return (
      <Grid item xs={12} md={6} lg={3} className={classes.itemOrder}>
        <div style={{ width: '60px', height: '60px' }}>
          <img src={item.image} alt={item.name} className={classes.imgItem} />
        </div>
        <div className={classes.itemContent}>
          <div className={classes.nameItem}>
            <span className={classes.textItem}>{item.name}</span>
            <span className={classes.textItem}>{`${this.convertPrice(item.price)}VND`}</span>
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

  onSubmitForm = () => {
    this.setState({
      isOpenPopup: true,
    })
  }

  handleClose = () => {
    this.setState({
      isOpenPopup: false,
    })
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
          <span className={classes.headerLabel}>Order Detail</span>
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
                <span>Shipping fee</span>
                <span>{`${this.convertPrice(parseInt(restaurant.fee))} VND`}</span>
              </div>
            </div>
            <div className={classes.totalBox}>
              <div style={{ width: '40px' }} />
              <div className={classes.shippingContent} style={{ fontSize: '21px' }}>
                <span>Grand total</span>
                <span>{`${this.convertPrice(total + parseInt(restaurant.fee))} VND`}</span>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <p className={classes.textItem} style={{ textAlign: 'center' }}>
                Confirm order information
              </p>

              <div className={classes.inputBox}>
                <span className={classes.textItem}>Name</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={name}
                    onChange={this.onChangeText}
                    type="text"
                    name="name"
                    className={classes.input}
                  />
                  {error && error.name && <span className={classes.error}>{error.name}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>Phone number</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={phone}
                    onChange={this.onChangeText}
                    type="number"
                    name="phone"
                    className={classes.input}
                  />
                  {error && error.phone && <span className={classes.error}>{error.phone}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>Address</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={address}
                    onChange={this.onChangeText}
                    type="text"
                    name="address"
                    className={classes.input}
                  />
                  {error && error.address && <span className={classes.error}>{error.address}</span>}
                </div>
              </div>
              <div className={classes.inputBox}>
                <span className={classes.textItem}>Email</span>
                <div className={classes.inputContainer}>
                  <Input
                    value={email}
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
            <div style={{ width: '100%', height: '60px', marginTop: '10px' }} />
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
            {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `Submit order`}
          </Button>
        </div>
        <Dialog onClose={this.handleClose} style={{ width: '100%' }} open={isOpenPopup}>
          <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
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
