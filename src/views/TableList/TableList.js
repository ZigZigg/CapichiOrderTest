import React, { useState, useEffect } from 'react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// core components
import { TablePagination, TableContainer } from '@material-ui/core'
import GridItem from '../../components/Grid/GridItem'
import GridContainer from '../../components/Grid/GridContainer'
import Table from '../../components/Table/Table'
import Card from '../../components/Card/Card'
import CardHeader from '../../components/Card/CardHeader'
import CardBody from '../../components/Card/CardBody'

const styles = {
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
  root: {
    width: '100%',
  },
  container: {
    maxHeight: window.screen.height - 400,
  },
}

const useStyles = makeStyles(styles)

export default function TableList() {
  // const param = useParams()
  // console.log('TableList -> param', param)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const classes = useStyles()

  useEffect(() => {
    console.log('object')
  }, [currentPage, rowsPerPage])
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>Table on Plain Background</h4>
              <p className={classes.cardCategoryWhite}>Here is a subtitle for this table</p>
            </CardHeader>
            <CardBody>
              <TableContainer className={classes.container}>
                <Table
                  tableHeaderColor="primary"
                  tableHead={['ID', 'Name', 'Country', 'City', 'Salary']}
                  tableData={[
                    ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                    ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                    ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                    ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park'],
                    ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten'],
                    ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester'],
                    ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                    ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                    ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                    ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park'],
                    ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten'],
                    ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester'],
                    ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                    ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                    ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                    ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park'],
                    ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten'],
                    ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester'],
                    ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                    ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                    ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                    ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park'],
                    ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten'],
                    ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester'],
                    ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                    ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                    ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                    ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park'],
                    ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten'],
                    ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester'],
                  ]}
                />
              </TableContainer>
            </CardBody>
          </Card>
          <TablePagination
            // labelDisplayedRows={10}
            count={50}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
            onChangePage={(e, page) => {
              setCurrentPage(page)
            }}
            onChangeRowsPerPage={(a, b) => {
              const newCurrentPage = (rowsPerPage * currentPage) / Number(b.key)
              setRowsPerPage(Number(b.key))
              setCurrentPage(newCurrentPage)
            }}
            page={currentPage}
            component="div"
          />
        </GridItem>
      </GridContainer>
    </>
  )
}
