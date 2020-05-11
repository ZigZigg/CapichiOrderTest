/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import Proptypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
import { getAutoCompleteAddress } from '../../api/apiGoogle'

const styles = {
  autoFillContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    top: '40px',
    borderRadius: 3,
    padding: '0px',
    zIndex: 10,
    minHeight: '120px',
    border: '1px solid #424242',
    boxSizing: 'border-box',
  },
}

class PopupAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isShow: false,
      text: '',
    }
    this.wrapperRef = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  shouldComponentUpdate(props, state) {
    return !_.isEqual(state, this.state)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    const { onClickOutside } = this.props

    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      if (onClickOutside) onClickOutside()
      this.setState({ isShow: false })
    }
  }

  setText = text => {
    this.setState({ text, isShow: true }, () => {
      this.onGetAutoComplete(text)
    })
  }

  onGetAutoComplete = keyvalue => {
    getAutoCompleteAddress(keyvalue).then(r => {
      // console.log(r)
      if (r.isSuccess) {
        const { data } = r
        // const { text } = this.state
        // if (`${value}` === `${text}`) {
        this.setState({ data: data.predictions })
        // }
      }
    })
  }

  // setData = data => {}

  // show = () => {}

  hide = () => {
    this.setState({ isShow: false })
  }

  onChooseAddress = data => () => {
    // console.log({ data })
    this.setState({ isShow: false }, () => {
      const { onChooseAddress } = this.props

      if (typeof onChooseAddress === 'function') {
        onChooseAddress(data)
      }
    })
  }

  renderRow = data => {
    return (
      <p
        key={data.id}
        style={{ paddingLeft: '15px', paddingRight: '15px' }}
        onClick={this.onChooseAddress(data)}
      >
        {data.description}
      </p>
    )
  }

  renderList = () => {
    const { data } = this.state
    return (
      <>
        {Array.isArray(data)
          ? data.map(rowData => {
              return this.renderRow(rowData)
            })
          : null}
      </>
    )
  }

  render() {
    const { classes } = this.props
    const { isShow } = this.state

    if (!isShow) return null

    return (
      <div ref={this.wrapperRef} className={classes.autoFillContainer}>
        {this.renderList()}
      </div>
    )
  }
}

PopupAddress.propTypes = {
  classes: Proptypes.any,
  onChooseAddress: Proptypes.func,
  onClickOutside: Proptypes.func,
}

export default withStyles(styles)(PopupAddress)
