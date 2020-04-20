/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { isBrowser } from 'react-device-detect'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
import '../../assets/css/Order/styles.css'
import { I18n } from '../../config'

class AutoFillForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    this.wrapperRef = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  onClickItem = () => {
    const { onClick, item } = this.props
    if (onClick) onClick(item)
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
    const { classes, dataAutofill } = this.props
    const dataFormat = _.reverse(dataAutofill)
    return (
      <div
        ref={this.wrapperRef}
        className={classes.autoFillContainer}
        style={{ width: isBrowser ? '50%' : '100%' }}
      >
        {dataFormat.map(value => {
          return (
            <a href="#" className="suggest-box" onClick={event => this.selectItem(value, event)}>
              <span>{value.name}</span>
              <span>{value.phone}</span>
              <span>{value.address}</span>
            </a>
          )
        })}
        <a href="#" className="suggest-box clear-box" onClick={this.clearForm}>
          <span>{I18n.t('orderText.clearForm')}</span>
        </a>
      </div>
    )
  }
}

AutoFillForm.propTypes = {
  classes: PropTypes.any,
  autoFillInput: PropTypes.any,
  onClickOutside: PropTypes.func,
  onClearFormData: PropTypes.func,
  onClick: PropTypes.func,
  item: PropTypes.any,
  dataAutofill: PropTypes.any,
}

export default withStyles(styles)(AutoFillForm)
