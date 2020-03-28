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
}

export default styles
