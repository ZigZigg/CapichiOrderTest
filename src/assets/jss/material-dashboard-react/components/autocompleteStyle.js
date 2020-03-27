const autocompleteStyle = {
  main: {
    position: 'relative',
    zIndex: 10,
  },
  suggestArea: {
    position: 'absolute',
    top: '50px',
    left: 0,
    width: '100%',
    maxHeight: '200px',
    minHeight: '35px',
    overflow: 'scroll',
    overflowX: 'hidden',
    borderRadius: '4px',
    backgroundColor: '#fff',
    border: '1px solid #ced4da',
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    color: 'red',
  },
  hideArea: {
    display: 'none',
  },
  item: {
    color: '#000',
    padding: '5px 10px',
    '&:hover': {
      backgroundColor: '#f7f7f7',
      color: '#000',
    },
  },
}

export default autocompleteStyle
