/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
// import Person from '@material-ui/icons/Person'
// import LibraryBooks from '@material-ui/icons/LibraryBooks'
// core components/views for Admin layout
// import DashboardPage from './views/Dashboard/Dashboard'
// import UserProfile from './views/UserProfile/UserProfile'
// import Typography from './views/Typography/Typography'
// core components/views for RTL layout
// import VoucherList from './views/History/VoucherList'
// import StampList from './views/History/StampList'
// import DetailStamp from './views/History/DetailStamp'
// import VoucherTable from './views/Voucher'
// import StampCardTable from './views/StampCard'

const brandRouters = [
  // {
  //   path: '/voucher/new',
  //   name: 'DetailStamp',
  //   icon: LibraryBooks,
  //   component: DetailStamp,
  //   layout: '/admin',
  //   invisible: true,
  // },
  // {
  //   path: '/detailStamp/:id',
  //   name: 'Chi tiết Stamp',
  //   icon: LibraryBooks,
  //   component: DetailStamp,
  //   layout: '/admin',
  //   invisible: true,
  // },
]

const dashboardRoutes = [
  // {
  //   path: '/user',
  //   name: 'Thông tin nhà hàng',
  //   icon: Person,
  //   component: UserProfile,
  //   layout: '/admin',
  // },
  // {
  //   path: '/voucher',
  //   name: 'Voucher',
  //   icon: LibraryBooks,
  //   component: VoucherTable,
  //   layout: '/admin',
  // },
  // {
  //   path: '/stampCard',
  //   name: 'Stamp Card',
  //   icon: LibraryBooks,
  //   component: StampCardTable,
  //   layout: '/admin',
  // },
  // // history
  // {
  //   path: '/historyVoucher',
  //   name: 'Lịch sử Voucher',
  //   icon: LibraryBooks,
  //   component: VoucherList,
  //   layout: '/admin',
  // },
  // {
  //   path: '/stampHistory',
  //   name: 'Lịch sử Stamp',
  //   icon: LibraryBooks,
  //   component: StampList,
  //   layout: '/admin',
  // },
]

const mainRouters = [...brandRouters, ...dashboardRoutes]

export default mainRouters
