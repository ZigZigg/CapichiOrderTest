const styles = {
  wrapper: {
    // display: '0 24px',
  },
  container: {
    padding: '40px 24px 0px 24px',
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
  name: {
    fontSize: '18px',
    color: '##454F63',
  },
  address: {
    fontSize: '12px',
    marginLeft: '5px',
  },
  itemOrder: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '60px',
    margin: '10px 0px',
  },
  imgItem: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0px 5px 0px',
  },
  nameItem: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '12px',
    width: '45%',
  },
  textItem: {
    fontSize: '12px',
    color: '#1E1F21',
  },
  shippingBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid #707070',
    height: '35px',
  },
  totalBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10px',
  },
  shippingContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: '10px 0',
  },
  input: {
    fontSize: '12px',
    width: '100%',
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
  inputContainer: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
  },
  error: {
    fontSize: '10px',
    color: 'red',
    lineHeight: '15px',
  },
}

export default styles
