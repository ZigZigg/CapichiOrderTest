/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import { AddCircle, RemoveCircle } from '@material-ui/icons'
import classNames from 'classnames'
import { isMobileOnly, isTablet, isBrowser, isMobile } from 'react-device-detect'
import _ from 'lodash'
import styles from '../../assets/jss/material-dashboard-react/views/retaurantStyles'

class MenuItem extends PureComponent {
  constructor(props) {
    super(props)
    const { item } = props
    this.state = {
      count: item && item.count ? item.count : 0,
    }
  }

  componentDidMount() {
    if (isBrowser) {
      const { item, listItemSelected } = this.props
      // console.log("MenuItem -> componentDidMount -> listItemSelected", listItemSelected)
      let itemData = null
      if (listItemSelected.length > 0) {
        itemData = _.find(listItemSelected, { id: item.id })
      }
      this.setState({
        count: itemData ? itemData.count : 0,
      })
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { item } = this.props
  //   const { listItemSelected } = nextProps
  //   console.log("MenuItem -> UNSAFE_componentWillReceiveProps -> listItemSelected", listItemSelected)
  //   if (item && !_.isEqual(item, nextProps.item)) {
  //     console.log('EQUA:L::123')
  //     let itemData = null
  //     if (listItemSelected.length > 0) {
  //       itemData = _.find(listItemSelected, { id: nextProps.item.id })
  //     }
  //     console.log({itemData})
  //     this.setState({
  //       count: itemData ? itemData.count : 0,
  //     })
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
      count: countSet <= 99 ? countSet : 99,
    })
    const itemSelected = { ...item, count: countSet <= 99 ? countSet : 99 }
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
      <Grid
        id="restaurant-grid-item"
        onClick={this.onClickItem}
        item
        xs={12}
        md={6}
        lg={4}
        className={classNames({ [classes.gridItem]: isBrowser })}
      >
        <div className={classNames({ [classes.itemMenu]: true, 'item-menu': true })}>
          <div className={classNames({ [classes.imgView]: true, 'img-view': isBrowser })}>
            <img src={item.image} alt="name" className={classes.imageMenu} />
          </div>

          <div className={classes.content}>
            <span className={classes.textContent} style={{ marginTop: '10px' }}>
              {item.name}
            </span>
            <span className={classes.textContent}>{this.converCurrency(item.price)}</span>
          </div>
          <div className={classes.action}>
            {count > 0 && (
              <RemoveCircle
                onClick={() => this.onSetCount(false)}
                style={{ fontSize: '28px', color: '#F7941C' }}
              />
            )}
            {count > 0 && <span style={{ margin: '0 10px' }}>{count}</span>}
            {item.active ? (
              <AddCircle
                onClick={() => this.onSetCount(true)}
                style={{ fontSize: '28px', color: '#F7941C' }}
              />
            ) : (
              <AddCircle style={{ fontSize: '28px', color: '#898988' }} />
            )}
          </div>
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
