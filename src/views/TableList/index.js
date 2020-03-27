import React from 'react'
import CustomTable from '../../components/Table/TableCustom'

export default function StickyHeadTable() {
  const onGetData = () => {
    return new Promise(resolve => {
      resolve('asd')
    })
  }

  return <CustomTable onGetData={onGetData} />
}
