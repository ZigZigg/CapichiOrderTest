const styles = {
  container: {
    // width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
  },
  itemCategory: {
    padding: '0 15px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '1px 20px',
    border: '1px solid #7d7d7d',
  },
  isActive: {
    backgroundColor: '#F7941D',
    color: '#fff',
    border: '1px solid #fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 15px 0 15px',
    position: 'fixed',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    flexDirection: 'column',
    zIndex: '10',
  },
  itemContentCategory: {
    width: '100%',
    height: '135px',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    borderRadius: '7px',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
  image: {
    width: '135px',
    height: '100%',
    objectFit: 'cover',
    borderTopLeftRadius: '7px',
    borderBottomLeftRadius: '7px',
  },
  righContent: {
    width: '100%',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightContentText: {
    fontSize: '12px',
    lineHeight: '16px',
    height: '35px',
    overflow: 'hidden',
  },
  closeText: {
    color: 'red',
  },
  rightTextName: {
    fontSize: '15px',
    fontWeight: 'bold',
    height: '32px',
    lineHeight: '16px',
    overflow: 'hidden',
  },
  itemTimeRange: {
    backgroundColor: '#4287f5',
    padding: '0px 4px',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '11px',
  },
  itemTimeClose: {
    backgroundColor: '#c2c2c2',
    color: 'red',
  },
  expandTime: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '-5px',
  },
}

export default styles
