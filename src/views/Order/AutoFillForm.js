import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import _ from 'lodash'
import { isMobileOnly, isBrowser } from 'react-device-detect'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
import '../../assets/css/Order/styles.css'

class AutoFillForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    this.wrapperRef = React.createRef()
  }

  onClickItem = () => {
    const { onClick, item } = this.props
    if (onClick) onClick(item)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    const { onClickOutside } = this.props

    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      if (onClickOutside) onClickOutside()
    }
  }

  selectItem = (value, event) => {
    event.preventDefault()
    const { onClickOutside, autoFillInput } = this.props
    if (autoFillInput) autoFillInput(value)
    if (onClickOutside) onClickOutside()
  }

  clearForm = event => {
    event.preventDefault()
    const { onClearFormData, onClickOutside } = this.props
    if (onClickOutside) onClickOutside()
    if (onClearFormData) onClearFormData()
  }

  render() {
    const { classes, item, dataAutofill } = this.props

    return (
      <div ref={this.wrapperRef} className={classes.autoFillContainer} style={{width:isBrowser ? '50%' : '100%'}}>
        {dataAutofill.map(value => {
          return (
            <a href="#" className="suggest-box" onClick={event => this.selectItem(value, event)}>
              <span>{value.name}</span>
              <span>{value.phone}</span>
              <span>{value.address}</span>
            </a>
          )
        })}
        <a href="#" className="suggest-box clear-box" onClick={this.clearForm}>
          <span>Clear form</span>
        </a>
      </div>
    )
  }
}

AutoFillForm.propTypes = {
  classes: PropTypes.any,
  item: PropTypes.any,
  onClick: PropTypes.func,
}

export default withStyles(styles)(AutoFillForm)
