import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { config } from 'utils'
import { publish } from '../../services/cargoInfo/newCargo'
import { searchCargoById,getCarList,chooseTheCar } from '../../services/cargoInfo/cargoDetail'
import { pageModel } from '../common'
import {addAddr} from "../../services/cargoInfo/newCargo";
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'cargoDetail',

  state: {
    modalVisible: false,
    dataSource: [],
    pagination: {},
    selectedRowKeys:[],
    cars: [],
    cargo:{},
    statusFont: '',

  },

  subscriptions: {

    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/cargo/cargoDetail') !== -1 ) {
          dispatch({
            type: 'searchCargoById',
            payload: { id :window.location.href.split("?")[1]}
          })
        }
      })
    },

  },

  effects: {

    * addNew ({ payload = {} }, { call, put }) {
      const getAddr = yield call(addAddr, payload.data)

      if (getAddr && getAddr.id) {

        const data = yield call(publish, { pickAddressId: getAddr.id , ...payload.data})
        if (data && data.success) {
          yield put({
            type: 'updateState',
            payload: {
              dataSource:[]
            }
          })
          yield put(routerRedux.push({
            pathname:'/cargo/cargoList'
          }))
        } else {
          throw data
        }
      } else {
        throw  getAddr;
      }
    },

    * searchCargoById ({ payload }, { call, put }) {

      const data = yield call(searchCargoById, payload);  // searchCargoById in services
      if (data && data.success) {
        yield put({
          type: 'updateState',
          payload: {
            cargo: data
          }
        });
        let statusFont1 = '';
        if(data.status===1||data.status === 3){
          statusFont1 = '选择该方案';
        }else if(data.status === 2){
          statusFont1 = '等待运输商确认';
        }else{
          statusFont1 = '方案已锁定';
        }
        yield put({
          type: 'updateState',
          payload: {
            statusFont: statusFont1,
          }
        })
        yield put({
          type: 'getCarList',
          payload: {
            id: data.id,
            status: data.status,
            vehicleTimeId: data.timeCarId,
          }
        })
      }
    },

    * getCarList ({ payload }, { call, put }) {

      const data = yield call(getCarList, payload);  // getCarList in services
      if (data && data.success) {
        yield put({
          type:'updateState',
          payload:{
            cars:data.list
          }
        })
      }

    },

    * chooseTheCar  ({ payload }, { call, put }) {

      const data = yield call(chooseTheCar, payload); // chooseTheCar in services

      if (data && data.code === 0) {
        yield put({
          type: 'searchCargoById',
          payload: { id :window.location.href.split("?")[1]}
        })
      }


    }


  },

  reducers: {

    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },

    filteCarArr (state, {payload}) {

      const selectedCar = state.cars.filter((car) => {return car.id == payload.vehicleTimeId}) ;

      return { ...state, ...payload,
        hasChosenCar:true,
        cars: selectedCar
      }
    },

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
