import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import CategoryItem from './CategoryItem'
import Grid from '@material-ui/core/Grid'
class Screens extends Component {

    constructor(props){
        super(props)
        this.state= {
            isShow:false
        }
    }

    componentDidMount(){
        console.log('did mount')
    }

    onShow = () => {
        this.setState({isShow: true})
    }

    onHide = () => {
        this.setState({isShow: false})
    }

    testClick= () =>{
        console.log('test click')
    }

    render() {
        const {dataCategory, type} = this.props
        const {isShow} = this.state
        return (
            <>
                    {dataCategory.length > 0 ? (
          <InfiniteScroll
            dataLength={dataCategory.length}
            // throttle={100}
            // threshold={300}
            // next={this.onLoadMore}
            // hasMore={isHasMore}
            style={{
              marginTop: '120px',
              position:isShow ? 'absolute' : 'fixed',
              zIndex: isShow ? 9 : 0,
              display: isShow ? 'block' : 'none'
            }}
          >
              <Grid container>
              {dataCategory &&
                dataCategory.length > 0 &&
                dataCategory.map(value => {
                  return (
                    <CategoryItem onClick={this.onGoToRestaurant} key={value.id} item={value} />
                  )
                  // return <div style={{width:'100%', height:'100px', margin:'20px 0px', backgroundColor:'red'}}></div>
                })}
            </Grid>
            {/* {type === 1 && <Grid container>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'red', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'red', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'red', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'red', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'red', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'red', margin:'20px 0'}}>Halo123123</Grid>
            </Grid>}
            {type === 2 && <Grid container>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'blue', margin:'20px 0'}}>Halo123123</Grid>
            </Grid>}
            {type === 3 &&  <Grid container>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'green', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'green', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'green', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'green', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'green', margin:'20px 0'}}>Halo123123</Grid>
                <Grid item xs={12} style={{width:'100%', height:200, backgroundColor:'green', margin:'20px 0'}}>Halo123123</Grid>
            </Grid>} */}
           
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            店舗が見つかりません
          </p>
        )}
            </>
        )
    }
}

export default Screens