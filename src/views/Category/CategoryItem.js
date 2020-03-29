import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import classNames from 'classnames'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'

class CategoryItem extends PureComponent {
  onClickItem = () => {
    const { onClick, item } = this.props
    if (onClick) onClick(item)
  }

  render() {
    const { classes, item } = this.props
    const currentTime = moment().format('HH:MM')
    const convertCurrentTime = moment(currentTime, 'hh:mm')
    const openTime = moment(item.open_time, 'hh:mm')
    const closeTime = moment(item.closed_time, 'hh:mm')
    const isOpen = convertCurrentTime.isBefore(closeTime) && convertCurrentTime.isAfter(openTime)
    const timeClass = classNames({
      [classes.rightContentText]: true,
      [classes.closeText]: !isOpen,
    })
    return (
      <Grid onClick={this.onClickItem} item xs={12} md={6} lg={3} className={classes.itemCategory}>
        <div className={classes.itemContentCategory}>
          <div style={{ width: '130px', height: '130px' }}>
            <img className={classes.image} src={item.image} alt={item.name} />
          </div>

          <div className={classes.righContent}>
            <span className={classes.rightTextName}>{item.name}</span>
            <span className={classes.rightContentText}>{item.address}</span>
            <p style={{ margin: 0 }}>
              <span className={classes.rightContentText}>営業時間:</span>
              {item.open_time && item.closed_time && (
                <span className={timeClass}>{`${item.open_time} - ${item.closed_time}`}</span>
              )}
            </p>
          </div>
        </div>
      </Grid>
    )
  }
}

CategoryItem.propTypes = {
  classes: PropTypes.any,
  item: PropTypes.any,
  onClick: PropTypes.func,
}

export default withStyles(styles)(CategoryItem)
