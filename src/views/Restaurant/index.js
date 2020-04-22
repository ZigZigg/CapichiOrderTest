/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { LocationOn, Phone } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import classNames from 'classnames'
import Dialog from '@material-ui/core/Dialog'

import { isBrowser, isMobile } from 'react-device-detect'
import { Container } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import * as firebase from 'firebase/app'
import MenuItem from './MenuItem'
import 'firebase/analytics'
import Header from '../../components/Header'
import { getTimeRange, isDevelopEnvironment } from '../../commons'
import '../../assets/css/Restaurant/styles.css'
import { getListMenuByRestaurant, getRestaurantDetail, baseURL } from '../../api'
import { I18n } from '../../config'
import LanguageBox from '../../components/LanguageBox'
import styles from '../../assets/jss/material-dashboard-react/views/retaurantStyles'

class Restaurant extends Component {
  constructor(props) {
    super(props)
    const { location } = props
    this.state = {
      // objectRestaurant: location.state ? location.state.item : null,
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
      defaultPage: 1,
    }
  }

  componentDidMount() {
    if (isDevelopEnvironment()) {
      firebase.analytics().logEvent('restaurant_menu_view_debug')
    } else {
      firebase.analytics().logEvent('restaurant_menu_view')
    }

    this.onGetRestaurantDetail()
  }

  isRestaurantOpen = dataItem => {
    const { itemRestaurant } = this.state
    const itemRestaurantData = dataItem || itemRestaurant
    if (itemRestaurantData) {
      const timeRange = getTimeRange(itemRestaurantData.active_time_csv)
      const findOpen = _.find(timeRange, { isOpen: true })
      if (findOpen && itemRestaurantData.active) {
        return true
      }
      return false
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
    const { match } = this.props
    const { id } = match.params
    try {
      const data = await getRestaurantDetail({ restaurantId: id })
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
      // console.warn(e)
    }
  }

  onGetListMenu = async (page = 1, isLoadMore) => {
    try {
      const { totalPage, dataMenu, prevPages, prevItemSelected, listItemSelected } = this.state
      const { match } = this.props
      const { id } = match.params

      if (page <= totalPage) {
        const data = await getListMenuByRestaurant({
          page,
          limit: isBrowser ? 12 : prevPages ? prevPages * 10 : 10,
          restaurantId: id,
        })
        let dataFormat = []
        if (prevPages && isMobile) {
          dataFormat = [...data.data]
          prevItemSelected.map(value => {
            const findItem = _.find(dataFormat, { id: value.id })
            if (findItem) {
              listItemSelected.push(value)
            }
            return dataFormat.splice(_.findIndex(dataFormat, { id: value.id }), 1, { ...value })
          })
        } else if (prevPages && isBrowser) {
          this.setState({
            listItemSelected: prevItemSelected,
          })
        }
        // if (isLoadMore) {
        //   dataFormat = [...data.data]
        //   console.log("Restaurant -> onGetListMenu -> dataFormat", dataFormat)
        //   listItemSelected.map(value => {
        //     return dataFormat.splice(_.findIndex(dataFormat, { id: value.id }), 1, { ...value })
        //   })
        // }
        if (data.isSuccess) {
          this.setState({
            dataMenu:
              prevPages && isMobile
                ? dataFormat
                : isLoadMore
                ? data.data
                : dataMenu.concat(data.data),
            currentPage: page,
            totalPage: data.paging.total_page,
            prevPages: null,
            // isLoading: false,
          })
        }
      }
    } catch (e) {
      // console.warn(e)
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
    this.onGetListMenu(currentPage + 1)
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
    const { currentPage, itemRestaurant, totalPage } = this.state
    const { history, match } = this.props
    const { id } = match.params
    try {
      const data = await getListMenuByRestaurant({
        page: 1,
        limit: totalPage * 10,
        restaurantId: id,
      })
      if (data.isSuccess) {
        const arraySelect = []
        _.map(filterArray, value => {
          const selectValue = _.find(data.data, { id: value.id })
          if (!selectValue) {
            arraySelect.push({ ...value, isShow: false })
          } else {
            arraySelect.push(selectValue)
          }
        })
        const filterSelected = _.filter(
          arraySelect,
          value => !value.active || value.isShow === false
        )
        const dataRestaurant = await getRestaurantDetail({ restaurantId: id })
        let isOpen = true
        if (dataRestaurant.data) {
          // const currentTime = moment().format('HH:mm')
          // const convertCurrentTime = moment(currentTime, 'HH:mm')
          // const openTime = moment(dataRestaurant.data.open_time, 'HH:mm')
          // const closeTime = moment(dataRestaurant.data.closed_time, 'HH:mm')
          isOpen = this.isRestaurantOpen(dataRestaurant.data)
        } else {
          isOpen = false
        }
        if (!isOpen) {
          this.setState({
            isOpenTime: true,
          })
        } else if (filterSelected.length > 0) {
          this.setState({
            inactiveOrder: filterSelected,
            isOpenPopupInactive: true,
          })
        } else {
          history.push('/orderDetail', {
            listItemSelected: filterArray,
            objectRestaurant: itemRestaurant,
            pages: currentPage,
          })
        }
      }
    } catch (e) {
      // console.warn(e)
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

  onChangePagination = (event, pages) => {
    this.onGetListMenu(pages, true)
    this.setState({
      defaultPage: pages,
    })
  }

  onChangeLanguage = locale => {
    this.setState({
      localeSelect: locale,
    })
  }

  onOpenApp = () => {
    const { itemRestaurant } = this.state
    const mUrl = `${baseURL}frontend/places/${itemRestaurant.place_id}`
    const shareUrl = `https://mycapichi.page.link/?link=${mUrl}&apn=com.capichi.Capichi&isi=1481540574&ibi=com.capichi.Capichi`
    window.open(shareUrl)
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
      defaultPage,
    } = this.state
    const filterSelected = _.filter(listItemSelected, value => value.count > 0)
    const isHasMore = currentPage < totalPage && itemRestaurant && dataMenu.length > 0
    const timeRange = itemRestaurant ? getTimeRange(itemRestaurant.active_time_csv) : []

    const imageMissing = `${baseURL}missing.png`
    const { detail_image, image, place_id } = itemRestaurant || {}
    const disableBtnVideo = place_id === null || place_id === undefined
    let imageSrc = image
    // if (detail_image === imageMissing) imageSrc = image
    if (image === imageMissing) imageSrc = detail_image

    return (
      <div id="restaurant" className={classes.wrapper}>
        <Header
          onGoBack={this.onGoBack}
          headerText={I18n.t('restaurantText.header')}
          rightComponent={<LanguageBox onChangeLanguage={this.onChangeLanguage} />}
        />
        <InfiniteScroll
          dataLength={dataMenu.length}
          next={isBrowser ? false : this.onLoadMore}
          hasMore={isHasMore}
        >
          <div className={classes.container}>
            {itemRestaurant && (
              <Container style={{ padding: isMobile && '0' }}>
                <div className={classNames({ [classes.rowContainer]: isBrowser })}>
                  <div
                    className={classNames({
                      [classes.imageContainer]: true,
                      'image-container': isBrowser,
                    })}
                  >
                    {itemRestaurant && (
                      <img
                        className={classNames({ [classes.image]: true, image: isBrowser })}
                        src={imageSrc}
                        alt={itemRestaurant.name}
                      />
                    )}
                  </div>
                  <div className={classNames({ [classes.rowRightContainer]: isBrowser })}>
                    <div
                      style={{
                        marginTop: 16,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span className={classNames({ [classes.name]: true, name: isBrowser })}>
                        {itemRestaurant && itemRestaurant.name}
                      </span>
                      <Button
                        variant="contained"
                        color={disableBtnVideo ? 'primary' : 'default'}
                        disabled={disableBtnVideo}
                        onClick={this.onOpenApp}
                        style={
                          !disableBtnVideo
                            ? styles.buttonJumbStore
                            : { backgroundColor: 'rgb(242, 242, 242)', maxWidth: '50%' }
                        }
                      >
                        <span style={styles.textBtn}>{I18n.t('watchThisStoreVideo')}</span>
                      </Button>
                    </div>
                    <div>
                      <LocationOn style={{ fontSize: '17px', marginBottom: '-3px' }} />
                      <span className={classes.address}>
                        {itemRestaurant && itemRestaurant.address}
                      </span>
                    </div>
                    <div>
                      <Phone style={{ fontSize: '17px', marginBottom: '-3px' }} />
                      <a href={`tel:${itemRestaurant.phone}`} className={classes.address}>
                        {itemRestaurant.phone}
                      </a>
                    </div>
                    <div style={{ fontSize: '15px', display: 'flex', flexDirection: 'column' }}>
                      <span className={classes.rightContentText}>
                        {I18n.t('restaurantText.openTime')}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {timeRange.map((value, index) => {
                          return (
                            <span
                              key={index}
                              className={classNames({
                                [classes.itemTimeRange]: true,
                                [classes.itemTimeClose]: !value.isOpen,
                              })}
                            >
                              {value.time}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    {itemRestaurant.note && (
                      <span style={{ fontSize: '15px' }}>{itemRestaurant.note}</span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '16px', textAlign: 'center' }}>
                  {I18n.t('restaurantText.menu')}
                </p>
              </Container>
            )}
            <Container style={{ padding: isMobile && '0' }}>
              <Grid container>
                {dataMenu &&
                  dataMenu.length > 0 &&
                  dataMenu.map(value => {
                    return (
                      <MenuItem
                        listItemSelected={listItemSelected}
                        key={value.id}
                        onSetOrder={this.onSetOrder}
                        item={value}
                      />
                    )
                  })}
                {itemRestaurant && dataMenu.length === 0 && (
                  <p style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                    {I18n.t('restaurantText.dataEmpty')}
                  </p>
                )}
                {!isBrowser && <div style={{ width: '100%', height: '60px', marginTop: '10px' }} />}
              </Grid>
            </Container>
          </div>
        </InfiniteScroll>
        {isBrowser && dataMenu.length > 0 && (
          <Container className={classes.paginationContainer}>
            <Pagination
              onChange={this.onChangePagination}
              count={totalPage}
              siblingCount={0}
              boundaryCount={1}
              page={defaultPage}
            />
          </Container>
        )}
        <div className={classes.btnContainer} style={{ position: isBrowser && 'inherit' }}>
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
            {isLoadingSubmit ? (
              <CircularProgress size={30} color="inherit" />
            ) : (
              I18n.t('restaurantText.submit')
            )}
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
            {I18n.t('restaurantText.dialogOpenTime.header')}
          </p>
          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              margin: '0px 20px',
            }}
          >
            {I18n.t('restaurantText.dialogOpenTime.text')}
          </p>
          <div className={classes.closeBtn}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClose}
              style={{ backgroundColor: '#F7941D' }}
            >
              {isLoadingSubmit ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                I18n.t('restaurantText.ok')
              )}
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
            {I18n.t('restaurantText.dialogFailedMenu.text')}
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
              {isLoadingSubmit ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                I18n.t('restaurantText.ok')
              )}
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
            {I18n.t('restaurantText.dialogFailedSubmit.header')}
          </p>
          <span style={{ textAlign: 'center', fontSize: '12px' }}>
            {I18n.t('restaurantText.dialogFailedSubmit.text')}
          </span>
          <div
            style={{ width: '100%', margin: '20px 0px', display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              color="primary"
              className="btn-login"
              onClick={this.handleCloseTime}
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
  match: PropTypes.any,
}

export default withStyles(styles)(Restaurant)
