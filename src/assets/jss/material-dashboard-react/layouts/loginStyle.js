const appStyle = {
  wrapper: {
    height: '100vh',
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  formView: {
    padding: '12px 50px 20px 50px',
    backgroundColor: '#fff',
    margin: 'auto',
    width: '20%',
    height: '420px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
    boxShadow: '0 0px 10px rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOverlay: {
    position: 'absolute',
    top: '-40px',
    width: '90%',
    padding: '20px 0px',
    textAlign: 'center',
    background: 'linear-gradient(60deg, #faa53e, #F7941D)',
    borderRadius: '8px',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 193, 117,.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: '40px',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '-20px',
  },
  colorRed: {
    color: 'red',
  },
  btnView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}

export default appStyle
