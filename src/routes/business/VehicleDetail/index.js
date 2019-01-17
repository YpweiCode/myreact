import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import { Form,Switch, Row, Col, Button, Table, Input,Select,Popconfirm, DatePicker,message} from 'antd'
import { Page } from 'components'
import Modal from './mapModel'
import Address from './address'
import moment from 'moment'
 const confirm = Modal.confirm

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const { RangePicker } = DatePicker;
const Option = Select.Option;
const Newvehicle = ({ dispatch, newvehicle, loading, form: {
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
  const ColPropscars = {
    xs:10,
    sm: 10,
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


  const { status,dataSource,weight,volume,pickTime,effectTime,vehicleNos,address,driver,driverPhone,transportationVolume,transportationWeight,cargos,lockable} = newvehicle;


  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      },
    }, {
      title: '操作',
      dataIndex: 'status',
      key: 'status',
      render:(text,record,index)=>{
        return <Switch  disabled={status>=2||(window.location.href.split("?")[2])=='true'} checked={text==2?false:true} onChange={judge.bind(this,index)} checkedChildren="接单" unCheckedChildren="拒绝" />
      }
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',
    }, {
      title: '体积(方)',
      dataIndex: 'volume',
      key: 'volume',
    }, {
      title: '重量(公斤)',
      dataIndex: 'weight',
      key: 'weight',
    },{
      title: '提货信息',
      dataIndex: 'pickAddress',
      key: 'pickAddress',
    },{
      title: '送货信息',
      dataIndex: 'sendAddress',
      key: 'sendAddress',
    }, {
      title: '货主信息',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },{
      title: '费用',
      dataIndex: 'money',
      key: 'money',
    }
  ];

  const lockPlan=function(){
    dispatch({
      type: 'newvehicle/updateState',
      payload: {
        lockable:true,
      },
    })
    let tran=getFieldsValue();
    let arr=[];
    let data={};
    data.vehicleTimeId=window.location.href.split("?")[1];
    data.transportationVolume=tran.transportationVolume
    data.transportationWeight=tran.transportationWeight
    for(let i=0;i<cargos.length;i++){
      let object={};
      object.cargoId=cargos[i].id
      object.status=cargos[i].status!=2?true:false;
      arr.push(object)
    }
    data.lockParams=arr
    let objparms={};
    objparms.data=data;
    const returnobj=dispatch({
      type: 'newvehicle/lockcar',
      payload: {
        data:objparms,
      },
    })
    returnobj.then(function(){
      dispatch({
        type: 'newvehicle/updateState',
        payload: {
          lockable:false,
        },
      })
    })
  }

  const judge = (...parms) => {
    let index=parms[0];
    let ischecked=parms[1];
    let arr=JSON.parse(JSON.stringify(cargos));
    arr[index].status=(ischecked==true?"3":"2")
    let allW=weight;
    let allV=volume;
    let wSum=0;
    let vSum=0;
    for(let i=0;i<arr.length;i++){
      if(arr[i].status!=2){
        wSum+=arr[i].weight*100;
        vSum+=arr[i].volume*100;
      }
    }
    let restW=(allW*100-wSum)/100
    let restV=(allV*100-vSum)/100
    if(restW<0||restV<0){
      message.info("已超过当前剩余运力,请查看！");
      arr[index].status=2;
      dispatch({
        type: 'newvehicle/updateState',
        payload: {
          cargos:arr,
        },
      })
    }else{
      setFieldsValue({transportationVolume:restV})
      setFieldsValue({transportationWeight:restW})
      dispatch({
        type: 'newvehicle/updateState',
        payload: {
          cargos: arr
        },
      })
    }

  };
const  reset=function(){
  let arr=JSON.parse(JSON.stringify(cargos));
  for(let i=0;i<arr.length;i++){
    arr[i].status=2
  }
  let allW=weight;
  let allV=volume;
  let wSum=0;
  let vSum=0;
  for(let i=0;i<arr.length;i++){
    if(arr[i].status!=2){
      wSum+=arr[i].weight*100;
      vSum+=arr[i].volume*100;
    }
  }
  let restW=(allW*100-wSum)/100
  let restV=(allV*100-vSum)/100
  setFieldsValue({transportationVolume:restV})
  setFieldsValue({transportationWeight:restW})
  dispatch({
    type: 'newvehicle/updateState',
    payload: {
      cargos:arr,
    },
  })
}
  return (
    <Page inner>

      {/** 搜索区域**/}
      <Row gutter={24}>
        <Col {...ColProps}>
          <FilterItem label="提货时间">
            {getFieldDecorator('pickTime', { initialValue: pickTime,   rules: [
              {
                message:"请输入提货时间",
              },
            ],})(
              <Input disabled    />
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="信息有效期">
            {getFieldDecorator('effectTime', {initialValue: effectTime,
              rules: [
                {
                  message:"请输入有效时间",
                },
              ],})(
              <Input disabled  />
            )}
          </FilterItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...ColProps}>
          <FilterItem label="车辆">
            {getFieldDecorator('vehicleNo', { initialValue: vehicleNos,
              rules: [
                {
                  message:"请选择车辆",
                },
              ],})(
              <Input style={{width: '100%'}} size="large" disabled />
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="司机">
            {getFieldDecorator('driver', {initialValue: driver})(
              <Input style={{width: '100%'}} disabled size="large" />
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="电话">
            {getFieldDecorator('driverPhone', {initialValue: driverPhone})(
              <Input style={{width: '100%'}} size="large" disabled />
            )}
          </FilterItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...ColPropsadd}>
          <FilterItem label="提货地址">
            {getFieldDecorator('address', { initialValue: address,
              rules: [
                {
                  message:"请选择提货地址",
                },
              ],})(
              <Input style={{width: '100%'}} size="large" disabled />
            )}
          </FilterItem>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...ColProps} >
          <span style={{'float':'left',marginTop:"5px"}}>货物列表</span>

        </Col>
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

      {/** 列表区域**/}


     <Table
        loading = { loading.effects['newvehicle/query'] }
        dataSource = {cargos}
        scroll={{ x: '100%' }}
        columns={columns}
        pagination = {false}
        rowKey='id'
      />
      <Row>
        <Col {...ColPropscars} ></Col>
      <Col {...ColPropscars} >
        <Button size="large" className="marginRight" disabled={lockable||(window.location.href.split("?")[2])=='true'}  onClick={lockPlan} style={{marginTop:'20px',marginRight:"20px",display:(cargos.length==0||status>=2)?"none":"block",float:"left"}} >班线锁定</Button>
        <Button size="large" className="marginRight"  onClick={reset} style={{marginTop:'20px',marginRight:"20px",display:(cargos.length==0||status>=2)?"none":"block",float:"left"}} >重置操作</Button>
      </Col>
        <Col {...ColPropscars} ></Col>
    </Row>
    </Page>
  )

}

Newvehicle.propTypes = {
  dispatch: PropTypes.func,
  vehicle: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  Select:PropTypes.object,
}

export default connect(({ newvehicle, loading }) => ({ newvehicle, loading }))(Form.create()(Newvehicle))


