import React from 'react'
import Axios from 'axios'
import moment from 'moment'
import localization from 'moment/locale/vi'
import CustomTable from '../../../components/Table/TableCustom'
import { getHistoryCoupon } from '../../../api'
import { AUTHEN_TOKEN } from '../../../constants/define'

const defineValue = {
  sku: {
    key: 'sku',
    displayName: 'Mã Voucher',
    object: 'sku',
    default: 0,
  },
  title: {
    key: 'title',
    displayName: 'Tiêu đề',
    object: 'title',
    default: '',
  },
  namePlace: {
    key: 'namePlace',
    displayName: 'Tên chi nhánh',
    object: 'namePlace',
    default: '',
  },
  user: {
    key: 'user',
    displayName: 'Khách hàng',
    object: 'user',
    default: {
      id: 0,
      username: '',
    },
  },
  date: {
    key: 'date',
    displayName: 'Thời gian',
    object: 'date',
    default: '',
  },
}

const columnsCoupon = [
  { id: defineValue.sku.key, label: defineValue.sku.displayName, minWidth: 40 },
  { id: defineValue.namePlace.key, label: defineValue.namePlace.displayName, minWidth: 40 },
  { id: defineValue.title.key, label: defineValue.title.displayName, minWidth: 40 },
  {
    id: defineValue.user.key,
    label: defineValue.user.displayName,
    minWidth: 40,
    align: 'left',
    format: value => value.toLocaleString(),
    type: defineValue.user.object,
  },
  {
    id: defineValue.date.key,
    label: defineValue.date.displayName,
    minWidth: 75,
    align: 'right',
    format: value =>
      moment(value)
        .locale('vi', localization)
        .format('DD-MM-YYYY HH:mm'),
  },
]

const formatDataTable = data => {
  return data.map(item => ({
    ...item,
    [defineValue.sku.key]: `sku-${item.id}`,
    [defineValue.namePlace.key]: item.place.name,
    [defineValue.title.key]: item.title,
    [defineValue.user.key]: item.user.username,
    [defineValue.date.key]: item.date,
    key: Math.random(),
  }))
}

let cancelToken = Axios.CancelToken.source()
const getNewCancelToken = () => {
  return Axios.CancelToken.source()
}

export default function VoucherTable() {
  const [count, setCount] = React.useState(0)

  const onGetData = async ({ page, rowsPerPage }) => {
    if (cancelToken) cancelToken.cancel('a')
    cancelToken = undefined
    cancelToken = getNewCancelToken()
    const authen = localStorage.getItem(AUTHEN_TOKEN)
    const result = await getHistoryCoupon({ authen, page, limit: rowsPerPage, cancel: cancelToken })
    const { isSuccess, message, data, maxCount } = result
    if (!isSuccess) {
      if (message === 'a') return []
      return []
    }
    const newdata = formatDataTable(data)
    setCount(maxCount)
    return newdata
  }

  return (
    <CustomTable
      keyProps="key"
      maxCount={count}
      onGetData={onGetData}
      title="Lịch sử Voucher"
      description="Thống kê lượt sử dụng voucher của người dùng"
      emptyLabel="Hiện chưa có khách hàng nào dùng Voucher"
      columns={columnsCoupon}
      // filter={filter}
    />
  )
}
