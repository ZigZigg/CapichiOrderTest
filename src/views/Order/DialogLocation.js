import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
// import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import Axios from 'axios'
import { API_GOOGLE_KEY } from '../../constants/define'
import { mainColor } from '../../constants/styles'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: mainColor,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function LocationDialog(props) {
  const classes = useStyles()
  const [address, setAddress] = React.useState('')
  const [dataSuggest, setDataSuggest] = React.useState([])
  const { open, onClose } = props

  // const handleOk = () => {
  //   onOk()
  // }

  const handleClose = () => {
    onClose()
  }

  const onChooseItem = async item => {
    const { onChooseLocation } = props
    const response = await Axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&fields=name,formatted_address,address_component,geometry&key=${API_GOOGLE_KEY}`,
      { timeout: 30000 }
    )
    onChooseLocation(response)
    onClose()
  }

  const onChangeText = async event => {
    setAddress(event.target.value)
    const response = await Axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${event.target.value}&key=${API_GOOGLE_KEY}`,
      { timeout: 30000 }
    )
    const { predictions } = response.data
    setDataSuggest(predictions)
  }

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Địa chỉ giao hàng
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ padding: 16 }}>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            placeholder="Địa chỉ"
            type="address"
            value={address}
            onChange={onChangeText}
            fullWidth
          />
        </div>
        <List>
          {dataSuggest.map(item => (
            <div key={Math.random()}>
              <ListItem button onClick={() => onChooseItem(item)}>
                <ListItemText
                  primary={item.structured_formatting.main_text}
                  secondary={item.description}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Dialog>
    </div>
  )
}

LocationDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChooseLocation: PropTypes.func,
  // onOk: PropTypes.func,
  // errorPhone: PropTypes.string,
  // phone: PropTypes.string,
  // onChangeText: PropTypes.string,
  // onFocusInput: PropTypes.string,
}
