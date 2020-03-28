import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowLeft, LocationOn } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '../../assets/jss/material-dashboard-react/views/retaurantStyles'
import { getListMenuByRestaurant, getRestaurantDetail } from '../../api'
import MenuItem from './MenuItem'

class Restaurant extends Component {
  constructor(props) {
    super(props)
    const { location } = props
    this.state = {
      objectRestaurant: location.state ? location.state.item : null,
      itemRestaurant: null,
      // prevPages: location.state && location.state.pages ? location.state.pages : null,
      dataMenu: [],
      listItemSelected: [],
      currentPage: 1,
      totalPage: 10,
    }
  }

  componentDidMount() {
    // this.onGetListMenu()
    this.onGetRestaurantDetail()
  }

  onGetRestaurantDetail = async () => {
    const { objectRestaurant } = this.state
    try {
      const data = await getRestaurantDetail({ restaurantId: objectRestaurant.id })
      if (data.isSuccess) {
        this.setState({
          itemRestaurant: data.data,
        })
        this.onGetListMenu()
      }
    } catch (e) {
      console.warn(e)
    }
  }

  onGetListMenu = async (page = 1, isLoadMore) => {
    try {
      const { totalPage, dataMenu, objectRestaurant } = this.state
      if (!isLoadMore) {
        this.setState({
          // isLoading: true,
        })
      }

      if (page <= totalPage) {
        const data = await getListMenuByRestaurant({
          page,
          limit: 10,
          restaurantId: objectRestaurant.id,
        })
        if (data.isSuccess) {
          this.setState({
            dataMenu: dataMenu.concat(data.data),
            currentPage: page,
            totalPage: data.paging.total_page,
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
    const { history } = this.props
    const { listItemSelected, objectRestaurant, currentPage } = this.state
    history.push('/orderDetail', { listItemSelected, objectRestaurant, pages: currentPage })
  }

  render() {
    const { classes } = this.props
    const { itemRestaurant, dataMenu, isLoadingSubmit, currentPage, totalPage } = this.state
    const isHasMore = currentPage < totalPage && itemRestaurant
    return (
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <KeyboardArrowLeft
            onClick={this.onGoBack}
            style={{ fontSize: '40px', marginLeft: '5px' }}
          />
          <span className={classes.headerLabel}>Restaurant detail</span>
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
          loader={
            isHasMore && (
              <div
                style={{
                  width: '100%',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ marginTop: '10px', margin: 'auto' }}
                />
              </div>
            )
          }
          // style={{
          //   display: 'flex',
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
                <p style={{ fontSize: '16px', textAlign: 'center' }}>Menu</p>
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
              <div style={{ width: '100%', height: '60px', marginTop: '10px' }} />
            </Grid>
          </div>
        </InfiniteScroll>
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="primary"
            className="btn-login"
            onClick={this.onSubmitForm}
            style={{ backgroundColor: '#F7941D' }}
          >
            {isLoadingSubmit ? <CircularProgress size={30} color="inherit" /> : `Submit`}
          </Button>
        </div>
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
