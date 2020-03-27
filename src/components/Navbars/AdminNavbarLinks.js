// /*eslint-disable*/
import React from 'react'
import classNames from 'classnames'
import Proptypes from 'prop-types'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Hidden from '@material-ui/core/Hidden'
import Poppers from '@material-ui/core/Popper'
import Divider from '@material-ui/core/Divider'
// @material-ui/icons
import Person from '@material-ui/icons/Person'
// import Notifications from '@material-ui/icons/Notifications'
// import Dashboard from '@material-ui/icons/Dashboard'
// import Search from '@material-ui/icons/Search'
import { withRouter } from 'react-router-dom'
import { logOutApi } from '../../api'
import { AUTHEN_TOKEN } from '../../constants/define'
// core components
// import CustomInput from '../CustomInput/CustomInput'
import Button from '../CustomButtons/Button'

import styles from '../../assets/jss/material-dashboard-react/components/headerLinksStyle'

const useStyles = makeStyles(styles)

function AdminNavbarLinks(props) {
  const classes = useStyles()
  // const [openNotification, setOpenNotification] = React.useState(null)
  const [openProfile, setOpenProfile] = React.useState(null)
  // const handleClickNotification = event => {
  //   if (openNotification && openNotification.contains(event.target)) {
  //     setOpenNotification(null)
  //   } else {
  //     setOpenNotification(event.currentTarget)
  //   }
  // }
  // const handleCloseNotification = () => {
  //   setOpenNotification(null)
  // }
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null)
    } else {
      setOpenProfile(event.currentTarget)
    }
  }
  const handleCloseProfile = async () => {
    setOpenProfile(null)
  }

  const handleLogOut = async () => {
    const { history } = props
    const authenToken = localStorage.getItem(AUTHEN_TOKEN)
    const data = await logOutApi(authenToken)
    if (data.status === 'success') {
      localStorage.removeItem(AUTHEN_TOKEN)
      history.push('/login')
      setOpenProfile(null)
    }
  }

  const onGoToProfile = () => {
    const { history } = props
    history.push('user')
  }

  return (
    <div>
      {/* <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: `${classes.margin  } ${  classes.search}`
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search"
            }
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div> */}
      {/* <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Dashboard"
        className={classes.buttonLink}
      >
        <Dashboard className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Dashboard</p>
        </Hidden>
      </Button> */}
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? 'profile-menu-list-grow' : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={`${classNames({ [classes.popperClose]: !openProfile })} ${classes.popperNav}`}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem onClick={onGoToProfile} className={classes.dropdownItem}>
                      Profile
                    </MenuItem>
                    <Divider light />
                    <MenuItem onClick={handleLogOut} className={classes.dropdownItem}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  )
}

AdminNavbarLinks.propTypes = {
  history: Proptypes.any,
}

export default withRouter(AdminNavbarLinks)
