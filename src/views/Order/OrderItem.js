import React from 'react'
import Grid from '@material-ui/core/Grid'
import { isBrowser } from 'react-device-detect'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const convertPrice = price => {
  const priceFormat = price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')
  return priceFormat
}
export default function OrderItem(props) {
  const { classes, item, gridStyle } = props
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
      xs={gridStyle && gridStyle.xs ? gridStyle.xs : 12}
      md={gridStyle && gridStyle.md ? gridStyle.md : 6}
      lg={gridStyle && gridStyle.lg ? gridStyle.lg : 4}
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
            <span className={itemClass}>{`${convertPrice(item.price)}VND`}</span>
          </div>
          <span
            className={classes.textItem}
            style={{ width: '10%', textAlign: 'right' }}
          >{`x${item.count}`}</span>
          <span
            className={classes.textItem}
            style={{ width: '45%', textAlign: 'right' }}
          >{`${convertPrice(rowTotalPrice)}VND`}</span>
        </div>
      </div>
    </Grid>
  )
}

OrderItem.propTypes = {
  classes: PropTypes.any,
  item: PropTypes.any,
  gridStyle: PropTypes.object,
}
