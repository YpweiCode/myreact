import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { query,volume,weight,thinkVehicleNo,thinkCarType, create,update,deleteBatch,getadd,getdriver,getinsertAddress,VehicleTime,getEditDate1,findAllValueByTyp} from '../../../services/business/addVehicle.js'
import { pageModel } from '../../common'
import { searchVehicleTimeById} from '../../../services/business/VehicleDetail.js'

const { prefix } = config
import { message } from 'antd';
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'vehicle',

  state: {
    dataSource:[],
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
    hourNow:((new Date()).getHours()+1<24)?((new Date()).getHours()+1):0,
    addDisabled:false,
    editparms:null,
    iseditid:"",
    matchingType:"0",
    transportationVolume:"",
    transportationWeight:"",
    addressArr:[],
    driver:"",
    driverPhone:"",
    vehicleNo:[],
    addarr:[],
    carType:[],
    volume:"",
    weight:"",
    restvolume:"",
    restweight:"",
    selectedRowKeys: [],
    selectedRows: [],
    vehicleTime:{},
    pickable:false,
    isfixed:false,
    cargotype:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/bussiness/addVehicle') !== -1 ) {
          dispatch({
            type: 'searchcargotype',
            payload: {}
          })
          if (location.pathname !== '/bussiness/addVehicle') {
            dispatch({
              type: 'searchVehicleTimeById',
              payload: {id: window.location.href.split("?")[1]}
            })
          }else{
            dispatch({
              type: 'updateState',
              payload: {
                vehicleTime:"",
                volume:"",
                weight:"",
                restvolume:"",
                restweight:"",
                isfixed:false,
              }
            })
          }
          dispatch({
            type: 'thinkVehicleNo',
            payload: {vehicleNo: ''}
          })
          dispatch({
            type: 'allAdd',
            payload: {vehicleNo: ''}
          })
          dispatch({
            type: 'updateState',
            payload: {
              dataSource: [],
              currentItem: {},
              modalVisible: false,
              addressVisible: false,
              //modalType: 'create',
              selectaddress: "",
              pagination: {
                current: 1,
                total: 1,
                pageSize: 10
              },
              addDisabled: false,
              editparms: null,
              iseditid: "",
              transportationVolume: "",
              transportationWeight: "",
              addressArr: [],
              driver: "",
              driverPhone: "",
              vehicleNo: [],
              addarr: [],
              volume: "",
              weight: "",
              carType: [],
              isfixed:false,
              selectedRowKeys: [],
              selectedRows: []
            }
          })
        }
      })
    },
  },

  effects: {

    * searchVehicleTimeById({ payload = {} }, { call, put }) {
      const data = yield call(searchVehicleTimeById, payload);
      data.effectTime=null
      data.pickTime=null
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            vehicleTime:data,
            volume:data.volume,
            weight:data.weight,
            restvolume:data.volume,
            restweight:data.weight,
            isfixed:false,
          }
        });
      }
    },

    * searchcargotype ({ payload }, { call, put }) {
      const data = yield call(findAllValueByTyp, {type:"cargotype"});  // searchCargoById in services
      if (data && data.success) {
        yield put({
          type: 'updateState',
          payload: {
            cargotype: data.list
          }
        });

      }
    },
    * thinkVehicleNo({ payload = {} }, { call, put }) {
      const data = yield call(thinkVehicleNo, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            vehicleNo: data.list
          }
        })
      }
    },
    * finddriver({ payload = {} }, { call, put }) {
     let obj={};
      obj.vehicleNo=payload.parms[0]
      const data = yield call(getdriver, obj);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            driver:data.driver,
            volume:data.volume,
            weight:data.weight,
            restvolume:data.volume,
            restweight:data.weight,
            driverPhone:data.driverPhone,
          }
        })
        return data
      }
    },
    * insertAddress({ payload = {} }, { call, put }) {
      const data = yield call(getinsertAddress, payload);

      if(data && data.success){
        yield put({
          type: 'allAdd',
        })
        return data
      }
    },
    * allAdd({ payload = {} }, { call, put }) {
      const data = yield call(getadd, payload);
      let obj={provinceName:'其他', cityName:"", countyName:"", pickAddress:"",pickingLng:"",pickingLat:"",id:""};
      data.list.push(obj)
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            addarr: data.list
          }
        })
      }

    },
    * gomanarage({ payload = {} }, { call, put }) {
      yield put(routerRedux.push({
        pathname:'/bussiness/vehicleTime'
      }))
    },
    * VehicleTime({ payload = {} }, { call, put }) {
      const data = yield call(VehicleTime, payload.parms);
    },
    * thinkCarType({ payload = {} }, { call, put }) {
      const data = yield call(thinkCarType, payload);
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            carType: data.list
          }
        })
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('新增成功')
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ vehicle }) => vehicle.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query',
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('修改成功')
      } else {
        throw data
      }
    },

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(deleteBatch, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' ,
          payload :{
            current: 1, pageSize: 10
          }
        })
        message.success('删除成功')
      } else {
        throw data
      }
    },

    * edit ({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname:'bussiness/addVehicle'
      }))
      window.localStorage.setItem("currentId",payload.id)
    },

    * getEditDate ({ payload }, { call, put }) {
      const data = yield call(getEditDate1, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { editparms: data } })
        return data
      } else {
        throw data
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
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showaddressModal (state, { payload }) {
      return { ...state, ...payload, addressVisible: true }
    },

    hideaddressModal (state) {
      return { ...state, addressVisible: false }
    },

  },
})
