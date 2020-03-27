import React from 'react'
import Axios from 'axios'
import CustomTable from '../../components/Table/TableCustom'
import { getListStampCard } from '../../api'
import { getObject } from '../../commons'
import { AUTHEN_TOKEN } from '../../constants/define'

const defineValue = {
  name: {
    name: 'title',
    displayName: 'Tiêu đề',
    object: 'title',
    default: '',
  },
  type: {
    name: 'type',
    displayName: 'Loại Stamp',
    object: 'stamp_type',
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
    displayName: 'Stamp đã dùng',
    object: 'used_count',
    default: 0,
  },
}

const columnsStampCard = [
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
    align: 'left',
  },
  { id: defineValue.type.name, label: defineValue.type.displayName, minWidth: 40, align: 'center' },
  {
    id: defineValue.quantity.name,
    label: defineValue.quantity.displayName,
    minWidth: 40,
    align: 'center',
  },
  {
    id: defineValue.used.name,
    label: defineValue.used.displayName,
    minWidth: 40,
    align: 'center',
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

export default function StampCardTable() {
  const [count, setCount] = React.useState(0)

  const onGetData = async ({ page, rowsPerPage }) => {
    if (cancelToken) cancelToken.cancel('a')
    cancelToken = undefined
    cancelToken = getNewCancelToken()
    const authen = localStorage.getItem(AUTHEN_TOKEN)
    const result = await getListStampCard({ authen, page, limit: rowsPerPage, cancel: cancelToken })
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
      maxCount={count}
      onGetData={onGetData}
      columns={columnsStampCard}
      keyProps="id"
      title="Stamp Cards"
      description="Danh sách Stamp Card"
      emptyLabel="Cửa hàng của bạn chưa có stamp card nào. Vui lòng liên hệ với Capichi để được hỗ trợ."
    />
  )
}
