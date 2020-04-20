import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { KeyboardArrowLeft } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { isBrowser } from 'react-device-detect'
import { Container } from '@material-ui/core'
import styles from '../../assets/jss/material-dashboard-react/components/headerComponentStyle'
import '../../assets/css/Category/styles.css'

class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onGoBack = () => {
    const { onGoBack } = this.props
    if (onGoBack) onGoBack()
  }

  render() {
    const { classes, headerText, rightComponent } = this.props
    return (
      <Container
        className={classes.header}
        style={{ position: isBrowser && 'inherit', padding: '0' }}
      >
        <KeyboardArrowLeft
          onClick={this.onGoBack}
          style={{ fontSize: '40px', marginLeft: '5px' }}
        />
        <span className={classes.headerLabel}>{headerText}</span>
        <div style={{ marginRight: '24px', width: '40px' }}>{rightComponent || null}</div>
      </Container>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.any,
  headerText: PropTypes.any,
  rightComponent: PropTypes.any,
  onGoBack: PropTypes.func,
}

export default withStyles(styles)(Index)
