import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { query,getCargoStatusurl,getLocHistoryurl ,getImg } from 'services/cargoInfo/cargoHistory'
import { pageModel } from '../common'
const { prefix } = config
import { message} from 'antd'
export default modelExtend(pageModel, {
    namespace: 'cargoHistory',

    state: {
        currentItem: {},
        modalVisible: false,
        selectedRowKeys: [],
        mapodate:null,
        propobj:null,
        AddModelVisible:false,
        modalVisibleimg:false,
        imgArr:[],
        isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
        currentImg:null,
        modalVisibleimgdel:false,
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/cargo/cargoHistory') {
                    const payload = location.query || { current: 1, pageSize: 10,createTime:new Date()}
                    dispatch({
                        type: 'query',
                        payload,
                    })
                }
            })
        },
    },

    effects: {

        * query ({ payload = {} }, { call, put }) {
            const data = yield call(query, payload)
            if (data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.result,
                        pagination: {
                            current: Number(data.pageNum) || 1,
                            pageSize: Number(payload.pageSize) || 10,
                            total: data.totalPages,
                        },
                      dataSource: data.result
                    },
                })
            }
        },
      * getreturnimg ({ payload = {} }, { call, put }) {
            const data = yield call(getImg, payload.orderCode.id)
        if(data&&data.success){
          if(!data.receiptList){
            message.info("暂无签收结果");
            return
          }
          yield put({
            type: 'updateState',
            payload: {
              imgArr:data.receiptList
            },
          })
          yield put({
            type: 'showimgMap',
          })

        }
        },
      * getCargoStatus ({ payload = {} }, { call, put }) {
        let str=payload.orderCode.orderCode;
        const data = yield call(getCargoStatusurl, {orderCode:str})
        if (data&&data.success&&data.list) {
          const obj = yield call(getLocHistoryurl, payload.orderCode.id);
          let statuslist=[];
          for(let i=0;i<data.list.length;i++){
            if(data.list[i].state=="0"){
              statuslist.push("已撤销"+data.list[i]._id.date)
            }else if(data.list[i].state=="1"){
              statuslist.push("已下单"+data.list[i]._id.date)
            }else if(data.list[i].state=="2"){
              statuslist.push("已接单"+data.list[i]._id.date)
            }else if(data.list[i].state=="3"){
              statuslist.push("已装货"+data.list[i]._id.date)
            }else if(data.list[i].state=="4"){
              statuslist.push("已签收"+data.list[i]._id.date)
            }
          }
          if(obj&&obj.success&&obj.list){
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
        showimgMap (state, { payload }) {
            return { ...state, ...payload, modalVisibleimg: true }
        },
        hideimgMap (state, { payload }) {
            return { ...state, ...payload, modalVisibleimg: false }
        },
        showimgMapdel (state, { payload }) {
            return { ...state, ...payload, modalVisibleimgdel: true }
        },
        hideimgMapdel (state, { payload }) {
            return { ...state, ...payload, modalVisibleimgdel: false }
        },
    },
})
