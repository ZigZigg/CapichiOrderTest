const styles = {
  wrapper: {
    // height: '100vh',
    // position: 'relative',
    display: 'flex',
  },
  container: {
    padding: '0 24px',
    // overflow: 'scroll',
    // overflowX: 'hidden',
    // height: '85vh',
    paddingTop: '55px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    width: '100%',
    backgroundColor: '#fff',
    zIndex: '10',
  },
  headerLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: '150px',
    borderRadius: '10px',
    // marginTop: '10px',
    marginBottom: '5px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  name: {
    fontSize: '16px',
  },
  address: {
    fontSize: '12px',
    marginLeft: '5px',
  },
  btnContainer: {
    position: 'fixed',
    bottom: '-2px',
    width: '100%',
    height: '60px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemMenu: {
    width: '100%',
    height: '60px',
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  imageMenu: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    width: '100%',
  },
  textContent: {
    fontSize: '12px',
    height: '30px',
    overflow: 'hidden',
    lineHeight: '16px',
    display: 'flex',
    // alignItems: 'center',
  },
  closeText: {
    color: 'red',
  },
  action: {
    display: 'flex',
    postition: 'absolute',
    right: '0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconAdd: {
    width: '20px',
    height: '20px',
  },
  closeBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0px',
  },
  itemTimeRange:{
    backgroundColor:'#852032',
    padding:'0px 5px',
    borderRadius:'5px',
    margin:'0 10px 0 0',
    color:'#fff',
    fontSize:'11px'
  },
  itemTimeClose:{
    backgroundColor:'#c2c2c2',
    color:'red'
  },
  rightContentText:{
    fontSize:'14px',
    marginBottom:'5px'
  }
}

export default styles
