/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from 'react'
import { withStyles, fade } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import classNames from 'classnames'
import { isMobileOnly, isTablet, isBrowser } from 'react-device-detect'
import Container from '@material-ui/core/Container'
import * as firebase from 'firebase/app'
import Pagination from '@material-ui/lab/Pagination'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'
import { getListCategory } from '../../api'
import CategoryItem from './CategoryItem'
import logoHeader from '../../assets/img/logo-order.png'
import { isDevelopEnvironment } from '../../commons'
import 'firebase/analytics'
import { I18n } from '../../config'
import LanguageBox from '../../components/LanguageBox'
import '../../assets/css/Category/styles.css'
// Hashcode tinh/TP, nếu trong môi trường Dev thì sẽ dùng dataDev, còn nếu trong môi trường product thì sẽ dùng dataProduct
const dataDev = [
  { id: 190, label: 'city.HaNoi', data: null },
  { id: 192, label: 'city.HoChiMinh', data: null },
  { id: 191, label: 'city.HaiPhong', data: null },
]

const dataProduct = [
  { id: 3, label: 'city.HaNoi', data: null },
  { id: 5, label: 'city.HoChiMinh', data: null },
  { id: 4, label: 'city.HaiPhong', data: null },
]

const CustomInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    margin: '0',
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: '14px',
    // minWidth: '250px',

    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase)

class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dataCategory: [],
      currentPage: 1,
      totalPage: 10,
      keyword: '',
      isLoading: false,
      currentTab: isDevelopEnvironment() ? 190 : 3,
      category: isDevelopEnvironment() ? dataDev : dataProduct,
      // currentTab: 3,
      // category: dataProduct,
      firstSeed: null,
      defaultPage: 1,
      localeSelect: null,
    }
    this.sendTextChange = _.debounce(this.sendTextChange, 400)
    this.listRef = {}
    this.currentType = 1
  }

  componentDidMount() {
    this.onGetListCategory({ page: 1 })
    if (isDevelopEnvironment()) {
      firebase.analytics().logEvent('category_view_debug')
    } else {
      firebase.analytics().logEvent('category_view')
    }
  }

  onChangeText = event => {
    this.sendTextChange(event.target.value)
  }

  sendTextChange = text => {
    this.setState(
      {
        keyword: text,
      },
      () => this.onGetListCategory({ page: 1, isLoadMore: false, isSearch: true })
    )
  }

  onGetListCategory = async ({ page = 1, isLoadMore, isSearch, isChangeTab, isPC }) => {
    try {
      const { keyword, totalPage, dataCategory, currentTab, firstSeed } = this.state
      const seedFormat = Math.round(Math.random() * 1000)
      if (!isLoadMore && !isPC) {
        this.setState({
          isLoading: true,
          firstSeed: page === 1 ? seedFormat : firstSeed,
        })
      }
      if (page <= totalPage || isSearch || isChangeTab) {
        const data = await getListCategory({
          page,
          limit: isMobileOnly ? 10 : isTablet ? 20 : 12,
          keyword,
          provinceId: currentTab,
          seed: isPC ? firstSeed : page === 1 ? seedFormat : firstSeed,
        })
        if (data.isSuccess) {
          this.setState({
            dataCategory:
              isSearch || isChangeTab || isPC ? data.data : dataCategory.concat(data.data),
            currentPage: page,
            totalPage: data.paging.total_page,
            isLoading: false,
          })
        }
      }
    } catch (e) {
      // console.warn(e)
    }
  }

  onLoadMore = () => {
    const { currentPage } = this.state
    this.onGetListCategory({ page: currentPage + 1, isLoadMore: true })
  }

  onGoToRestaurant = restaurantItem => {
    const { history } = this.props
    history.push(`/restaurant/${restaurantItem.id}`, { item: restaurantItem })
  }

  onChangeTab = (event, id) => {
    event.preventDefault()
    this.setState(
      {
        currentTab: id,
        defaultPage: 1,
      },
      () => this.onGetListCategory({ isChangeTab: true, page: 1 })
    )
  }

  onChangePagination = (event, pages) => {
    this.onGetListCategory({ page: pages, isPC: true })
    this.setState({
      defaultPage: pages,
    })
  }

  onChangeLanguage = locale => {
    this.setState({
      localeSelect: locale,
    })
  }

  render() {
    const { classes } = this.props
    const {
      dataCategory,
      isLoading,
      totalPage,
      currentPage,
      currentTab,
      category,
      defaultPage,
    } = this.state
    const isHasMore = currentPage < totalPage && dataCategory.length > 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Container className={classes.header} style={{ position: isBrowser && 'inherit' }}>
          <div className={classes.inputContainer}>
            <a style={{ display: 'flex' }} href="https://mycapichi.page.link/order">
              <img alt="logo-header" src={logoHeader} style={{ height: '35px' }} />
            </a>
            <div
              style={{ width: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <LanguageBox onChangeLanguage={this.onChangeLanguage} />
              <CustomInput
                //   onKeyPress={this.handlePressKey}
                placeholder={I18n.t('categoryText.search')}
                onChange={this.onChangeText}
                style={{ width: '100%', marginLeft: '10px', fontSize: '13px' }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: '15px 0',
            }}
          >
            {category.map((value, index) => {
              return (
                <a
                  href="#"
                  key={index}
                  onClick={e => this.onChangeTab(e, value.id)}
                  className={classNames({
                    [classes.tabButton]: true,
                    [classes.isActive]: currentTab === value.id,
                    'tab-item': true,
                  })}
                >
                  {I18n.t(value.label)}
                </a>
              )
            })}
          </div>
        </Container>
        <div style={{ marginTop: isBrowser ? '10px' : '100px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress size={30} color="primary" />
            </div>
          ) : dataCategory.length > 0 ? (
            <InfiniteScroll
              dataLength={dataCategory.length}
              // throttle={100}
              // threshold={300}
              next={isBrowser ? false : this.onLoadMore}
              hasMore={isHasMore}
              style={{
                marginTop: '20px',
              }}
            >
              <Container>
                <Grid container id="list-store-grid">
                  {dataCategory &&
                    dataCategory.length > 0 &&
                    dataCategory.map(value => {
                      return (
                        <CategoryItem onClick={this.onGoToRestaurant} key={value.id} item={value} />
                      )
                    })}
                </Grid>
              </Container>
            </InfiniteScroll>
          ) : (
            <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              {I18n.t('categoryText.dataEmpty')}
            </p>
          )}
        </div>
        {isBrowser && dataCategory.length > 0 && (
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
      </div>
    )
  }
}

Index.propTypes = {
  history: PropTypes.any,
  classes: PropTypes.any,
}

export default withStyles(styles)(Index)
