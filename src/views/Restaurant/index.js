import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowLeft, LocationOn } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import moment from 'moment'
import classNames from 'classnames'
import Dialog from '@material-ui/core/Dialog'
import styles from '../../assets/jss/material-dashboard-react/views/retaurantStyles'
import { getListMenuByRestaurant, getRestaurantDetail } from '../../api'
import MenuItem from './MenuItem'
import '../../assets/css/Restaurant/styles.css'

class Restaurant extends Component {
  constructor(props) {
    super(props)
    const { location } = props
    this.state = {
      objectRestaurant: location.state ? location.state.item : null,
      itemRestaurant: null,
      prevPages: location.state && location.state.pages ? location.state.pages : null,
      prevItemSelected:
        location.state && location.state.itemSelected ? location.state.itemSelected : [],
      dataMenu: [],
      listItemSelected: [],
      currentPage: location.state && location.state.pages ? location.state.pages : 1,
      totalPage: 10,
      isOpenPopup: false,
      isOpenPopupInactive: false,
      isOpenTime: false,
      inactiveOrder: [],
    }
  }

  componentDidMount() {
    // this.onGetListMenu()
    this.onGetRestaurantDetail()
  }

  isRestaurantOpen = () => {
    const { itemRestaurant } = this.state
    if (itemRestaurant) {
      const currentTime = moment().format('HH:MM')
      const convertCurrentTime = moment(currentTime, 'hh:mm')
      const openTime = moment(itemRestaurant.open_time, 'hh:mm')
      const closeTime = moment(itemRestaurant.closed_time, 'hh:mm')
      const isOpen = convertCurrentTime.isBefore(closeTime) && convertCurrentTime.isAfter(openTime)
      return isOpen
    }
    return null
  }

  onCheckRestaurantOpen = () => {
    if (!this.isRestaurantOpen()) {
      this.setState({
        isOpenPopup: true,
      })
    }
  }

  onGetRestaurantDetail = async () => {
    const { objectRestaurant } = this.state
    try {
      const data = await getRestaurantDetail({ restaurantId: objectRestaurant.id })
      if (data.isSuccess) {
        this.setState(
          {
            itemRestaurant: data.data,
          },
          () => this.onCheckRestaurantOpen()
        )
        this.onGetListMenu()
      }
    } catch (e) {
      console.warn(e)
    }
  }

  onGetListMenu = async (page = 1, isLoadMore) => {
    try {
      const {
        totalPage,
        dataMenu,
        objectRestaurant,
        prevPages,
        prevItemSelected,
        listItemSelected,
      } = this.state
      if (!isLoadMore) {
        this.setState({
          // isLoading: true,
        })
      }

      if (page <= totalPage) {
        const data = await getListMenuByRestaurant({
          page,
          limit: prevPages ? prevPages * 10 : 10,
          restaurantId: objectRestaurant.id,
        })
        let dataFormat = []
        if (prevPages) {
          dataFormat = [...data.data]
          prevItemSelected.map(value => {
            listItemSelected.push(value)
            return dataFormat.splice(_.findIndex(dataFormat, { id: value.id }), 1, { ...value })
          })
        }
        if (data.isSuccess) {
          this.setState({
            dataMenu: prevPages ? dataFormat : dataMenu.concat(data.data),
            currentPage: page,
            totalPage: data.paging.total_page,
            prevPages: null,
            // isLoading: false,
          })
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  onSetOrder = item => {
    const { listItemSelected } = this.state
    const findItem = _.find(listItemSelected, { id: item.id })
    const listArray = [...listItemSelected]
    if (!findItem) {
      this.setState({
        listItemSelected: listItemSelected.concat(item),
      })
    } else {
      listArray.splice(_.findIndex(listArray, { id: item.id }), 1, { ...item })
      this.setState({
        listItemSelected: listArray,
      })
    }
  }

  onLoadMore = () => {
    const { currentPage } = this.state
    this.onGetListMenu(currentPage + 1, true)
  }

  onGoBack = () => {
    const { history } = this.props
    history.push('/category')
  }

  onSubmitForm = () => {
    const { listItemSelected } = this.state
    const filterArray = _.filter(listItemSelected, value => value.count > 0)
    this.onCheckAvailable(filterArray)
    // history.push('/orderDetail', {
    //   listItemSelected: filterArray,
    //   objectRestaurant,
    //   pages: currentPage,
    // })
  }

  handleCloseInactive = () => {
    // const { isOpenPopupInactive } = this.state
    this.setState({
      isOpenPopupInactive: false,
      inactiveOrder: [],
    })
  }

  onCheckAvailable = async filterArray => {
    const { currentPage, objectRestaurant } = this.state
    const { history } = this.props
    try {
      const data = await getListMenuByRestaurant({
        page: 1,
        limit: currentPage * 10,
        restaurantId: objectRestaurant.id,
      })
      if (data.isSuccess) {
        const arraySelect = []
        _.map(filterArray, value => {
          const selectValue = _.find(data.data, { id: value.id })
          arraySelect.push(selectValue)
        })

        const filterSelected = _.filter(arraySelect, value => !value.active)
        const dataRestaurant = await getRestaurantDetail({ restaurantId: objectRestaurant.id })
        let isOpen = true
        if (dataRestaurant.data) {
          const currentTime = moment().format('HH:MM')
          const convertCurrentTime = moment(currentTime, 'hh:mm')
          const openTime = moment(dataRestaurant.data.open_time, 'hh:mm')
          const closeTime = moment(dataRestaurant.data.closed_time, 'hh:mm')
          isOpen = convertCurrentTime.isBefore(closeTime) && convertCurrentTime.isAfter(openTime)
        } else {
          isOpen = false
        }
        if (filterSelected.length > 0) {
          this.setState({
            inactiveOrder: filterSelected,
            isOpenPopupInactive: true,
          })
        } else if (!isOpen) {
          this.setState({
            isOpenTime: true,
          })
        } else {
          history.push('/orderDetail', {
            listItemSelected: filterArray,
            objectRestaurant,
            pages: currentPage,
          })
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  handleClose = () => {
    this.setState({
      isOpenPopup: false,
    })
  }

  handleCloseTime = () => {
    this.setState({
      isOpenTime: false,
    })
  }

  render() {
    const { classes } = this.props
    const {
      itemRestaurant,
      dataMenu,
      isLoadingSubmit,
      currentPage,
      totalPage,
      isOpenPopup,
      listItemSelected,
      isOpenPopupInactive,
      inactiveOrder,
      isOpenTime,
    } = this.state
    const filterSelected = _.filter(listItemSelected, value => value.count > 0)
    const isHasMore = currentPage < totalPage && itemRestaurant && dataMenu.length > 0
    const timeClass = classNames({
      [classes.rightContentText]: true,
      [classes.closeText]: !this.isRestaurantOpen(),
    })
    return (
      <div id="restaurant" className={classes.wrapper}>
        <div className={classes.header}>
          <KeyboardArrowLeft
            onClick={this.onGoBack}
            style={{ fontSize: '40px', marginLeft: '5px' }}
          />
          <span className={classes.headerLabel}>レストランの詳細</span>
          <div style={{ marginRight: '24px', width: '30px' }} />
          {/* <ShoppingBasket style={{ fontSize: '30px', marginRight: '24px' }} /> */}
          {/* <div style={{ width: '30px' }} /> */}
        </div>
        <InfiniteScroll
          dataLength={dataMenu.length}
          // throttle={100}
          // threshold={300}
          next={this.onLoadMore}
          hasMore={isHasMore}
          // loader={
          //   isHasMore && (
          //     <div
          //       style={{
          //         width: '100%',
          //         marginTop: '10px',
          //         display: 'flex',
          //         justifyContent: 'center',
          //       }}
          //     >
          //       <CircularProgress
          //         size={30}
          //         color="primary"
          //         style={{ marginTop: '10px', margin: 'auto' }}
          //       />
          //     </div>
          //   )
          // }
          // style={{
          //   width: '100%',
          // }}
        >
          <div className={classes.container}>
            {itemRestaurant && (
              <>
                <div className={classes.imageContainer}>
                  {itemRestaurant && (
                    <img
                      className={classes.image}
                      src={itemRestaurant.image}
                      alt={itemRestaurant.name}
                    />
                  )}
                </div>
                <span className={classes.name}>{itemRestaurant && itemRestaurant.name}</span>
                <div>
                  <LocationOn style={{ fontSize: '17px', marginBottom: '-3px' }} />
                  <span className={classes.address}>
                    {itemRestaurant && itemRestaurant.address}
                  </span>
                </div>
                {itemRestaurant.note && (
                  <span style={{ fontSize: '15px' }}>{itemRestaurant.note}</span>
                )}
                <div style={{ fontSize: '15px' }}>
                  <span className={classes.rightContentText}>Open time:</span>
                  {itemRestaurant.open_time && itemRestaurant.closed_time && (
                    <span
                      className={timeClass}
                    >{`${itemRestaurant.open_time} - ${itemRestaurant.closed_time}`}</span>
                  )}
                </div>
                <p style={{ fontSize: '16px', textAlign: 'center' }}>メニュー一覧</p>
              </>
            )}

            <Grid container>
              {dataMenu &&
                dataMenu.length > 0 &&
                dataMenu.map(value => {
                  return <MenuItem key={value.id} onSetOrder={this.onSetOrder} item={value} />
                  // return (
                  //   <div
                  //     style={{
                  //       width: '100%',
                  //       height: 100,
                  //       margin: '10px 0',
                  //       backgroundColor: 'red',
                  //     }}
                  //   />
                  // )
                })}
              {itemRestaurant && dataMenu.length === 0 && (
                <p style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                  まだこの店舗にメニューが登録されていません
                </p>
              )}
              <div style={{ width: '100%', height: '60px', marginTop: '10px' }} />
            </Grid>
          </div>
        </InfiniteScroll>
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="primary"
            className="btn-login"
            onClick={
              this.isRestaurantOpen() && filterSelected.length > 0 ? this.onSubmitForm : null
            }
            style={{
              backgroundColor:
                this.isRestaurantOpen() && filterSelected.length > 0 ? '#F7941D' : '#F2F2F2',
            }}
          >
            {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `確定`}
          </Button>
        </div>
        <Dialog onClose={this.handleClose} style={{ width: '100%' }} open={isOpenPopup}>
          <p
            style={{
              textAlign: 'center',
              fontSize: '16',
              fontWeight: 'bold',
              margin: '10px 20px',
            }}
          >
            この店舗は現在営業しておりません
          </p>
          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              margin: '0px 20px',
            }}
          >
            メニューはあとで選ぶことができます
          </p>
          <div className={classes.closeBtn}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClose}
              style={{ backgroundColor: '#F7941D' }}
            >
              {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `Close`}
            </Button>
          </div>
        </Dialog>
        <Dialog
          onClose={this.handleCloseInactive}
          style={{ width: '100%' }}
          open={isOpenPopupInactive}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              margin: '10px 20px',
            }}
          >
            申し訳ありません。このメニューは売り切れました:
          </p>
          {inactiveOrder.length > 0 &&
            inactiveOrder.map(value => {
              return (
                <p style={{ fontSize: '15px', margin: '5px 20px', textAlign: 'left' }}>
                  {value.name}
                </p>
              )
            })}
          <div className={classes.closeBtn}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleCloseInactive}
              style={{ backgroundColor: '#F7941D' }}
            >
              {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `閉める`}
            </Button>
          </div>
        </Dialog>
        <Dialog onClose={this.handleCloseTime} style={{ width: '100%' }} open={isOpenTime}>
          <p
            style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '10px 40px',
            }}
          >
            注文に失敗しました
          </p>
          <span style={{ textAlign: 'center', fontSize: '12px' }}>もう一度試してください!</span>
          <div
            style={{ width: '100%', margin: '20px 0px', display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              color="primary"
              className="btn-login"
              onClick={this.handleClose}
              style={{ backgroundColor: '#F7941D' }}
            >
              Ok
            </Button>
          </div>
        </Dialog>
      </div>
    )
  }
}

Restaurant.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  classes: PropTypes.any,
}

export default withStyles(styles)(Restaurant)
