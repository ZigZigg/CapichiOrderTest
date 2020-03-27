import React from 'react'
import moment from 'moment'
import Axios from 'axios'
import localization from 'moment/locale/vi'
import { getHistoryStampCard, getListUserApi } from '../../../api'
import CustomTable from '../../../components/Table/TableCustom'
import { AUTHEN_TOKEN } from '../../../constants/define'

const defineValue = {
  sku: {
    key: 'sku',
    displayName: 'Mã Stamp',
    object: 'sku',
    default: '',
  },
  namePlace: {
    key: 'namePlace',
    displayName: 'Tên chi nhánh',
    object: 'namePlace',
    default: '',
  },
  detail: {
    key: 'detail',
    displayName: 'Ưu đãi',
    object: 'detail',
    default: '',
  },
  typeStamp: {
    key: 'typeStamp',
    displayName: 'Loại Stamp',
    object: 'typeStamp',
    default: '',
  },
  typeAction: {
    key: 'typeAction',
    displayName: 'Hành động',
    object: 'typeAction',
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
  edit: {
    key: 'edit',
    displayName: 'Chỉnh sửa',
    object: 'edit',
    default: '',
    typeColumn: 'action',
  },
  quantity: {
    key: 'quantity',
    displayName: 'Số lượng',
    object: 'quantity',
    default: '',
  },
  money: {
    key: 'money',
    displayName: 'Số tiền',
    object: 'money',
    default: '',
  },
}

const columnsStamp = [
  { id: defineValue.sku.key, label: defineValue.sku.displayName, minWidth: 40 },
  { id: defineValue.namePlace.key, label: defineValue.namePlace.displayName, minWidth: 40 },
  { id: defineValue.quantity.key, label: defineValue.quantity.displayName, minWidth: 40 },
  { id: defineValue.money.key, label: defineValue.money.displayName, minWidth: 40 },
  { id: defineValue.typeStamp.key, label: defineValue.typeStamp.displayName, minWidth: 40 },
  { id: defineValue.typeAction.key, label: defineValue.typeAction.displayName, minWidth: 40 },
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
  {
    id: defineValue.edit.key,
    label: defineValue.edit.displayName,
    minWidth: 40,
    align: 'center',
    typeColumn: defineValue.edit.typeColumn,
    type: defineValue.edit.object,
  },
]

const formatDataTable = data => {
  return data.map(item => ({
    ...item,
    [defineValue.sku.key]: `sku-${item.stamp_id}`,
    [defineValue.namePlace.key]: item.place.name,
    [defineValue.detail.key]: item.action === 'added' ? '' : item.detail,
    [defineValue.typeAction.key]: item.action === 'used' ? 'Sử dụng Stamp' : 'Tích Stamp',
    [defineValue.typeStamp.key]: item.type,
    [defineValue.user.key]: item.user.username,
    [defineValue.date.key]: item.date,
    [defineValue.edit.key]: 'Review/Edit',
    key: Math.random(),
    disabled: item.action !== 'added',
    [defineValue.quantity.key]: item.quantity,
    [defineValue.money.key]: item.money,
  }))
}

const listFilter = [
  { value: 'all', label: 'Tất cả' },
  { value: 'added', label: 'Tích Stamp' },
  { value: 'used', label: 'Sử dụng Stamp' },
]

let cancelToken = Axios.CancelToken.source()
const getNewCancelToken = () => {
  return Axios.CancelToken.source()
}

export default function CouponTable() {
  const [count, setCount] = React.useState(0)

  const onGetData = async ({ page, rowsPerPage, filter, keyword = '' }) => {
    console.log('onGetData -> keyword', keyword)
    if (cancelToken) cancelToken.cancel('a')
    cancelToken = undefined
    cancelToken = getNewCancelToken()
    const authen = localStorage.getItem(AUTHEN_TOKEN)
    const result = await getHistoryStampCard({
      authen,
      page,
      limit: rowsPerPage,
      cancel: cancelToken,
      filter,
      keyword,
    })
    const { isSuccess, message, data, maxCount } = result
    if (!isSuccess) {
      if (message === 'a') return []
      return []
    }
    const newdata = await formatDataTable(data)
    setCount(maxCount)
    return newdata
  }

  const filterKeywordArray = [
    {
      function: getListUserApi,
      key: 'username',
      label: 'Khách hàng',
      emptyText: 'Hiện khách hàng này chưa sử dụng bất kì stamp nào',
    },
  ]

  return (
    <CustomTable
      keyProps="key"
      maxCount={count}
      onGetData={onGetData}
      title="Stamps"
      description="Thống kê lượt sử dụng Stamp của người dùng"
      columns={columnsStamp}
      filter={listFilter}
      emptyLabel="Hiện chưa có khách hàng nào dùng Stamp"
      filterKeyword={filterKeywordArray}
    />
  )
}
