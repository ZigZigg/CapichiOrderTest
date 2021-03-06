/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import _ from 'lodash'
import { isMobile, isBrowser } from 'react-device-detect'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'
import { getTimeRange } from '../../commons'
import '../../assets/css/Category/styles.css'
import { I18n } from '../../config'
import { baseURL } from '../../api'

class CategoryItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onClickItem = () => {
    const { onClick, item } = this.props
    if (onClick) onClick(item)
  }

  render() {
    const { classes, item } = this.props
    const imageMissing = `${baseURL}missing.png`
    const { detail_image, image } = item
    let imageSrc = detail_image
    if (detail_image === imageMissing) imageSrc = image
    // if (image === imageMissing) imageSrc = detail_image
    // let restaurantTimeRange = []
    // const timeRange = "08:11-10:11,11:00-15:00,16:00-20:00"
    const timeRange = getTimeRange(item.active_time_csv)
    _.orderBy(timeRange, ['sort'], ['desc'])
    const sortTime = _.orderBy(timeRange, ['sort'], ['desc'])
    return (
      <Grid
        onClick={this.onClickItem}
        item
        xs={12}
        sm={6}
        lg={3}
        className={classNames({ [classes.itemCategory]: true, 'item-category': true })}
      >
        <div
          className={classNames({
            [classes.itemContentCategory]: true,
            'item-content-category': true,
          })}
        >
          <div
            className={classNames({
              [classes.imageContainer]: isMobile,
              [classes.imageContainerDes]: isBrowser,
            })}
          >
            <img className={classes.image} src={imageSrc} alt={item.name} />
          </div>

          <div className={classes.righContent}>
            <span className={classes.rightTextName}>{item.name}</span>
            <span className={classes.rightContentText}>{item.address}</span>
            <div style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px' }}>{I18n.t('restaurantText.openTime')}</span>
              <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                {sortTime.map((value, index) => {
                  if (index <= 1) {
                    return (
                      <span
                        key={index}
                        className={classNames({
                          [classes.itemTimeRange]: true,
                          [classes.itemTimeClose]: !value.isOpen,
                        })}
                      >
                        {value.time}
                      </span>
                    )
                  }
                  return (
                    <span key={index} className={classes.expandTime}>
                      ...
                    </span>
                  )
                })}
              </div>
              {/* {item.open_time && item.closed_time && (
                <span className={timeClass}>{`${item.open_time} - ${item.closed_time}`}</span>
              )} */}
            </div>
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
