import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import { Form, Row, Col,Icon, Button, Table, Input,Select,Popconfirm, DatePicker,message,TimePicker,Modal,InputNumber,Switch} from 'antd'
import { Page } from 'components'
import Mapmodal from './mapModel'
import Address from './address'
import moment from 'moment'
const  confirm = Modal.confirm

const dateFormat = 'YYYY-MM-DD HH:mm:ss'
function  disabledMinutes (){
  return [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55,56,57,58,59]
}
const { RangePicker } = DatePicker;
const Option = Select.Option;
const Vehicle = ({ dispatch, vehicle, loading, form: {
  getFieldDecorator,
  getFieldsValue,
  setFieldsValue,
  validateFieldsAndScroll
  },
  }) => {

  const ColProps = {
    xs:12,
    sm: 6,
    style: {
      marginBottom: 16,
    },
  }
  const ColPropsadds = {
    xs:24,
    sm: 24,
    style: {
      marginBottom: 16,
    },
  }
  const ColPropscars = {
    xs:12,
    sm: 11,
    style: {
      marginBottom: 16,
    },
  }
  const ColPropsadd = {
    xs:18,
    sm: 18,
    style: {
      marginBottom: 16,
    },
  }

  const {addDisabled,matchingType,hourNow,modalVisible,volume,weight,pagination,modalType,currentItem,
    vehicleNo=[],carType,selectedRowKeys,addarr,driver,driverPhone,addressVisible,
    addressArr,selectaddress,editparms,iseditid, restvolume,restweight,vehicleTime,pickable,selectedRows,isfixed,cargotype} = vehicle;


  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      },
    }, {
      title: '目的地地址',
      dataIndex: 'sendAddress',
      key: 'sendAddress',
    }, {
      title: '物品种类',
      dataIndex: 'cargoName',
      key: 'cargoName',
    }, {
      title: '体积(方)',
      dataIndex: 'volume',
      key: 'volume'
    }, {
      title: '重量(公斤)',
      dataIndex: 'weight',
      key: 'weight',
    }, {
      title: '说明',
      dataIndex: 'remark',
      key: 'remark',
    }
  ];

  const editItem = (item) => {
    dispatch({
      type: 'vehicle/showModal',
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    });

    dispatch({
      type: 'vehicle/thinkCarType',
      payload: {
        typeName: '',
      },
    })
  }
  if(editparms&&editparms.success){

  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys,rows) => {
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          selectedRowKeys: keys,
          selectedRows: rows,
        },
      })
    }
  };

  const onAdd = () => {
  const fields = getFieldsValue()
    if(!fields.transportationVolume||!fields.transportationWeight){
      message.info("请选择车辆")
      return
    }

    dispatch({
      type: 'vehicle/showaddressModal',
      payload: {
        modalType: 'create',
      },
    });
    dispatch({
      type: 'vehicle/thinkCarType',
      payload: {
        typeName: '',
      },
    })
  }

  const onEdit = () => {
  const fields = getFieldsValue()
    if(!fields.transportationVolume||!fields.transportationWeight){
      message.info("请选择车辆")
      return
    }

    dispatch({
      type: 'vehicle/showaddressModal',
      payload: {
        modalType: 'create',
      },
    });
    dispatch({
      type: 'vehicle/thinkCarType',
      payload: {
        typeName: '',
      },
    })
  }

  const handleDeleteItems = () => {
    let arr=[]
    for(let i=0;i<addressArr.length;i++){
      let isokay=true
      for(let j=0;j<selectedRowKeys.length;j++){
        if(i==selectedRowKeys[j]){
          isokay=false
          break
        }
      }
      if(isokay){
        arr.push(addressArr[i])
      }

      //addressArr.splice(selectedRowKeys[i],1)
    }
    const res =dispatch({
      type: 'vehicle/updateState',
      payload: {
        addressArr: arr,
      },
    })
      let allW=weight;
      let allV=volume
      let wSum=0;
      let vSum=0;
      for(let i=0;i<arr.length;i++){
        wSum+=arr[i].weight*100;
        vSum+=arr[i].volume*100;
      }
      let restW=(allW*100-wSum)/100
      let restV=(allV*100-vSum)/100
      setFieldsValue({transportationVolume:restV})
      setFieldsValue({transportationWeight:restW})
    dispatch({
      type: 'vehicle/updateState',
      payload: {
        restvolume:restV,
        restweight:restW,
        selectedRows:[],
        selectedRowKeys:[]
      }
    })
  };
  const showMapModel = () => {
    dispatch({
      type: 'vehicle/showModal',
      payload: {
        //modalVisible:true
      },
    })
  };
  const editcar = (id) => {
    let data=dispatch({
      type: 'vehicle/getEditDate',
      payload: {
        id:id
      },
    })
    data.then(function(result){
      setFieldsValue({pickTime: moment(result.pickTime,"YYYY-MM-DD HH:mm:ss")});
      setFieldsValue({expiryDate:  moment(result.effectTime,"YYYY-MM-DD HH:mm:ss")});
      setFieldsValue({vehicleNo: result.vehicleNo});
      setFieldsValue({driver: result.driver});
      setFieldsValue({driverPhone: result.driverPhone});
      setFieldsValue({pickAdd: result.cars[0].lng+'?'+result.cars[0].lat+"?"+result.pickAddressId});

      let arr=[];
      for(let i=0;i<result.cargo.length;i++){
        let obj={};
        obj.lat=result.cargo[i].sendLat;
        obj.lng=result.cargo[i].sendLng;
        obj.remark=result.cargo[i].remark;
        obj.volume=result.cargo[i].volume;
        obj.weight=result.cargo[i].weight;
        obj.cargoName=result.cargo[i].cargoName;
        obj.sendAddress=result.cargo[i].sendAddress;
        obj.area=result.cargo[i].sendDistrictCode;
        arr.push(obj)
      }
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          addressArr: arr,
          volume:result.transportationVolume,
          weight:result.transportationWeight,
          iseditid:result.id,
        },
      })
    })
  }
let isradius=null;
  if(matchingType=="0"){
  let arr=[{}];
    isradius=arr.map((item,index) =>{
    return (
      <div key={String(index)}>
      <Col {...ColProps}>
          <FilterItem label="起点半径">
            <span>
            {getFieldDecorator('startR', {initialValue: "3"})(
              <InputNumber style={{width: '80%'}} min={0.01}  maxLength="5" precision={2} size="large"  placeholder="请输入起点半径"/>
            )}
            (公里)
            </span>
          </FilterItem>
      </Col>
      <Col {...ColProps}>
          <FilterItem label="终点半径">
             <span>
            {getFieldDecorator('endR', {initialValue: "3"})(
            <InputNumber style={{width: '80%'}} min={0.01} maxLength="5"  precision={2}  size="large"  placeholder="请输入终点半径"/>
          )}
            (公里)
          </span>
          </FilterItem>

      </Col>
      </div>
    )
    })
  }
  const modalProps = {
    //item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    selectaddress,
    //carType:carType,
    maskClosable: false,
    confirmLoading: loading.effects['vehicle/update'],
    //title:'',
    wrapClassName: 'vertical-ceer-modal',
    onOk (data){
      let obj={};
      obj.pickAddress=data.parkAddress;
      obj.districtId=data.area;
      obj.pickingLat=data.lat;
      obj.pickingLng =data.lng;
      let  array=dispatch({
        type: 'vehicle/insertAddress',
        payload: obj,
      })
      dispatch({
        type: 'vehicle/hideModal',
      })
      array.then(function(result){
        setFieldsValue({pickAdd: data.lng+"?"+data.lat+'?'+result.id});
      })

    },
    onCancel () {
      dispatch({
        type: 'vehicle/hideModal',
      })
    },
  }
const addressmodalProps = {
    //item: modalType === 'create' ? {} : currentItem,
    visible: addressVisible,
    //carType:carType,
    maskClosable: false,
    confirmLoading: loading.effects['vehicle/update'],
    //title:'',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      addressArr.push(data)
      //dispatch({
      //  type: `vehicle/${modalType}`,
      //  payload: data,
      //})
      let allW=weight;
      let allV=volume
      let wSum=0;
      let vSum=0;
      for(let i=0;i<addressArr.length;i++){
        wSum+=addressArr[i].weight*100;
        vSum+=addressArr[i].volume*100;
      }

      let restW=(allW*100-wSum)/100
      let restV=(allV*100-vSum)/100
      if(restW<0||restV<0){
        message.info("已超过当前剩余运力,请查看！");
        if(addressArr.length>0){
          addressArr.pop()
        }
        return
      }else{
        setFieldsValue({transportationVolume:restV})
        setFieldsValue({transportationWeight:restW})
        dispatch({
          type: 'vehicle/updateState',
          payload: {
            restvolume:restV,
            restweight:restW,
          },
        })
        dispatch({
          type: 'vehicle/hideaddressModal',
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'vehicle/hideaddressModal',
      })
    },
  }

  const handleSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }

      dispatch({ type: 'vehicle/query', payload: {... values, ... pagination}});
    })
  }
  const carhandleChange = (...parms) => {
   const data= dispatch({ type: 'vehicle/finddriver', payload: {parms}});
    const res =dispatch({
      type: 'vehicle/updateState',
      payload: {
        addressArr: [],
      },
    })
    data.then(function(parms){
      setFieldsValue({transportationVolume: parms.volume});
      setFieldsValue({transportationWeight: parms.weight});
    })
  }

  const onChangeTable = (pagination, filters, sorter) => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'vehicle/query', payload: {... values, ... pagination}});
    })
  }
  const addhandleChange = (value) => {
    console.log(value)
    if(vehicleTime.pickAddressId){
      vehicleTime.pickAddressId=null
    }
    if(value=='??'){
      showMapModel()
    }
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }
  const onAddAllcar = () => {
    dispatch({
      type: 'vehicle/updateState',
      payload: {
        pickable: true,
      },
    })
    let data=getFieldsValue();
    if(!data.pickTime){
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          pickable: false,
        },
      })
      message.info("提货时间为空")
      return
    }
    if(!data.expiryDate){
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          pickable: false,
        },
      })
      message.info("信息有效时间为空")
      return
    }
    if(!data.vehicleNo){
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          pickable: false,
        },
      })
      message.info("请选择车牌号")
      return
    }
    if(!data.pickAdd){
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          pickable: false,
        },
      })
      message.info("请选择提货地址")
      return
    }
    if(addressArr.length==0){
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          pickable: false,
        },
      })
      message.info("送货地址为空")
      return
    }
    if(isfixed&&!data.pickTime31231){
      message.info("请选择班次有效时间");
      return
    }
    //data.expiryDate=moment(data.expiryDate._d.getTime()).format('YYYY-MM-DD HH:mm:ss')
    //data.pickTime=moment(data.pickTime._d.getTime()).format('YYYY-MM-DD HH:mm:ss')

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
  })
    let newObj = {};
    newObj.vehicleNo = data.vehicleNo;
    newObj.pickTime = data.pickTime;
    newObj.effectTime = data.expiryDate;
    newObj.transportationVolume = data.transportationVolume;
    newObj.transportationWeight = data.transportationWeight;
    newObj.pickAddressId = (vehicleTime.pickAddressId == null || vehicleTime.pickAddressId == "" )? data.pickAdd.split('?')[2]:vehicleTime.pickAddressId;
    newObj.matchType = data.matchType;
    newObj.startR = data.startR;
    newObj.endR = data.endR;
    newObj.cargoType = data.cargoType;
    if (isfixed){
      newObj.effectTime = data.pickTime31231;
    }
    let arr=[];
    for(let i=0;i<addressArr.length;i++){
      let obj={};
      obj.sendLat=addressArr[i].lat;
      obj.sendLng=addressArr[i].lng;
      obj.remark=addressArr[i].remark;
      obj.volume=addressArr[i].volume;
      obj.weight=addressArr[i].weight;
      obj.cargoName=addressArr[i].cargoName;
      obj.sendAddress=addressArr[i].sendAddress;
      obj.sendDistrictCode=addressArr[i].area;
      arr.push(obj);
    };
    newObj.cargos=arr;
    newObj.id=iseditid
    let parms={data:newObj};

    let sy=dispatch({ type: 'vehicle/VehicleTime', payload: {parms}});
    sy.then(function(){
      dispatch({
        type: 'vehicle/updateState',
        payload: {
          pickable: false,
        },
      })
        Modal.confirm({
          title: '班次发布成功',
          content: '是否继续发布新的班次？',
          okText: '继续发布',
          cancelText: '返回班次列表',
          onOk: keepadd,
          onCancel: closeadd
        });
    })
  }
  const keepadd = () => {
    dispatch({
      type: 'vehicle/updateState',
      payload: {
        driver: "",
        driverPhone: "",
        addressArr: [],
        restvolume:"",
        restweight:"",
      },
    })
    if(vehicleTime){
      vehicleTime.driver=""
      vehicleTime.driverPhone=""
    }

      setFieldsValue({vehicleNo: ""});
      setFieldsValue({pickAdd: ""});
      setFieldsValue({transportationVolume: ""});
      setFieldsValue({transportationWeight: ""});
  }
  const closeadd = () => {
    dispatch({type: 'vehicle/gomanarage', payload: {}});
  }
  const switchclick = () => {
    dispatch({
      type: 'vehicle/updateState',
      payload: {
        isfixed:!isfixed
      },
    })
  }
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  const disabledHours = () => {
    return range(0,hourNow);
  }
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() < Date.now();
  }
  const disabledDateTime = () => {
    return {

    };
  }
  const marchingchanger = (parms) => {
    dispatch({
      type: 'vehicle/updateState',
      payload: {
        matchingType: parms,
      },
    })
  }
  let options=null;
  if(vehicleNo&&vehicleNo.length){
    options = vehicleNo.map(d => <Option key={String(d.vehicleNo)}>{d.vehicleNo}</Option>);
  }

  let addoptions=null;
  if(addarr&&addarr.length){
    addoptions = addarr.map(item => <Option key={String(item.pickingLng+'?'+item.pickingLat)}>{item.provinceName+item.cityName+item.countyName+item.pickAddress}</Option>);
  }
  const mapOption = () => {
    if(addarr&&addarr.length){
    return addarr.map(item => <Option key={String(item.pickingLng+'?'+item.pickingLat+'?'+item.id)}>{item.provinceName+item.cityName+item.countyName+item.pickAddress}</Option>)
    }else{
      return null
    }
  }
  const typeOption= () => {
    return cargotype.map(item => <Option title={item.text} key={String(item.value)}>{item.text}</Option>)
  }
  return (
    <div className="searchboxbg" style={{display:"flex",flexFlow:"row nowrap"}}>
      <div style={{padding:0,marginLeft:0,width:'50px',position:'relative',paddingTop:40}}>
        <div style={{top:40,left:-10,position:"absolute",color:"#fff",fontSize:16,textAlign:"center",lineHeight:'42px',width:42,height:42,borderRadius:"50%",background:"#39b0fa"}}>始发</div>
        <div style={{top:376,left:-10,position:"absolute",color:"#fff",fontSize:16,textAlign:"center",lineHeight:'42px',width:42,height:42,borderRadius:"50%",background:"#11C2B2"}}>目的</div>
        <div style={{width:0,borderLeft:"3px dashed #efefef",height:"100%",marginLeft:9}}></div>
       <span className="threewrap" style={{position:"absolute",left:35,top:50}}></span>
       <span className="threewrap" style={{position:"absolute",left:35,top:387}}></span>
      </div>
      <div className="rightdiv" style={{flex:"1"}}>
      <div style={{paddingLeft:"2px"}}>
        <div style={{marginBottom:"20px",height:"20px"}}>
          <div style={{fontSize:'14px',color: '#333333',fontWeight:900,float:"left"}}>班车信息</div>
        </div>
    </div>

      {/** 搜索区域**/}
      <div className="searchbox" style={{paddingLeft:"20px"}}>
      <Row gutter={24}>
        <Col {...ColProps}>
          <FilterItem label="发车时间">
            {getFieldDecorator('pickTime', {
              initialValue: vehicleTime.pickTime == null ?moment({ years:moment().years(), months:new Date((new Date().getTime()+24*60*60*1000)).getMonth(), days:(new Date((new Date().getTime()+24*60*60*1000)).getDate()), hours:9, minutes:0}):moment(vehicleTime.pickTime,'YYYY-MM-DD HH:mm:ss'),
              rules: [
              {
                required: true,
                message:"请输入发车时间",
              },
            ],})(
              <DatePicker  showTime={{disabledMinutes:disabledMinutes,hideDisabledOptions:true,format:"HH:mm",defaultOpenValue:moment('00:00', 'HH:mm')}} style={{width:164,height:32}} size="large"  disabledDate={disabledDate}   placeholder="请选择发车时间"  format="YYYY-MM-DD HH:mm"   />
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="固定班次">
            {getFieldDecorator('pickTimedddd', {
              initialValue: "",
              rules: [
                {
                  required: "",
                  message:"",
                },
              ],})(
              <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={false} onChange={switchclick}  />
            )}
          </FilterItem>
        </Col>
        {isfixed&&<Col {...ColProps}>
          <FilterItem label="班次有效期">
            {getFieldDecorator('pickTime31231', {
              initialValue: moment({ years:new Date((new Date().getTime()+24*60*60*1000*7)).getFullYear(), months:new Date((new Date().getTime()+24*60*60*1000*7)).getMonth(), days:(new Date((new Date().getTime()+24*60*60*1000*7)).getDate()), hours:23, minutes:50}),
              rules: [
                {
                  required: "",
                  message:"请输入班次有效期",
                },
              ],})(
              <DatePicker  showTime={{disabledMinutes:disabledMinutes,hideDisabledOptions:true,format:"HH:mm",defaultOpenValue:moment('00:00', 'HH:mm')}} style={{width:164,height:32}} size="large"  disabledDate={disabledDate}   placeholder="请选择发车时间"  format="YYYY-MM-DD HH:mm"   />
            )}
          </FilterItem>
        </Col>}
        <Col {...ColProps} style={{display:"none"}}>
          <FilterItem label="信息有效期">
            {getFieldDecorator('expiryDate', {
              initialValue: vehicleTime.effectTime == null ?(moment('23:00:00', 'HH:mm:ss')):moment(vehicleTime.effectTime,'YYYY-MM-DD HH:mm:ss'),
              rules: [
                {
                  required: true,
                  message:"请输入有效时间",
                },
              ],})(
              <TimePicker  disabledHours={disabledHours}
                           disabledMinutes={disabledMinutes}
                           format="YYYY-MM-DD HH:mm:ss"
                           hideDisabledOptions
                           size="large"
                           defaultOpenValue={moment('23:00:00', 'HH:mm:ss')}
                           style={{width:"100%"}}
                           placeholder="有效时间"  />
            )}
          </FilterItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...ColProps}>
          <FilterItem label="车辆">
            {getFieldDecorator('vehicleNo', {
              initialValue: vehicleTime.vehicleNo == null ?undefined:vehicleTime.vehicleNo,
              rules: [
                {
                  required: true,
                  message:"请选择车辆",
                },
              ],})(
              <Select  showSearch style={{width: '100%'}} size="large"
                       placeholder="请选择车辆"
                       onSelect={carhandleChange}

              >
                {options}
              </Select>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="司机">
            {getFieldDecorator('driver', {initialValue: driver == '' ? vehicleTime.driver:driver})(
              <Input style={{width: '100%'}} size="large" disabled placeholder="请输入司机姓名"/>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="电话">
            {getFieldDecorator('driverPhone', {initialValue: driverPhone==''?vehicleTime.driverPhone:driverPhone})(
              <Input style={{width: '100%'}} size="large" disabled placeholder="请输入电话号码"/>
            )}
          </FilterItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...ColPropsadd}>
          <FilterItem label="发车地址">
            {getFieldDecorator('pickAdd', {
              initialValue: !vehicleTime.provinceName ? undefined: vehicleTime.provinceName+vehicleTime.cityName+vehicleTime.countyName+vehicleTime.pickAddress,
              rules: [
                {
                  required: true,
                  message:"请选择发车地址",
                },
              ],})(
              <Select  showSearch style={{width: '100%'}} size="large"
                       placeholder="请选择发车地址"
                       onSelect={addhandleChange}
              >
                {mapOption()}
              </Select>
            )}
          </FilterItem>
        </Col>
      </Row>
        <Row gutter={24}>
          <Col {...ColPropsadd}>
            <FilterItem label="货物类型">
              {getFieldDecorator('cargoType', {
                initialValue: "",
                rules: [
                  {
                    required: true,
                    message:"请选择货物类型",
                  },
                ],})(
                <Select  showSearch style={{width: '100%'}} size="large"
                         placeholder="请选择货物类型"
                >
                  {typeOption()}
                </Select>
              )}
            </FilterItem>
          </Col>
        </Row>
      <Row gutter={24}>
        <Col {...ColProps}>
          <FilterItem label="匹配方式">
            {getFieldDecorator('matchType', { initialValue: matchingType,
              rules: [
                {
                  required: true,
                  message:"请选择车辆",
                },
              ],})(
              <Select  showSearch style={{width: '100%'}} size="large"
                       placeholder="请选择匹配方式"
                       onSelect={marchingchanger}
              >
                <Option key={"0"} value={"0"}>半径匹配</Option>
                <Option key={"1"} value={"1"}>最短路径</Option>
              </Select>
            )}
          </FilterItem>
        </Col>
        {isradius}
      </Row>
      </div>

      <div style={{paddingLeft:"2px"}}>
        <div style={{marginBottom: "20px", height: "20px"}}>
          <div style={{fontSize: '14px', color: '#333333', fontWeight: 900, float: "left"}}>目的地信息</div>
          <div style={{float: 'right'}}><span style={{marginRight: 8, marginLeft: 8}}>剩余运力:</span>
            剩余体积(方)<span style={{marginLeft: 8, maringRight: 8, fontSize: 20, color: '#11C2B2'}}>
              {restvolume ? restvolume : 0}</span><span style={{marginRight: 8, marginLeft: 8}}>剩余重量(公斤):
            </span><span style={{marginLeft: 8, fontSize: 20, color: '#11C2B2'}}>{restweight ? restweight : 0}</span>
          </div>
        </div>
        <div style={{display:"none"}}>
        <Row gutter={24}>
          <Col {...ColProps} >
            <span style={{'float':'right',marginTop:"5px"}}>剩余运力</span>

          </Col>
          <Col {...ColProps} >
            <FilterItem label="体积">
              {getFieldDecorator('transportationVolume', {initialValue: volume})(
                <Input style={{width: '100%'}} size="large" disabled />
              )}
            </FilterItem>
          </Col>
          <Col {...ColProps} >
            <FilterItem label="重量">
              {getFieldDecorator('transportationWeight', {initialValue: weight})(
                <Input style={{width: '100%'}} size="large" disabled />
              )}
            </FilterItem>
          </Col>
        </Row>
        </div>
      </div>

      {/** 列表区域**/}
      <div className="searchbox" style={{paddingLeft:"20px",paddingBottom:0,marginBottom:0}}>
  <Row>
    <Col {...ColPropsadds} >
      <Button size="large" className="margin-right primary-green"  onClick={onAdd}><Icon type="plus-circle-o"/>新增目的地址</Button>
      {/** <Button size="large" className="margin-right" onClick={onEdit}>编辑</Button>**/}
      <Popconfirm title={'确定删除所选条目吗？'} placement="right" onConfirm={handleDeleteItems}>
        <Button disabled={selectedRows.length==0} className={selectedRows.length==0?"primary-delete":"primary-white"} size="large">删除</Button>
      </Popconfirm>
    </Col>
  </Row>
</div>
     <Table
        loading = { loading.effects['vehicle/query'] }
        dataSource = {addressArr}
        rowSelection={rowSelection}
        scroll={{ x: '100%' }}
        columns={columns}
        onChange={onChangeTable}
        rowKey='id'
        pagination={false}
        className="searchwrap"
      />
      <Row>
        <Col {...ColPropscars} ></Col>
      <Col {...ColPropscars} >
        {/**<Button size="large" className="marginRight" disabled={addDisabled} style={{marginTop:'20px',marginRight:"20px"}} onClick={keepadd}>继续发布</Button>**/}
        <Button size="large" type="primary" className="margin-right primary-blue" disabled={pickable} style={{marginTop:'20px',marginRight:"20px"}} onClick={onAddAllcar}>发布班次</Button>
        <Button size="large" className="primary-white" disabled={addDisabled} style={{marginTop:'20px'}} onClick={closeadd}>关闭</Button>

      </Col>
        <Col {...ColPropscars} ></Col>
    </Row>
      {modalVisible && <Mapmodal {...modalProps} />}
      {addressVisible && <Address {...addressmodalProps} />}
    </div>
      </div>
  )

}

Vehicle.propTypes = {
  dispatch: PropTypes.func,
  vehicle: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  Select:PropTypes.object,
}

export default connect(({ vehicle, loading }) => ({ vehicle, loading }))(Form.create()(Vehicle))
