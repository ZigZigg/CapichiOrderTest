/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../assets/jss/material-dashboard-react/views/retaurantStyles'
import circlePlus from '../../assets/img/circle-plus.png'
import circleMinus from '../../assets/img/circle-minus.png'

class MenuItem extends PureComponent {
  constructor(props) {
    super(props)
    const { item } = props
    this.state = {
      count: item && item.count ? item.count : 0,
    }
  }

  // componentDidMount() {
  //   const { item, onSetOrder } = this.props

  //   if (item && item.count && onSetOrder) {
  //     console.log({ item })
  //     onSetOrder(item)
  //   }
  // }

  onClickItem = () => {
    const { onClick, item } = this.props
    if (onClick) onClick(item)
  }

  onSetCount = type => {
    const { count } = this.state
    const { onSetOrder, item } = this.props
    const countSet = type ? count + 1 : count - 1
    this.setState({
      count: countSet,
    })
    const itemSelected = { ...item, count: countSet }
    if (onSetOrder) onSetOrder(itemSelected)
  }

  addFunction = () => {
    console.log('add function')
  }

  converCurrency = price => {
    const priceFormat = price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
    return `${priceFormat}VND`
  }

  render() {
    const { classes, item } = this.props
    const { count } = this.state
    return (
      <Grid onClick={this.onClickItem} item xs={12} md={6} lg={3} className={classes.itemMenu}>
        <div style={{ width: '60px', height: '60px' }}>
          <img src={item.image} alt="name" className={classes.imageMenu} />
        </div>

        <div className={classes.content}>
          <span className={classes.textContent}>{item.name}</span>
          <span className={classes.textContent}>{this.converCurrency(item.price)}</span>
        </div>
        <div className={classes.action}>
          {/* <img /> */}
          {count > 0 && (
            <img
              src={circleMinus}
              alt="minus"
              onClick={() => this.onSetCount(false)}
              className={classes.imgIcon}
            />
          )}
          {count > 0 && <span style={{ margin: '0 10px' }}>{count}</span>}
          <img
            src={circlePlus}
            alt="plus"
            onClick={() => this.onSetCount(true)}
            className={classes.imgIcon}
          />
        </div>
      </Grid>
    )
  }
}

MenuItem.propTypes = {
  classes: PropTypes.any,
  onClick: PropTypes.func,
  onSetOrder: PropTypes.func,
  item: PropTypes.any,
}

export default withStyles(styles)(MenuItem)
