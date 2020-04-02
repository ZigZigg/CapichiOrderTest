/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react'
import { withStyles, fade } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '../../assets/jss/material-dashboard-react/views/categoryStyles'
import { getListCategory } from '../../api'
import CategoryItem from './CategoryItem'
import classNames from 'classnames'
import Screens from './Screens'
import logoHeader from '../../assets/img/logo-order.png'
// const category = [{id:0, label:'Ha Noi'}, {id:1, label:'HCM'}, {id:2, label:'Hai Phong'}]


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
    fontSize: 16,
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
      currentTab:190,
      category:[{id:190, label:'Ha Noi', data:null}, {id:192, label:'HCM', data:null}, {id:191, label:'Hai Phong', data:null}]
    }
    this.sendTextChange = _.debounce(this.sendTextChange, 400)
    this.listRef = {}
    this.currentType = 1
  }

  componentDidMount() {
    this.onGetListCategory({page:1})
  }

  onChangeText = event => {
    this.sendTextChange(event.target.value)
  }

  sendTextChange = text => {
    this.setState(
      {
        keyword: text,
      },
      () => this.onGetListCategory({page:1, isLoadMore:false, isSearch:true})
    )
  }

  onGetListCategory = async ({page = 1, isLoadMore, isSearch, isChangeTab}) => {
    try {
      const { keyword, totalPage, dataCategory, currentTab } = this.state
      if (!isLoadMore) {
        this.setState({
          isLoading: true,
        })
      }

      if (page <= totalPage || isSearch || isChangeTab) {
        const data = await getListCategory({ page, limit: 10, keyword, provinceId:currentTab })
        if (data.isSuccess) {
          this.setState({
            dataCategory: (isSearch || isChangeTab) ? data.data : dataCategory.concat(data.data),
            currentPage: page,
            totalPage: data.paging.total_page,
            isLoading: false,
          })
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  onLoadMore = () => {
    const { currentPage } = this.state
    this.onGetListCategory({page: currentPage + 1, isLoadMore:true})
  }

  onGoToRestaurant = restaurantItem => {
    const { history } = this.props
    history.push(`/restaurant/${restaurantItem.id}`, { item: restaurantItem })
  }



  onChangeTab = id =>{
    this.setState({
      currentTab:id
    }, () =>this.onGetListCategory({isChangeTab:true, page:1}))
  }



  render() {
    const { classes } = this.props
    const { dataCategory, isLoading, totalPage, currentPage, currentTab, category } = this.state
    const isHasMore = currentPage < totalPage && dataCategory.length > 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <div
          className={classes.header}
        >
          <div className={classes.inputContainer}>
            <a style={{display:'flex'}} href='https://mycapichi.page.link/order'>
            <img alt='logo-header' src={logoHeader} style={{height:'35px'}} />
            </a>

          <CustomInput
            //   onKeyPress={this.handlePressKey}
            placeholder="名前で店舗を探す..."
            onChange={this.onChangeText}
            style={{ width: '60%' }}
          />
          </div>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', margin:'15px 0'}}>
            {category.map(value =>{
              return <div onClick={() => this.onChangeTab(value.id)} className={classNames({[classes.tabButton]:true, [classes.isActive]: currentTab === value.id})}>{value.label}</div>
            })}
          </div>

        </div>
        <div style={{marginTop:'90px'}}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress size={30} color="primary" />
          </div>
        ) : dataCategory.length > 0 ? (
          <InfiniteScroll
            dataLength={dataCategory.length}
            // throttle={100}
            // threshold={300}
            next={this.onLoadMore}
            hasMore={isHasMore}
            style={{
              marginTop: '20px',
            }}
          >
            <Grid container>
              {dataCategory &&
                dataCategory.length > 0 &&
                dataCategory.map(value => {
                  return (
                    <CategoryItem onClick={this.onGoToRestaurant} key={value.id} item={value} />
                  )
                  // return <div style={{width:'100%',height:'100px', margin:'20px 0', backgroundColor:'red'}}></div>
                })}
            </Grid>
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            店舗が見つかりません
          </p>
        )}
        </div>

      </div>
    )
  }
}

Index.propTypes = {
  history: PropTypes.any,
  // classes: PropTypes.any,
}

export default withStyles(styles)(Index)
