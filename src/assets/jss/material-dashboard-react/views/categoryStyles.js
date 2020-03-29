const styles = {
  container: {
    // width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
  },
  itemCategory: {
    padding: '0 24px',
  },
  itemContentCategory: {
    width: '100%',
    height: '130px',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    borderRadius: '7px',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
  image: {
    width: '130px',
    height: '100%',
    objectFit: 'inherit',
    borderTopLeftRadius: '7px',
    borderBottomLeftRadius: '7px',
  },
  righContent: {
    width: '100%',
    padding: '10px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightContentText: {
    fontSize: '14px',
    lineHeight: '18px',
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
}

export default styles
