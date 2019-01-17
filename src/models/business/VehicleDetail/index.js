import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { searchVehicleTimeById,vehicleTime,lockVehicleTime} from '../../../services/business/VehicleDetail.js'
import { pageModel } from '../../common'
const { prefix } = config
import { message } from 'antd';
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'newvehicle',

  state: {
    dataSource:[],
    effectTime: "",
    vehicleNo: "",
    pickTime: "",
    driverPhone: "",
    transportationVolume:"",
    transportationWeight:"",
    addressArr:[{isRefuse:false,volume:100,weight:100,},{isRefuse:false,volume:1000,weight:1000},{isRefuse:false,volume:1000,weight:100}],
    driver:"",
    driverPhone:"",
    vehicleNo:"",
    address: "",
    volume:"",
    weight:"",
    cargos:[],
    status:"",
    lockable:false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/bussiness/VehicleDetail')!=-1) {
          const payload = location.query || { current: 1, pageSize: 10 }
          const id = window.location.href.split("?")[1]
          dispatch({
            type: 'searchVehicleTimeById',
            payload: { id :id}
          })

          dispatch({
            type: 'updateState',
            payload:{ dataSource:[],
              currentItem: {},
              modalVisible: false,
              addressVisible: false,
              //modalType: 'create',
              selectaddress:"",
              pagination:{
                current: 1,
                total:1,
                pageSize:10
              },
              addDisabled:false,
              editparms:null,
              iseditid:"",
              transportationVolume:1000,
              transportationWeight:1000,
              addressArr:[],
              driver:"",
              driverPhone:"",
              vehicleNos:[],
              addarr:[],
              volume:1000,
              weight:1000,
              carType:[],
              selectedRowKeys: [],
              selectedRows: []}
          })
        }
      })
    },
  },

  effects: {
    *lockcar({ payload = {} }, { call, put }) {
      const data = yield call(lockVehicleTime, payload.data);
      if(data&&data.success){
        message.info("锁定成功");
        yield put(routerRedux.push({
          pathname:'/bussiness/vehicleTime'
        }))
      }
    },

    * searchVehicleTimeById({ payload = {} }, { call, put }) {
      const data = yield call(searchVehicleTimeById, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            effectTime: data.effectTime,
            vehicleNos: data.vehicleNo,
            pickTime: data.pickTime,
            transportationVolume: data.transportationVolume,
            transportationWeight: data.transportationWeight,
            volume: data.transportationVolume,
            weight: data.transportationWeight,
            driverPhone: data.driverPhone,
            driver: data.driver,
            status: data.status,
            address: data.provinceName+data.cityName+data.countyName+data.pickAddress
          }
        });
        payload.pageNum=1;
        payload.pageSize=10;
        payload.timeCarId=payload.id;
        payload.isCargo = true;
        payload.id = null;
        const cargos = yield call(vehicleTime, payload);
        if(cargos&&cargos.success){
          yield put({
            type: 'updateState',
            payload: {
              cargos: cargos.result,
            }
          });
        }

      }
    },

  },

  reducers: {
     updateState (state, { payload }) {
       return {
         ...state,
         ...payload,
       }
     },

  },
})
