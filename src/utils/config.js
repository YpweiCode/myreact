const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: ' 际链共配平台',
  prefix: ' 际链共配平台管理系统',
  footerText: '际链共配平台  © 2017 版权所有',
  logo: '/g2logo.png',
  loginAdvantages: [
    '/img1.png',
    '/img2.png',
    '/img3.png',
    '/img4.png',
  ],
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  roleType0Menu:[ {name:"客户信息维护",route:"/ucenter/superuser", id: '2',icon:'kehuxinxiweihu'}],

  roleType1Menu:[ {name:"客户信息维护",route:"/ucenter/user", id: '2',icon:'kehuxinxiweihu'}],

  roleType2Menu:[ {name:"保证金维护",route:"/bussiness/money/search", id: '2',icon:"baozhengjinweihu"}],


  roleType3Menu:[
                  {name:"承运商首页",route:"/bussiness/vehicleIndex", id: '1', icon:'chengyunshangshouye'},
                  {name:"班线发布",route:"/bussiness/addVehicle",id:'8', icon: 'xinzengbanci'},
                  {name:"班线发布",route:"/bussiness/addVehicle?:id",id:'8', icon: 'xinzengbanci',mpid: '-1'},
                  {name:"班线状态",route:"/bussiness/vehicleTime",id:'7', icon: 'banxianzhuangtailiebiao'},
                  {name:"车辆信息",route:"/bussiness/carInfor", id: '2', icon: 'cheliangxinxi'},
                  {name:"新增子账户",route:"/bussiness/addChild",id:'6', icon: 'xinzengzizhanghu1'},
                  {name:"日结账单",route:"/bussiness/dailyBill", id: '5', icon: 'rijiezhangdan'},
                  {name:"班线状态详情",route:"/bussiness/VehicleDetail?:id",id:'3123',mpid: '-1'},
  ],
  roleType4Menu:[
                  {name:"货主首页",route:"/cargo/cargoIndex", id: '8', icon:'chengyunshangshouye'},
                  {name:"新增零担发布",route:"/cargo/newCargoList?:id", id: '5', icon: 'xinzengbanci',mpid: '-1'},
                  {name:"新增零担发布",route:"/cargo/newCargoList/:id/:transportationVolume/:transportationWeight", id: '5', icon: 'xinzengbanci',mpid: '-1'},
                  {name:"新增零担发布",route:"/cargo/newCargoList", id: '5', icon: 'xinzengbanci'},
                  {name:"零担方案",route:"/bussiness/cargoListPlan", id: '7' ,icon:'lingdanfangan'},
                  {name:"零担历史",route:"/cargo/cargoHistory", id: '6',icon:'lingdanlishi'},
                  {name:"新增子账户",route:"/bussiness/addChild", id: '3', icon: 'xinzengzizhanghu1'},
                  {name:"日结账单",route:"/bussiness/dailyBill", id: '4', icon: 'rijiezhangdan'},
                  {name:"零担详情",route:"/cargo/cargoDetail?:id",id:'9',mpid: '-1'},
                  {name:"班线列表",route:"/cargo/timeCarList",id:'10',icon: 'banxianzhuangtailiebiao'},

  ],
  roleType5Menu:[
                  {name:"零担列表",route:"/Operating/timeCarList",id:'11',icon: 'banxianzhuangtailiebiao'},
                  {name:"班线列表",route:"/Operating/vehicleTime",id:'12',icon: 'lingdanlishi'},

  ],
}
