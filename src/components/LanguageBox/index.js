/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import '../../assets/css/Category/styles.css'
import Popover from '@material-ui/core/Popover'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'
import vnFlag from '../../assets/img/vn-flag.png'
import jpFlag from '../../assets/img/jp-flag.png'
import { setI18nConfig } from '../../config/I18n'

class Index extends PureComponent {
  constructor(props) {
    super(props)
    const locale = localStorage.getItem('LOCALE')
    this.state = {
      anchorEl: null,
      currentLocale: locale,
    }
  }

  openPopup = event => {
    event.preventDefault()
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  closePopup = () => {
    this.setState({
      anchorEl: null,
    })
  }

  onSelectLanguage = (event, locale) => {
    const { onChangeLanguage } = this.props
    event.preventDefault()
    setI18nConfig(locale)
    if (onChangeLanguage) onChangeLanguage(locale)
    this.setState({
      currentLocale: locale,
      anchorEl: null,
    })
  }

  render() {
    const { anchorEl, currentLocale } = this.state
    const { classes } = this.props
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    return (
      <div>
        <a href="#" className={classes.viewFlag} onClick={this.openPopup}>
          <img src={currentLocale === 'ja' ? jpFlag : vnFlag} className={classes.imgFlag} />
        </a>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={this.closePopup}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          style={{ marginTop: '10px' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div id="popup-view" className={classes.popupView}>
            <a href="#" className="language-item" onClick={e => this.onSelectLanguage(e, 'ja')}>
              <img src={jpFlag} className={classes.imgFlag} />
              <span>Japanese</span>
            </a>
            <a href="#" className="language-item" onClick={e => this.onSelectLanguage(e, 'vi')}>
              <img src={vnFlag} className={classes.imgFlag} />
              <span>Vietnamese</span>
            </a>
          </div>
        </Popover>
      </div>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.any,
  onChangeLanguage: PropTypes.func,
}

export default withStyles(styles)(Index)
