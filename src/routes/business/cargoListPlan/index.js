import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Form,Switch, Row, Col, Button, Table, Input,Select,Popconfirm,message} from 'antd'
import { Page } from 'components'
import Modal from './PlanModal'
import mapsrc from '../../../public/map.png'
import styles from '../.././app.less'
const confirm = Modal.confirm

const dateFormat = 'YYYY-MM-DD HH:mm:ss'
const CargoListPlan = ({ dispatch, cargoListPlan, loading, form: {
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
  const ColPropstext = {
    xs:24,
    sm:24,
    style: {
      marginBottom: 0,
      marginTop: 7,
    },
  }
  const ColPropsplans = {
    xs:4,
    sm: 4,
    push:10,
    style: {
      marginBottom: 16,
    },
  }
  const ColPropsplan = {
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

  const { dataSource,weight,volume,pickTime,effectTime,vehicleNo,address,driver,driverPhone,cargos,plansArr,AddModelVisible,mapodate} = cargoListPlan;


  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      },
    }, {
      title: '零担状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record,index)=>{
        return record.status==1?'发布':record.status==2?'已确定':record.status==3?'已拒绝':record.status==4?'已锁定':record.status==5?'已取消':'已过期'
      }
    }, {
      title: '操作',
      dataIndex: '匹配方案',
      key: '匹配方案',
      render: (text, record, index) => {
        return <a href = 'javascript:void(0);' onClick = {() => handleMenuClick(record.id)}>匹配方案</a>
      }
    },{
      title: '提货方信息',
      dataIndex: 'pickAddress',
      key: 'pickAddress',
    },{
      title: '收货方信息',
      dataIndex: 'sendAddress',
      key: 'sendAddress',
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',
    }, {
      title: '件数',
      dataIndex: 'quantity',
      key: 'quantity',
    }, {
      title: '体积(方)',
      dataIndex: 'volume',
      key: 'volume',
    }, {
      title: '重量(公斤)',
      dataIndex: 'weight',
      key: 'weight',
    },{
      title: '最晚送达时间',
      dataIndex: 'lastArriveTime',
      key: 'lastArriveTime',
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }
  ];

  function seemap(...parms){
    dispatch({
      type: 'cargoListPlan/updateState',
      payload: {
        mapodate: parms[0].locus
      }
    })
    dispatch({
      type: 'cargoListPlan/showModal',
    })
  }
  function refreshplan(...parms){
    // dispatch({
    //   type: 'cargoListPlan/getPlan',
    //   payload: {}
    // })
    dispatch(routerRedux.push({
      pathname: '/bussiness/cargoListPlan',
    }))
  }
  function selectplan(...parms){
    let objArr=[];
    let time_car_id=""
    if(parms[0]==1){
      for(let j=0;j<plansArr[0].length;j++){
        time_car_id=plansArr[0][j].vehicleTime.id;
        for(let i=0;i<plansArr[0][j].cargos.length;i++){
          let obj={};
          obj.id=plansArr[0][j].cargos[i].id;
          obj.time_car_id=time_car_id;
          objArr.push(obj)
        }
      }

    }else{
      for(let j=0;j<plansArr[1].length;j++){
        time_car_id=plansArr[1][j].vehicleTime.id;
        for(let i=0;i<plansArr[1][j].cargos.length;i++){
          let obj={};
          obj.id=plansArr[1][j].cargos[i].id;
          obj.time_car_id=time_car_id;
          objArr.push(obj)
        }
      }
    }
    dispatch({
      type: 'cargoListPlan/updateState',
      payload: {
        mapodate: parms[0].locus
      }
    })
    dispatch({
      type: 'cargoListPlan/selectPlan',
      payload: {
        data:objArr
      }
    })
  }

  const handleMenuClick = (record, e) => {

      dispatch(routerRedux.push({
        pathname: '/cargo/cargoDetail?'+record,
      }))
  }

  const modalPropsadd = {
    visible: AddModelVisible,
    maskClosable: false,
    title: `班线轨迹`,
    footer:null,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cargoListPlan/hideModal',
      })
    },
  }

  const carcolumns=[
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      },
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',

    } ,{
      title: '件数',
      dataIndex: 'quantity',
      key: 'quantity',
    }, {
      title: '体积(方)',
      dataIndex: 'volume',
      key: 'volume',
    }, {
      title: '重量(公斤)',
      dataIndex: 'weight',
      key: 'weight',
    },{
      title: '收货方地址',
      dataIndex: 'sendAddress',
      key: 'sendAddress',
    },{
      title: '发货方地址',
      dataIndex: 'pickAddress',
      key: 'pickAddress',
    }]
  let goodplan=null;
  let normalplan=null;
  if(plansArr[0]&&plansArr.length>=1){
    goodplan=plansArr[0].map((item,index)=>{
      return (
        <div key={String(index)}>
          <Row gutter={24}>
            <Col>
              <span style={{color:"#dd4444",fontSize:'14px'}}>平台计算费用:{item.price.toFixed(2)}(元)&nbsp;&nbsp;结算费用请以实际发生费用为准</span>
            </Col>
            <Col {...ColPropstext}>
              <span style={{fontSize:'14px'}}>
                车&nbsp;&nbsp;辆&nbsp;&nbsp;{index+1}&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                车主公司名称:&nbsp;{item.vehicleTime.vehicle.ucenterUserQuery.concatName}&nbsp;
                {item.vehicleTime.pickTime.substring(5,7)}月{item.vehicleTime.pickTime.substring(8,10)}号{item.vehicleTime.pickTime.substring(10,16)}发车&nbsp;&nbsp;
                车牌:&nbsp;{item.vehicleTime.vehicle.vehicleNo} &nbsp;
                司机:&nbsp;{item.vehicleTime.vehicle.ucenterUserQuery.name}&nbsp;
                联系电话:{item.vehicleTime.vehicle.ucenterUserQuery.telephone}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{color:"#dd6145",fontSize:'14px'}}>货物信息</span>
              </span>
            </Col>
          </Row>
          {/*<Row>*/}
            {/*<Col>*/}
              {/*<span style={{color:"#dd4444",fontSize:'14px'}}>平台计算费用:</span>*/}
            {/*</Col>*/}
          {/*</Row>*/}
          <Row gutter={24}>
            <Table style={{width:"90%",float:"left"}}
                   loading = { false }
                   dataSource = {item.cargos}
                   scroll={{ x: '100%' }}
                   columns={carcolumns}
                   pagination = {false}
                   rowKey='id'
            />
            <div style={{width:"10%",float:"left",cursor:"pointer"}} onClick={seemap.bind(this,item)} > <img  style={{display:"block",margin:"0 auto",}} src={mapsrc}/><span style={{width:"100%",clear:"both",display:"block",textAlign:"center"}}>浏览班线轨迹</span></div>

          </Row>
        </div>
      )
    })
  }
  if(plansArr[1]&&plansArr.length==2){
    normalplan=plansArr[1].map((item,index)=>{
      return (
        <div key={index}>
          <Row gutter={24}>
            <Col>
              <span style={{color:"#dd4444",fontSize:'14px'}}>平台计算费用:{item.price.toFixed(2)}(元)&nbsp;&nbsp;结算费用请以实际发生费用为准</span>
            </Col>
            <Col {...ColPropstext}>
              <span style={{fontSize:'14px'}}>
                车&nbsp;&nbsp;辆&nbsp;&nbsp;{index+1}&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                车主公司名称:&nbsp;{item.vehicleTime.vehicle.ucenterUserQuery.concatName}&nbsp;
                {item.vehicleTime.pickTime.substring(5,7)}月{item.vehicleTime.pickTime.substring(8,10)}号{item.vehicleTime.pickTime.substring(10,16)}发车&nbsp;&nbsp;
                车牌:&nbsp;{item.vehicleTime.vehicle.vehicleNo} &nbsp;
                司机:&nbsp;{item.vehicleTime.vehicle.ucenterUserQuery.name}&nbsp;
                联系电话:{item.vehicleTime.vehicle.ucenterUserQuery.telephone}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{color:"#dd6145",fontSize:'14px'}}>货物信息</span>
              </span>
            </Col>
          </Row>
          {/*<Row>*/}
            {/*<Col>*/}
              {/*<span style={{color:"#dd4444",fontSize:'14px'}}>货物信息:</span>*/}
            {/*</Col>*/}
          {/*</Row>*/}
          <Row gutter={24}>
            <Table style={{width:"90%",float:"left"}}
                   loading = { false }
                   dataSource = {item.cargos}
                   scroll={{ x: '100%' }}
                   columns={carcolumns}
                   pagination = {false}
                   rowKey='id'
            />
            <div  onClick={seemap.bind(this,item)}  style={{width:"10%",float:"left",cursor:"pointer"}}> <img  style={{display:"block",margin:"0 auto",}} src={mapsrc}/><span style={{width:"100%",clear:"both",display:"block",textAlign:"center"}}>浏览班线轨迹</span></div>
          </Row>
        </div>
      )
    })
  }
  return (
    <Page inner>

      {/** 搜索区域**/}
      <Row gutter={24}>
        <Col {...ColProps} >
          <span style={{'float':'left',marginTop:"5px",fontSize:"16px"}}>零担列表</span>
        </Col>
      </Row>

      {/** 列表区域**/}
      <Table
        loading = { loading.effects['vehicle/query'] }
        dataSource = {cargos}
        scroll={{ x: '100%' }}
        columns={columns}
        pagination = {false}
        rowKey='id'
        className="searchwrap"
      />
      <Row gutter={24}>
        <Col {...ColProps} >
          <span style={{'float':'left',marginTop:"5px",fontSize:"16px",}}>方案列表</span>
        </Col>
      </Row>
      <Row gutter={24} style={{display:(plansArr.length>=1)?"none":"block"}}>
        <Col {...ColPropsplans}>
          <span style={{marginLeft:'20px'}} >暂无方案</span>
        </Col>
      </Row>
      <div style={{display:(plansArr[0]&&plansArr.length>=1)?"block":"none"}}>
        <Row gutter={24} style={{}}>
          <Col {...ColPropsplan} >
            <span style={{'float':'left',margin:0,padding:0,fontSize:"14px",height:"30px",width:"100%",backgroundColor:"#ccc"}}>最优方案</span>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...ColProps} style={{margin:0,padding:0}}>
            {/**<span style={{color:"red"}}>平台计算费用:300元</span>**/}
          </Col>
        </Row>
        {goodplan}
        <Row gutter={24}>
          <Col {...ColPropsplan} style={{margin:0,padding:0}}>
            <div style={{width:"90%",marignTop:6}}>
              <Button onClick={selectplan.bind(this,1)} size="large" className="marginRight" style={{margin:'20px 0',float:"right"}} >选择该方案</Button>
            </div>

          </Col>
        </Row>
      </div>


      <div style={{display:(plansArr[1]&&plansArr.length==2)?"block":"none"}}>
        <Row gutter={24} style={{}}>
          <Col {...ColPropsplan} >
            <span style={{'float':'left',margin:0,padding:0,fontSize:"14px",height:"30px",width:"100%",backgroundColor:"#ccc"}}>参考方案</span>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...ColProps} style={{margin:0,padding:0}}>
            {/**<span style={{color:"red"}}>平台计算费用:300元</span>**/}
          </Col>
        </Row>
        {normalplan}
        <Row gutter={24}>
          <Col {...ColPropsplan} style={{margin:0,padding:0}}>
            <div style={{width:"90%",marignTop:6}}>
              <Button size="large" onClick={selectplan.bind(this,2)} className="marginRight" style={{marginTop:'20px',float:"right"}} >选择该方案</Button>
            </div>

          </Col>
        </Row>
      </div>
      <Row gutter={24}>
        <Col {...ColPropsplans}>
          <Button size="large" type="primary"  className="margin-right primary-blue"  onClick={refreshplan} style={{margin:'20px auto'}} >刷新整体方案</Button>
        </Col>
      </Row>
      {AddModelVisible && <Modal {...modalPropsadd} data={mapodate}/>}
    </Page>
  )

}

CargoListPlan.propTypes = {
  dispatch: PropTypes.func,
  cargoListPlan: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  Select:PropTypes.object,
}

export default connect(({ cargoListPlan, loading }) => ({ cargoListPlan, loading }))(Form.create()(CargoListPlan))
