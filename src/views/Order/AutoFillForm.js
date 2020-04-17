import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { isBrowser } from 'react-device-detect'
import styles from '../../assets/jss/material-dashboard-react/views/orderStyles'
import '../../assets/css/Order/styles.css'
import { orderText } from '../../variables/texts'

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
          <span>{orderText.clear}</span>
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
