/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */

import React, { Component } from 'react'
import { fade, withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import InputBase from '@material-ui/core/InputBase'
import CircularProgress from '@material-ui/core/CircularProgress'
import classnames from 'classnames'
import _ from 'lodash'
import { AUTHEN_TOKEN } from '../../constants/define'
import styles from '../../assets/jss/material-dashboard-react/components/autocompleteStyle'

const CustomInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    minWidth: '250px',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase)

class AutocompleteInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSuggest: [],
      keyword: '',
      isLoading: false,
      isShowSuggest: false,
    }
    this.getDataUser = _.debounce(this.getDataUser, 400)
    this.wrapperRef = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  onChangeText = event => {
    this.sendTextChange(event.target.value)
  }

  sendTextChange = text => {
    this.setState(
      {
        keyword: text,
        isShowSuggest: text.length > 0,
      },
      () => this.getDataUser()
    )
  }

  getDataUser = async () => {
    try {
      const { filterFunction, onChangeSearch } = this.props
      const { keyword } = this.state
      const authenToken = localStorage.getItem(AUTHEN_TOKEN)
      this.setState({
        isLoading: true,
      })
      if (keyword) {
        const data = await filterFunction(authenToken, keyword)
        if (data.status === 'success') {
          this.setState({
            dataSuggest: data.data,
            isLoading: false,
          })
        } else {
          this.setState({
            isLoading: false,
          })
        }
      } else if (onChangeSearch) onChangeSearch('')
    } catch (e) {
      console.warn(e)
    }
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({
        isShowSuggest: false,
      })
    } else if (this.wrapperRef && this.wrapperRef.current.contains(event.target)) {
      this.setState({
        isShowSuggest: true,
      })
    }
  }

  onClickItemSuggest = event => {
    event.preventDefault()
    const { onChangeSearch, emptyText } = this.props
    console.log('AutocompleteInput -> emptyText', emptyText)
    this.setState(
      {
        keyword: event.target.innerHTML,
        isShowSuggest: false,
      },
      () => this.getDataUser()
    )
    if (onChangeSearch) onChangeSearch(event.target.innerHTML, emptyText)
  }

  handlePressKey = ev => {
    const { onChangeSearch, emptyText } = this.props
    const { keyword } = this.state
    if (ev.key === 'Enter') {
      ev.preventDefault()
      this.setState(
        {
          isShowSuggest: false,
        },
        () => onChangeSearch(keyword, emptyText)
      )
    }
  }

  render() {
    const { isLoading, dataSuggest, keyword, isShowSuggest } = this.state
    const { classes, keyFilter } = this.props
    const suggest = classnames({ [classes.hideArea]: false }, classes.suggestArea)
    return (
      <div ref={this.wrapperRef} className={classes.main}>
        <CustomInput
          //   onKeyPress={this.handlePressKey}
          value={keyword}
          onClick={this.handleClick}
          onChange={this.onChangeText}
        />
        {keyword && isShowSuggest && (
          <div className={suggest}>
            {isLoading ? (
              <div
                style={{
                  width: '100%',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={30} color="primary" />
              </div>
            ) : dataSuggest.length > 0 ? (
              dataSuggest.map(value => {
                return (
                  <a
                    href="#"
                    key={value.id}
                    id={value.id}
                    className={classes.item}
                    onClick={this.onClickItemSuggest}
                  >
                    {value[keyFilter]}
                  </a>
                )
              })
            ) : (
              <span style={{ textAlign: 'center', padding: '10px 0px', fontSize: '14px' }}>
                Không có kết quả
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
}

AutocompleteInput.propTypes = {
  onChangeSearch: PropTypes.func,
  filterFunction: PropTypes.func,
  classes: PropTypes.any,
  emptyText: PropTypes.any,
  keyFilter: PropTypes.any,
}

export default withStyles(styles)(AutocompleteInput)
