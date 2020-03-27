import React from 'react'
import moment from 'moment'
import Axios from 'axios'
import localization from 'moment/locale/vi'
import CustomTable from '../../components/Table/TableCustom'
import { getListCoupon } from '../../api'
import { getObject } from '../../commons'
import { AUTHEN_TOKEN } from '../../constants/define'

const defineValue = {
  name: {
    name: 'title',
    displayName: 'Tên Voucher',
    object: 'title',
    default: '',
  },
  type: {
    name: 'type',
    displayName: 'type',
    object: 'type',
    default: '',
  },
  resName: {
    name: 'resName',
    displayName: 'Tên chi nhánh',
    object: 'place.name',
    default: '',
  },
  resAddress: {
    name: 'resAddress',
    displayName: 'Địa chỉ',
    object: 'place.address',
    default: '',
  },
  image: {
    name: 'image',
    displayName: 'Hình ảnh',
    object: 'image',
    default: '',
  },
  startTime: {
    name: 'start',
    displayName: 'Ngày bắt đầu',
    object: 'start_date',
    default: '',
  },
  endTime: {
    name: 'end',
    displayName: 'Ngày kết thúc',
    object: 'end_date',
    default: '',
  },
  quantity: {
    name: 'quantity',
    displayName: 'Số lượng',
    object: 'quantity',
    default: '',
  },
  used: {
    name: 'used',
    displayName: 'Đã dùng',
    object: 'used_count',
    default: 0,
  },
}

const columnsCoupon = [
  { id: defineValue.name.name, label: defineValue.name.displayName, minWidth: 40 },
  {
    id: defineValue.resName.name,
    label: defineValue.resName.displayName,
    minWidth: 40,
    // align: 'right',
  },
  {
    id: defineValue.resAddress.name,
    label: defineValue.resAddress.displayName,
    minWidth: 40,
    // align: 'right',
  },

  {
    id: defineValue.startTime.name,
    label: defineValue.startTime.displayName,
    minWidth: 75,
    align: 'right',
    format: value =>
      moment(value)
        .locale('vi', localization)
        .format('DD-MM-YYYY HH:mm'),
  },
  {
    id: defineValue.endTime.name,
    label: defineValue.endTime.displayName,
    minWidth: 75,
    align: 'right',
    format: value =>
      moment(value)
        .locale('vi', localization)
        .format('DD-MM-YYYY HH:mm'),
  },
  {
    id: defineValue.quantity.name,
    label: defineValue.quantity.displayName,
    minWidth: 40,
    align: 'right',
  },
  {
    id: defineValue.used.name,
    label: defineValue.used.displayName,
    minWidth: 40,
    align: 'right',
  },
]

function createData({
  id,
  title,
  image,
  type,
  startTime,
  endTime,
  quantity,
  used,
  resAddress,
  resName,
}) {
  return {
    id,
    [defineValue.name.name]: title,
    [defineValue.image.name]: image,
    [defineValue.type.name]: type,
    [defineValue.startTime.name]: startTime,
    [defineValue.endTime.name]: endTime,
    [defineValue.quantity.name]: quantity,
    [defineValue.resAddress.name]: resAddress,
    [defineValue.resName.name]: resName,
    [defineValue.used.name]: used || defineValue.used.default,
  }
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
    const result = await getListCoupon({ authen, page, limit: rowsPerPage, cancel: cancelToken })
    const { isSuccess, message, data, maxCount } = result
    if (!isSuccess) {
      if (message === 'a') return []
      return []
    }
    const newData = await data.map(i =>
      createData({
        id: i.id,
        title: getObject(i, defineValue.name.object),
        type: getObject(i, defineValue.type.object),
        startTime: getObject(i, defineValue.startTime.object),
        quantity: getObject(i, defineValue.quantity.object),
        endTime: getObject(i, defineValue.endTime.object),
        image: getObject(i, defineValue.image.object),
        used: getObject(i, defineValue.used.object) || 0,
        resAddress: getObject(i, defineValue.resAddress.object),
        resName: getObject(i, defineValue.resName.object),
      })
    )
    setCount(maxCount)

    return newData
  }

  return (
    <CustomTable
      keyProps="id"
      maxCount={count}
      onGetData={onGetData}
      title="Voucher"
      columns={columnsCoupon}
      description="Danh sách Voucher"
      emptyLabel="Cửa hàng của bạn chưa có voucher nào. Vui lòng liên hệ với Capichi để được hỗ trợ."
    />
  )
}
