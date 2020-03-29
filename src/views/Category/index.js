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

const CustomInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    margin: 'auto',
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

class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dataCategory: [],
      currentPage: 1,
      totalPage: 10,
      keyword: '',
      isLoading: false,
    }
    this.sendTextChange = _.debounce(this.sendTextChange, 400)
  }

  componentDidMount() {
    this.onGetListCategory()
  }

  onChangeText = event => {
    this.sendTextChange(event.target.value)
  }

  sendTextChange = text => {
    this.setState(
      {
        keyword: text,
      },
      () => this.onGetListCategory(1, false, true)
    )
  }

  onGetListCategory = async (page = 1, isLoadMore, isSearch) => {
    try {
      const { keyword, totalPage, dataCategory } = this.state
      if (!isLoadMore) {
        this.setState({
          isLoading: true,
        })
      }

      if (page <= totalPage || isSearch) {
        const data = await getListCategory({ page, limit: 10, keyword })
        if (data.isSuccess) {
          this.setState({
            dataCategory: isSearch ? data.data : dataCategory.concat(data.data),
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
    this.onGetListCategory(currentPage + 1, true)
  }

  onGoToRestaurant = restaurantItem => {
    const { history } = this.props
    history.push(`/restaurant/${restaurantItem.id}`, { item: restaurantItem })
  }

  render() {
    // const { classes } = this.props
    const { dataCategory, isLoading, totalPage, currentPage } = this.state
    const isHasMore = currentPage < totalPage && dataCategory.length > 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CustomInput
            //   onKeyPress={this.handlePressKey}
            placeholder="Search restaurant by name..."
            onChange={this.onChangeText}
          />
        </div>
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
            loader={
              isHasMore && (
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ marginTop: '10px', margin: 'auto' }}
                />
              )
            }
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
                })}
            </Grid>
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            Can not found any Restaurant
          </p>
        )}
      </div>
    )
  }
}

Index.propTypes = {
  history: PropTypes.any,
  // classes: PropTypes.any,
}

export default withStyles(styles)(Index)
