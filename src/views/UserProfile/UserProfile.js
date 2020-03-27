import React, { Component } from 'react'
// @material-ui/core components
import InputLabel from '@material-ui/core/InputLabel'
import PropTypes from 'prop-types'
// core components
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import classnames from 'classnames'
import GridItem from '../../components/Grid/GridItem'
import GridContainer from '../../components/Grid/GridContainer'
import InputOutline from '../../components/CustomInput/InputOutline'
import Card from '../../components/Card/Card'
import CardHeader from '../../components/Card/CardHeader'
import CardBody from '../../components/Card/CardBody'
import { getProfileApi } from '../../api'
import bgImage from '../../assets/img/restaurant-banner.jpg'
import { AUTHEN_TOKEN } from '../../constants/define'
import '../../assets/css/Profile/styles.css'

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
  },
}

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataProfile: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.onGetData()
  }

  onGetData = async () => {
    const authenToken = localStorage.getItem(AUTHEN_TOKEN)
    this.setState({
      isLoading: true,
    })
    const data = await getProfileApi(authenToken)
    if (data.status === 'success') {
      this.setState({
        dataProfile: data.data,
        isLoading: false,
      })
    }
  }

  render() {
    const { classes } = this.props
    const { dataProfile, isLoading } = this.state
    const headerClass = classnames('profile-header', classes.header)
    const headerContentClass = classnames('profile-header--content', classes.headerContent)
    const headerImageClass = classnames('profile-header--image', classes.headerImage)
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader id="user-profile-header" color="primary" className={headerClass}>
                <div className={headerContentClass}>
                  {isLoading ? (
                    <div className={classes.imageLoader}>
                      <CircularProgress size={20} color="inherit" style={{ color: '#000' }} />
                    </div>
                  ) : (
                    <img
                      className={headerImageClass}
                      src={dataProfile && dataProfile.image}
                      alt="..."
                    />
                  )}

                  {/* <img className={classes.headerImage} src={dataProfile && dataProfile.image} alt="..." /> */}
                  <p className={classes.headerText}>{dataProfile && dataProfile.name}</p>
                </div>
              </CardHeader>
              <CardBody>
                {isLoading ? (
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
                      <GridItem xs={12} sm={12} md={12}>
                        <InputLabel style={{ color: '#000' }}>Thông tin nhà hàng</InputLabel>
                        <div className={classes.infoContainer}>
                          <p className={classes.infoText}>
                            {dataProfile && dataProfile.description}
                          </p>
                        </div>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <InputOutline
                          labelText="Tên nhà hàng"
                          id="username"
                          disabled
                          inputProps={{
                            value: dataProfile ? dataProfile.name : '',
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <InputOutline
                          labelText="Địa chỉ Email"
                          id="email-address"
                          disabled
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: dataProfile ? dataProfile.email : '',
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <InputOutline
                          labelText="Tỉnh/Thành Phố"
                          id="city"
                          disabled
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: dataProfile ? dataProfile.city : '',
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                        <InputOutline
                          labelText="Quốc gia"
                          id="country"
                          disabled
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: dataProfile ? dataProfile.country : '',
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4}>
                        <InputOutline
                          labelText="Số điện thoại"
                          id="postal-code"
                          disabled
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: dataProfile ? dataProfile.phone : '',
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <InputOutline
                          labelText="Địa chỉ"
                          id="about-me"
                          disabled
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 1,
                            value: dataProfile ? dataProfile.address : '',
                          }}
                        />
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
      </div>
    )
  }
}

UserProfile.propTypes = {
  classes: PropTypes.any,
}

export default withStyles(styles)(UserProfile)
