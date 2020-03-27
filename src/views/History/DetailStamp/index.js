/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
// @material-ui/core components
// import InputLabel from '@material-ui/core/InputLabel'
import PropTypes from 'prop-types'
// core components
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { Alert } from '@material-ui/lab'

// import classnames from 'classnames'
import GridItem from '../../../components/Grid/GridItem'
import GridContainer from '../../../components/Grid/GridContainer'
import InputOutline from '../../../components/CustomInput/InputOutline'
import Card from '../../../components/Card/Card'
import CardHeader from '../../../components/Card/CardHeader'
import CardBody from '../../../components/Card/CardBody'
// import TextInfo from '../../../components/Typography/Info'
import {
  editHistoryStampCard,
  getHistoryEditedStampCard,
  getDetailHistoryStamp,
} from '../../../api'
import bgImage from '../../../assets/img/restaurant-banner.jpg'
import { AUTHEN_TOKEN } from '../../../constants/define'
import '../../../assets/css/Profile/styles.css'

class DetailStamp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoadingDetail: false,
      isLoadingHistory: false,
      pageHistoryEdited: 0,
      maxPageHistoryEdited: 10,
      money: 10000,
      disableSave: true,
      dataDetail: {},
      error: undefined,
      dataHistoryEdited: [],
    }
  }

  componentDidMount() {
    this.onGetDetailHistory()
    this.onGetHistoryEdited()
  }

  onGetDetailHistory = async () => {
    const { match } = this.props
    const { id } = match.params || {}
    const authenToken = localStorage.getItem(AUTHEN_TOKEN)
    const input = {
      id,
      authenToken,
    }
    this.setState({
      isLoadingDetail: true,
    })
    const data = await getDetailHistoryStamp(input)
    if (data.isSuccess) {
      this.setState({
        isLoadingDetail: false,
        dataDetail: data.data,
        money: data.data.money,
        error: undefined,
        // dataHistoryEdited: data.data,
      })
    } else this.setState({ error: data.message, isLoadingDetail: false })
  }

  onGetHistoryEdited = async () => {
    const { match } = this.props
    const { id } = match.params || {}
    const {
      pageHistoryEdited,
      maxPageHistoryEdited,
      dataHistoryEdited,
      isLoadingHistory,
    } = this.state
    const authenToken = localStorage.getItem(AUTHEN_TOKEN)
    const input = {
      page: pageHistoryEdited + 1,
      id,
      authenToken,
    }
    this.setState({
      isLoadingHistory: true,
    })
    if (pageHistoryEdited < maxPageHistoryEdited && !isLoadingHistory) {
      const data = await getHistoryEditedStampCard(input)
      // console.log({ data })
      if (data.isSuccess) {
        this.setState({
          isLoadingHistory: false,
          pageHistoryEdited: pageHistoryEdited + 1,
          dataHistoryEdited: [...dataHistoryEdited, ...data.data],
          maxPageHistoryEdited: data.maxPage,
        })
      } else this.setState({ error: data.message })
    }
  }

  onSaveData = async () => {
    const { match } = this.props
    const { id } = match.params || {}
    const { history } = this.props
    const { money } = this.state
    const authenToken = localStorage.getItem(AUTHEN_TOKEN)
    const input = {
      money,
      id,
      authenToken,
    }
    const data = await editHistoryStampCard(input)
    if (data.isSuccess) {
      this.setState({
        disableSave: true,
      })
      history.goBack()
    } else this.setState({ error: data.message })
  }

  changeMoneyStamp = event => {
    this.setState({ money: Number(event.target.value), disableSave: false })
  }

  renderHistoryEdited = () => {
    const { classes } = this.props
    const {
      isLoadingHistory,
      pageHistoryEdited,
      maxPageHistoryEdited,
      dataHistoryEdited,
    } = this.state
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>Lịch sử chỉnh sửa</h4>
            </CardHeader>
            <CardBody>
              {dataHistoryEdited.length > 0
                ? dataHistoryEdited.map(item => {
                    return (
                      <GridContainer key={Math.random()}>
                        <GridItem xs={12} sm={12} md={10}>
                          <div className={classes.containerItemHistory}>
                            <p className={classes.textItemHistory}>
                              Tài khoản: {item.user.username} đã thay đổi giá trị hoá đơn:
                            </p>
                            <p className={classes.textItemHistory}>
                              Từ {item.old_money} VNĐ => {item.new_money} VNĐ
                            </p>
                          </div>
                        </GridItem>
                      </GridContainer>
                    )
                  })
                : null}
              {isLoadingHistory ? (
                <div className={classes.contentLoader}>
                  <CircularProgress
                    size={40}
                    color="inherit"
                    style={{ color: '#000', marginBottom: '20px' }}
                  />
                </div>
              ) : null}
              {pageHistoryEdited < maxPageHistoryEdited && !isLoadingHistory ? (
                <div className={classes.contentLoader}>
                  <GridContainer>
                    <GridItem>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.buttonfilter}
                        onClick={this.onGetHistoryEdited}
                      >
                        Hiển thị thêm
                      </Button>
                    </GridItem>
                  </GridContainer>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    )
  }

  render() {
    const { classes } = this.props
    const { isLoadingDetail, money, disableSave, dataDetail, error } = this.state
    const { place, user, quantity, id } = dataDetail || {}
    const { name, address } = place || {}
    const { username } = user || {}
    return (
      <div>
        {error && (
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        )}
        <GridContainer>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader plain color="primary">
                <h4 className={classes.cardTitleWhite}>Sku-{id}</h4>
              </CardHeader>
              <CardBody>
                {isLoadingDetail ? (
                  <div className={classes.contentLoader}>
                    <CircularProgress
                      size={40}
                      color="inherit"
                      style={{ color: '#000', marginBottom: '20px' }}
                    />
                  </div>
                ) : (
                  <>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <InputOutline
                          labelText="Tên địa điểm"
                          id="namePlace"
                          disabled
                          inputProps={{
                            value: name || '',
                            name: 'namePLace',
                            // onChange: val => console.log(val.target.value),
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <InputOutline
                          labelText="Địa chỉ"
                          id="addressPlace"
                          disabled
                          inputProps={{
                            value: address || '',
                            name: 'addressPlace',
                            // onChange: val => console.log(val.target.value),
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <InputOutline
                          labelText="Người dùng"
                          id="user"
                          disabled
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: username || '',
                            name: 'user',
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <InputOutline
                          labelText="Số tiền"
                          id="moneyStamp"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: money || 0,
                            name: 'moneyStamp',
                            onChange: this.changeMoneyStamp,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                        <InputOutline
                          labelText="Số Stamp"
                          id="numberStamp"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          disabled
                          inputProps={{
                            value: quantity || 0,
                            name: 'numberStamp',
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem>
                        <Button
                          variant="contained"
                          color={disableSave ? 'default' : 'primary'}
                          disabled={disableSave}
                          className={classes.buttonfilter}
                          onClick={this.onSaveData}
                        >
                          Lưu
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </>
                )}
              </CardBody>
              {/* <CardFooter>
                <Button color="primary">Update Profile</Button>
              </CardFooter> */}
            </Card>
          </GridItem>
        </GridContainer>
        {this.renderHistoryEdited()}
      </div>
    )
  }
}

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  infoContainer: {
    width: '100%',
    marginTop: '20px',
  },
  infoText: {
    maxWidth: '100%',
    padding: '0px 20px',
    textAlign: 'justify',
  },
  header: {
    backgroundImage: `url(${bgImage}) !important`,
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(79, 76, 73,.4) !important',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 center',
  },
  headerContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '3px',
    padding: '20px 30px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerImage: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    marginRight: '30px',
  },
  headerText: {
    fontSize: '25px',
    color: '#fff',
  },
  imageLoader: {
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#f2f2f2',
    marginRight: '30px',
  },
  contentLoader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  formControl: {
    margin: '20px',
  },
  buttonfilter: {
    marginTop: '10px',
  },
  containerItemHistory: {
    marginTop: '8px',
    width: '100%',
    padding: '20px 10px',
    borderBottomColor: '#faa53e',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
  },
  textItemHistory: {
    color: '#000000',
    opacity: '0.89',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    fontSize: '14px',
  },
}

DetailStamp.propTypes = {
  classes: PropTypes.any,
  history: PropTypes.any,
  match: PropTypes.any,
}

export default withStyles(styles)(DetailStamp)
