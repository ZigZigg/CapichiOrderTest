import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'
import { getTimeRange } from '../../commons'

class CategoryItem extends PureComponent {
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

    // let restaurantTimeRange = []
    // const timeRange = "08:11-10:11,11:00-15:00,16:00-20:00"
    const timeRange = getTimeRange(item.active_time_csv)
    return (
      <Grid onClick={this.onClickItem} item xs={12} md={6} lg={3} className={classes.itemCategory}>
        <div className={classes.itemContentCategory}>
          <div style={{ width: '135px', height: '135px' }}>
            <img className={classes.image} src={item.image} alt={item.name} />
          </div>

          <div className={classes.righContent}>
            <span className={classes.rightTextName}>{item.name}</span>
            <span className={classes.rightContentText}>{item.address}</span>
            <div style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px' }}>営業時間:</span>
              <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                {timeRange.map((value, index) => {
                  if (index <= 1) {
                    return (
                      <span
                        className={classNames({
                          [classes.itemTimeRange]: true,
                          [classes.itemTimeClose]: !value.isOpen,
                        })}
                      >
                        {value.time}
                      </span>
                    )
                  }
                  return <span className={classes.expandTime}>...</span>
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
