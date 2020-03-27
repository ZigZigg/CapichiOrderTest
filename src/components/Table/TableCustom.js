/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import { CircularProgress } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Proptypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
// import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import InputBase from '@material-ui/core/InputBase'
import AutocompleteInput from '../CustomInput/AutocompleteInput'
import GridContainer from '../Grid/GridContainer'
import Card from '../Card/Card'
import GridItem from '../Grid/GridItem'
import CardHeader from '../Card/CardHeader'
import CardBody from '../Card/CardBody'
// style cho bảng
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    height: '70vh',
    // padding: 0,
  },
  container2: {
    height: '65vh',
  },
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  position: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,

    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 10,
  },
  back: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  filterContainer: {
    flexWrap: 'nowrap',
  },
  titleFilter: {
    color: '#000000',
    marginRight: '8px',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  buttonfilter: {
    marginRight: '8px',
  },
  containerNullData: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  textNullData: {
    color: '#000000',
    marginRight: '8px',
    fontSize: 18,
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
})

const SelectStyleInput = withStyles(theme => ({
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase)

export default function CustomTable({
  onGetData,
  title,
  description,
  columns,
  keyProps,
  maxCount,
  onClickRow,
  filter,
  filterKeyword,
  emptyLabel,
}) {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [data, setData] = React.useState([])
  const [filterTabler, setFilterTabler] = React.useState(filter.length > 0 ? filter[0].value : null)
  const [keywordFilter, setSearchKeyword] = React.useState('')
  const [emptyLabelState, setEmptyLabelState] = React.useState(emptyLabel)

  const fetchData = async () => {
    try {
      const input = {
        page: page + 1,
        rowsPerPage,
        filter: filterTabler,
        keyword: keywordFilter,
      }
      handleChangeEmptyLabel()
      setLoading(true)
      const newData = await onGetData(input)
      setLoading(false)
      setData(newData)
    } catch (e) {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [page, rowsPerPage, filterTabler, keywordFilter])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeEmptyLabel = () => {
    if (!keywordFilter) {
      setEmptyLabelState(emptyLabel)
    }
  }
  // const changeFilterTable = newFilter => {
  //   // alert(newFilter)
  //   setFilterTabler(newFilter)
  // }

  const onChangeFilterTable = event => {
    setFilterTabler(event.target.value)
  }

  const onChangeSearch = (keyword, emptyText) => {
    console.log('onChangeSearch -> emptyText', emptyText)
    setEmptyLabelState(emptyText)
    setSearchKeyword(keyword)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Grid container>
          {filter && filter.length > 0 && (
            <Grid
              style={{ alignItems: 'center', marginBottom: '10px' }}
              item
              container
              xs={12}
              sm={12}
              md={2}
              lg={3}
            >
              <h4 className={classes.titleFilter}>Hành động:</h4>
              <FormControl style={{ minWidth: 100 }}>
                <Select
                  value={filterTabler}
                  onChange={onChangeFilterTable}
                  input={<SelectStyleInput />}
                >
                  {filter.map((item, index) => (
                    <MenuItem key={index.toString()} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {filterKeyword &&
            filterKeyword.length > 0 &&
            filterKeyword.map((value, index) => (
              <Grid
                style={{ alignItems: 'center', marginBottom: '10px' }}
                item
                container
                xs={12}
                sm={12}
                md={4}
                lg={4}
              >
                <h4 className={classes.titleFilter}>{value.label}</h4>
                <AutocompleteInput
                  emptyText={value.emptyText}
                  onChangeSearch={onChangeSearch}
                  key={index.toString()}
                  keyFilter={value.key}
                  filterFunction={value.function}
                />
              </Grid>
            ))}
        </Grid>

        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>{title}</h4>
            <p className={classes.cardCategoryWhite}>{description}</p>
          </CardHeader>
          <CardBody className={classes.container}>
            {data && data.length > 0 ? (
              <>
                <TableContainer className={classes.container2}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map(column => (
                          <TableCell
                            key={column.id}
                            id={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, width: column.width }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map(row => {
                        return (
                          <TableRow
                            onClick={onClickRow}
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row[keyProps]}
                          >
                            {columns.map(column => {
                              const value = row[column.id]
                              if (column.typeColumn === 'action' && column.type === 'edit') {
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    <Link to={{ pathname: `detailStamp/${row.id}` }}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={row.disabled}
                                        // className={classes.buttonfilter}
                                        onClick={() => {}}
                                      >
                                        {column.format ? column.format(value) : value}
                                      </Button>
                                    </Link>
                                  </TableCell>
                                )
                              }
                              return (
                                <TableCell
                                  style={{ wordBreak: 'break-word' }}
                                  key={column.id}
                                  align={column.align}
                                >
                                  {column.format ? column.format(value) : value || ''}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={maxCount || data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  labelRowsPerPage="Số dòng trên một trang"
                />
              </>
            ) : !loading && data.length === 0 ? (
              <div>
                <p style={{ fontSize: '20px', textAlign: 'center' }}>{emptyLabelState}</p>
              </div>
            ) : null}
            {loading ? (
              <div className={data.length > 0 ? classes.back : classes.position}>
                <CircularProgress size={60} />
              </div>
            ) : null}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}

CustomTable.propTypes = {
  onGetData: Proptypes.func,
  filterKeyword: Proptypes.any,
  emptyLabel: Proptypes.any,
  columns: Proptypes.array,
  title: Proptypes.string,
  description: Proptypes.string,
  keyProps: Proptypes.string,
  maxCount: Proptypes.number,
  onClickRow: Proptypes.func,
  filter: Proptypes.array,
}

CustomTable.defaultProps = {
  onGetData: () => {
    return new Promise(resolve => {
      resolve([])
    })
  },
  columns: [],
  title: 'No name',
  description: 'Here is a subtitle for this table',
  keyProps: 'id',
  onClickRow: () => {},
  filter: [],
}
