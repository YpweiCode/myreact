/**
 * Created by G2_User on 2017/11/21.
 */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { queryVehicleTimeList,queryBillList,getCargoStatusurl,getLocHistoryurl } from 'services/business/vehicleIndex.js'
import { pageModel } from '../../common'
const { prefix } = config
import { routerRedux } from 'dva/router'
import { message} from 'antd'
export default modelExtend(pageModel, {
  namespace: 'vehicleIndex',

  state: {
    currentItem: {},
    modalVisible: false,
    vehicleArr: [],
    billArr : [],
    propobj:null,
    mapodate:null,
    AddModelVisible:false,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bussiness/vehicleIndex') {
          const payload = location.query || { createTime:new Date().Format("yyyy-MM-dd 00:00:00")}
          dispatch({
            type: 'queryVehicleTimeList',
            payload:{orderTimeStart:new Date().Format("yyyy-MM-dd 00:00:00"),status:1},
          }),
            dispatch({
              type: 'queryBillList',
              payload,
            })
        }
      })
    },
  },

  effects: {

    * queryVehicleTimeList ({ payload = {} }, { call, put }) {
      const data = yield call(queryVehicleTimeList, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            vehicleArr: data.list,
          },
        })
      }
    },

    * queryBillList ({ payload = {} }, { call, put }) {
      const data = yield call(queryBillList, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            billArr: data.list,
          },
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname:'/bussiness/VehicleDetail'+"?"+payload.id
      }))
      window.localStorage.setItem("currentId",payload.id)
    },
    * getCargoStatus ({ payload = {} }, { call, put }) {
      let str=payload.orderCode.cargoCode;
      const data = yield call(getCargoStatusurl, {orderCode:str})
      if (data&&data.success&&data.list&&data.list.length>0) {
        const obj = yield call(getLocHistoryurl, payload.orderCode.cargoId);
        let statuslist=[];
        for(let i=0;i<data.list.length;i++){
          if(data.list[i].state=="0"){
            statuslist.push("已撤销")
          }else if(data.list[i].state=="1"){
            statuslist.push("已下单")
          }else if(data.list[i].state=="2"){
            statuslist.push("已接单")
          }else if(data.list[i].state=="3"){
            statuslist.push("已装货")
          }else if(data.list[i].state=="4"){
            statuslist.push("已签收")
          }
        }
        if(obj&&obj.success&&obj.list&&obj.list.length>0){
          let lnglatarr=[]
          for(let i=0;i<obj.list.length;i++){
            lnglatarr.push(obj.list[i].loc)
          }
          yield put({
            type: 'updateState',
            payload: {
              propobj: {
                list:statuslist,
                lnglat:lnglatarr
              }
            },
          })
          yield put({
            type: 'showMap',
          })

        }else{
          message.info("车辆轨迹暂无数据,请你稍后再试!")
        }

      }else{
        message.info("获取状态暂无数据,请您稍后再试!")
      }
    },


  },

  reducers: {

    showDetail (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    showMap (state, { payload }) {
      return { ...state, ...payload, AddModelVisible: true }
    },
    hideMap (state, { payload }) {
      return { ...state, ...payload, AddModelVisible: false }
    },
  },
})

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
