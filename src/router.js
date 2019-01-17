import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import Cookies from 'utils/cookie';
const { ConnectedRouter } = routerRedux
let  defauleurl=""
if(Cookies.get('roleType')==3){
  defauleurl="/bussiness/vehicleIndex"
}else if (Cookies.get('roleType')==4){
  defauleurl="/cargo/cargoIndex"
}else if (Cookies.get('roleType')==0){
  defauleurl="/ucenter/superuser"
}else if (Cookies.get('roleType')==1){
  defauleurl="/ucenter/user"
}else if (Cookies.get('roleType')==2){
  defauleurl="/bussiness/money/search"
}else if (Cookies.get('roleType')==5){
  defauleurl="/Operating/timeCarList"
}
const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/ucenter/user',
      models: () => [import('./models/business/user')],
      component: () => import('./routes/business/user/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      // 零担发布列表
      path: '/cargo/CargoList',
      models: () => [import('./models/cargoInfo/cargoInfo')],
      component: () => import('./routes/cargoInfo/cargoInfo/'),
    }, {
      path: '/cargo/cargoHistory',
      models: () => [import('./models/cargoInfo/cargoHistory')],
      component: () => import('./routes/cargoInfo/cargoHistory/'),
    }, {
      path: '/bussiness/carInfor',
      models: () => [import('./models/business/vehicle')],
      component: () => import('./routes/business/vehicle/'),
    },{
      path: '/bussiness/dailyBill',
      models: () => [import('./models/business/dailyBill')],
      component: () => import('./routes/business/dailyBill/'),
    },
    {
      path: '/ucenter/superuser',
        models: () => [import('./models/business/superuser')],
      component: () => import('./routes/business/superuser/'),
    },
    {
      path: '/bussiness/vehicleTime',
      models: () => [import('./models/business/vehicleTime')],
      component: () => import('./routes/business/vehicleTime/'),
    },
    {
      path: '/bussiness/addChild',
        models: () => [import('./models/business/addChild')],
      component: () => import('./routes/business/addChild'),
    },
    {
      // 保证金账户
      path: '/bussiness/money/search',
      models: () => [import('./models/business/money')],
      component: () => import('./routes/business/money'),
    },
    {
      // 新增零担发布
      path: '/cargo/newCargoList?:id',
      models: () => [import('./models/cargoInfo/newCargo')],
      component: () => import('./routes/cargoInfo/newCargo'),
    },
    {
      // 新增零担发布
      path: '/cargo/newCargoList',
      models: () => [import('./models/cargoInfo/newCargo')],
      component: () => import('./routes/cargoInfo/newCargo'),
    },
    {
      // 新增零担发布
      path: '/cargo/newCargoList/:id/:transportationVolume/:transportationWeight',
      models: () => [import('./models/cargoInfo/newCargo')],
      component: () => import('./routes/cargoInfo/newCargo'),
    },
    {
      // 零担详情
      path: '/cargo/cargoDetail?:id',
      models: () => [import('./models/cargoInfo/cargoDetail')],
      component: () => import('./routes/cargoInfo/cargoDetail'),
    },
    {
      // 货主首页
      path: '/cargo/cargoIndex',
        models: () => [import('./models/cargoInfo/cargoIndex')],
      component: () => import('./routes/cargoInfo/cargoIndex'),
    },
    {
      // 承运商首页
      path: '/bussiness/vehicleIndex',
        models: () => [import('./models/business/vehicleIndex')],
      component: () => import('./routes/business/vehicleIndex'),
    },
    {
      path: '/bussiness/addVehicle',
        models: () => [import('./models/business/addVehicle')],
      component: () => import('./routes/business/addVehicle'),
    },
    {
      path: '/cargo/demo',
      models: () => [import('./models/business/addVehicle')],
      component: () => import('./routes/cargoInfo/demo'),
    },
  {
      path: '/bussiness/addVehicle?:id',
        models: () => [import('./models/business/addVehicle')],
      component: () => import('./routes/business/addVehicle'),
    },
   {
      path: '/bussiness/VehicleDetail?:id',
        models: () => [import('./models/business/VehicleDetail')],
      component: () => import('./routes/business/VehicleDetail'),
    },
   {
      path: '/bussiness/cargoListPlan',
        models: () => [import('./models/business/cargoListPlan')],
      component: () => import('./routes/business/cargoListPlan'),
    },
   {
      path: '/cargo/timeCarList',
        models: () => [import('./models/cargoInfo/timeCarList')],
      component: () => import('./routes/cargoInfo/timeCarList'),
    },
  {
    path: '/Operating/timeCarList',
      models: () => [import('./models/Operating/cargoHistory')],
    component: () => import('./routes/Operating/cargoHistory/'),
  },
  {
    path: '/Operating/vehicleTime',
      models: () => [import('./models/Operating/vehicleTime')],
    component: () => import('./routes/Operating/vehicleTime/'),
  },
  {
    path: '/Operating/demo',
      models: () => [import('./models/demo/demo')],
    component: () => import('./routes/demo/'),
  },
  ]
  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to={defauleurl} />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
