import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import lodash from 'lodash'
import { create, remove, update, query, countNums, getMap } from 'services/cargoInfo/cargoInfo'
import { pageModel } from '../common'
const { prefix } = config

export default modelExtend(pageModel, {
    namespace: 'cargo',

    state: {
        currentItem: {},
        modalVisible: false,
        modalType: 'create',
        selectedRowKeys: [],
        isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
        count:{},
        routerDetail: {},

    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/cargo/cargoList') {
                    const payload = location.query || { current: 1, pageSize: 10}
                    dispatch({
                        type: 'query',
                        payload,
                    })
                    // dispatch({
                    //   type: 'countNums',
                    //   payload,
                    // })
                }
            })
        },
    },

    effects: {

        * query ({ payload = {} }, { call, put }) {
            const data2 = yield call(countNums, payload)
            if (data2) {
              yield put({type: 'updateState', payload: {count: data2}})
            }
            const data = yield call(query, payload)
            if (data) {
               // let dataList = lodash.cloneDeep(data)
               // let tempList = dataList.result.sort((a, b) => a.ownerOrderId - b.ownerOrderId);
               // let resultList = [];
               // let countTimes = 0;
               // let prev = '';
               // tempList.forEach(function(item,index){
               //   if(resultList.length == 0){
               //     resultList.push([]);
               //   } else if(resultList.length == '' || item.ownerOrderId == prev) {
               //     resultList[countTimes].push(item);
               //   } else {
               //     resultList[++countTimes] = [];
               //     resultList[countTimes].push(item);
               //   }
               //   prev = item.ownerOrderId;
               // })

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

        * countNums ({ payload = {} }, { call, put}) {
          const data = yield call(countNums, payload)
          if (data) {
            yield put({ type: 'updateState', payload: { count: data }})
          }
        },

        * delete ({ payload }, { call, put, select }) {
            const data = yield call(remove, { id: payload })
            const { selectedRowKeys } = yield select(_ => _.user)
            if (data.success) {
                yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * multiDelete ({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * create ({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * update ({ payload }, { select, call, put }) {
            const id = yield select(({ user }) => user.currentItem.id)
            const newUser = { ...payload, id }
            const data = yield call(update, newUser)
            if (data.success) {
                yield put({ type: 'hideModal' })
                yield put({ type: 'query' })
            } else {
                throw data
            }
        },

        * getMap ({ payload }, { select, call, put }) {
          // yield put({ type: 'showPlanModal', payload })

            const data = yield call(getMap, payload)
          /*const data = {
            "baseData": {
              "vehicleNo": "京Q89932",//车牌号
              "cargoId": 176,
              "pickTime": "2017-10-20 00:00:00",//发车时间
              "vehicleTimeId": 39,
              "concatName": "学文1", //车主公司名称
              "companyName": "学文1",//司机
              "telephone": "18510512823",//联系电话
              "deliverId": "72"
            },
            "cargo": {
              "id": 176,
              "timeCarId": "39",
              "ownerId": null,
              "deliverId": "72",
              "cargoCode": "110",//客户单号
              "cargoName": "吸管",//货物名称
              "quantity": 1,//件数
              "weight": 1,//体积
              "volume": 1,//重量
              "remark": "1",
              "sendAddress": "四川省成都市龙泉驿区航天路100号",//收货地址
              "sendDistrictCode": "510112",
              "sender": "susan",
              "sendPhone": "15201415256",
              "sendLat": 30.552565,
              "sendLng": 104.267021,
              "pickAddressId": null,
              "pickDistrictCode": "510112",
              "pickAddress": "航天路10号", //发货地址
              "pickLat": 30.694008,
              "pickLng": 103.839816,
              "picker": "张三",
              "pickPhone": "15201415256",
              "pickTime": "2017-11-01 09:29:36",
              "effectTime": "2017-11-01 09:29:38",
              "lastArriveTime": "2017-11-01 09:29:41",
              "money": 199,
              "status": 1,
              "refuseReason": null,
              "createTime": "2017-10-31 14:36:10",
              "updateTime": "2017-10-31 14:36:10",
              "deleted": 0,
              "distence": null,
              "reStatus": null,
              "sendProvince": null,
              "sendCity": null,
              "sendCounty": null,
              "pickProvince": null,
              "pickCity": null,
              "pickCounty": null
            },
            "latLng": [
              {
                "pickLat": 30.694008,
                "pickLng": 103.839816
              },
              {
                "sendLat": 30.552565,
                "sendLng": 104.267021
              }
            ]
          };*/

            if ( data.success) {
                yield put({ type: 'showPlanModal', payload: {routerDetail: data} })
            } else {
              throw data
            }
        },

    },

    reducers: {

        showModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        showPlanModal (state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        hideModal (state) {
            return { ...state, modalVisible: false }
        },

    },
})
