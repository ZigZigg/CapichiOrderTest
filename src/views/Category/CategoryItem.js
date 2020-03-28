import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'

class CategoryItem extends PureComponent {
  onClickItem = () => {
    const { onClick, item } = this.props
    if (onClick) onClick(item)
  }

  render() {
    const { classes, item } = this.props
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
              <span className={classes.rightContentText}>Open time:</span>
              <span className={classes.rightContentText}>10pm - 12pm</span>
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
