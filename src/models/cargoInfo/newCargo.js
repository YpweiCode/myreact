import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { config } from 'utils'
import { message } from 'antd';
import { publish } from 'services/cargoInfo/newCargo'
import { pageModel } from '../common'
import {addAddr, getinsertAddress, getadd, create,findAllValueByTyp } from "../../services/cargoInfo/newCargo";
import { searchCargoById } from '../../services/cargoInfo/cargoDetail'
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'newCargo',

  state: {
    modalVisible: false,
    dataSource: [],
    pagination: {},
    selectedRowKeys:[],
    hourNow:((new Date()).getHours()+1<24)?((new Date()).getHours()+1):0,


    mapModalVisible: false,
    addarr:[],
    selectaddress: '',
    changedAddr:'',

    feedBackModalVisible: false,
    postLoading: false,
    cargo:{},
    cargotype:[],
    timeCarId:"",
    transportationVolume:"",
    transportationWeight:""
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/cargo/newCargoList') !== -1) {
          dispatch({
            type: 'updateState',
            payload: {timeCarId: "",transportationVolume: "",transportationWeight: ""}
          })
          if (location.pathname !== '/cargo/newCargoList') {
            if(window.location.href.split("?")[1]){
              dispatch({
                type: 'searchCargoById',
                payload: {id: window.location.href.split("?")[1]}
              })
            }
            if(window.location.href.split("/")[3]){
              dispatch({
                type: 'updateState',
                payload: {timeCarId: location.pathname.split("/")[3],transportationVolume: location.pathname.split("/")[4],transportationWeight: location.pathname.split("/")[5]}
              })
            }
          }
            dispatch({
              type: 'searchcargotype',
              payload: {}
            })
          dispatch({
            type: 'allAdd',
            payload: {vehicleNo: ''}
          })
          dispatch({
            type: 'updateState',
            payload: {
              addressArr: [],
              cargo: {}
            }
          })
        }
      })
    },
  },

  effects: {

    * insertCargo({ payload = {} }, { call, put }) {

      const data = yield call(create, payload.fields);
      if(data&&data.success){


        yield put({
          type: 'freshState',
          payload: {
            postLoading: false
          }

        });

        if (payload.redirect){
          yield put({
            type:'redirectToPlan',
            payload
          })
        } else {
          payload.callback();
        }
      }
    },

    * redirectToPlan({ payload = {} }, { call, put }) {

        yield put(routerRedux.push({
          pathname: payload.redirect
        }))
    },

    * searchCargoById ({ payload }, { call, put }) {
      const data = yield call(searchCargoById, payload);  // searchCargoById in services
      if (data && data.success) {
        data.pickTime=null
        data.effectTime =null
        data.lastArriveTime=null
        yield put({
          type: 'updateState',
          payload: {
            cargo: data
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
      if(data && data.success){
        yield put({
          type: 'updateState',
          payload: {
            addarr: data.list
          }
        })
      }
      let obj={provinceName:'其他', cityName:"", countyName:"", pickAddress:"",pickingLng:"",pickingLat:"",id:""};
      data.list.push(obj)
    },


  },

  reducers: {

    freshState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    showMapModal (state, { payload }) {
      return { ...state, ...payload, mapModalVisible: true }
    },
    hideMapModal (state, { payload }) {
      return { ...state, ...payload, mapModalVisible: false }
    },

    showFeedBackModal (state, { payload }) {
      return { ...state, ...payload, feedBackModalVisible: true }
    },
    hideFeedBackModal (state, { payload }) {
      return { ...state, ...payload, feedBackModalVisible: false }
    },


    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
