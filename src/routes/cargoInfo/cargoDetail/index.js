import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import { Form, Row, Col, Button, Select, Input, Modal, Card, Table } from 'antd'
import { Page } from 'components'


const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const CargoDetail = ({ dispatch, cargoDetail, loading}) => {
  const ColProps = {
    xs: 12,
    sm: 8,
  }

  const SmColProps = {
    xs: 12,
    sm: 5,
  }

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  }

  const chooseTheCar = (car,cargo) =>{
    dispatch({
      type:'cargoDetail/chooseTheCar',
      payload: {
        id:cargo.id,
        vehicleTimeId:car.id,
        money:(car.price == null||car.price =="" )? cargo.money : car.price,
      }
    })
  }

  const {cars=[], statusFont,cargo={}} = cargoDetail;

  const carCol = [{
    title: '平台计算费用',
    dataIndex: 'price',
    render:(text, record)=>{
      return text?text:record.money
    },
  }, {
    title: '车主公司名称',
    dataIndex: 'username',
  }, {
    title: '发车时间',
    dataIndex: 'pickTime',
  }, {
    title: '车牌号',
    dataIndex: 'vehicleNo',
  }, {
    title: '司机',
    dataIndex: 'driver',
  }, {
    title: '联系电话',
    dataIndex: 'driverPhone',
  }];


  const pickerInfoCol = [{
    title: '提货方姓名',
    dataIndex: 'picker',
    key: 'picker',
    width:"25%",

  }, {
    title: '电话',
    dataIndex: 'pickPhone',
    key: 'pickPhone',
    width: "25%",

  }, {
    title: '地址',
    dataIndex: '',
    key: '',
    render: () => {
      return cargo.pickProvince+cargo.pickCity+cargo.pickCounty+cargo.pickAddress;
    }
  }];
  const sendrInfoCol = [{
    title: '收货方姓名',
    dataIndex: 'sender',
    key: 'sender',
    width: "25%",
  }, {
    title: '电话',
    dataIndex: 'sendPhone',
    key: 'sendPhone',
    width: "25%",
  }, {
    title: '地址',

    dataIndex: '',
    key: '',
    render: () => {
      return cargo.sendProvince+cargo.sendCity+cargo.sendCounty+cargo.sendAddress;
    }
  }];

  const cargoInfosCol = [{
    title: '货物名称',
    dataIndex: 'cargoName',
    key: 'cargoName',
  }, {
    title: '件数',
    dataIndex: 'quantity',
    key: 'quantity',
  }, {
    title: '体积（单位：方）',
    dataIndex: 'volume',
    key: 'volume',
  }, {
    title: '重量（单位：公斤）',
    dataIndex: 'weight',
    key: 'weight',
  }, {
    title: '最晚送达时间',
    dataIndex: 'lastArriveTime',
    key: 'lastArriveTime',
  }];


  const carsMatchList =  cars.length?　cars.map( (car, index) => {

    car['money'] = cargo.money;
    return (
      <Card  style={{marginTop: 20, marginBottom: 10, padding: 0}} key={car.id}
            bordered={false}
            extra={<Button type="primary" disabled={(cargo.status !== 1 & cargo.status !== 3)||window.location.href.split("?")[2]=='true'}
                           onClick={e=>chooseTheCar(car,cargo)}>{statusFont}</Button>} >
        <Table
          columns={carCol}
          dataSource={[cars[index]]}
          pagination={false}
        />
      </Card>
    )
    }
  ) : (<p style={{marginTop: 20}}> 暂无匹配方案</p>);

  return(
    <Page inner>


      <h2>零担信息</h2>

      <p style={{margin: '20px 0'}}><span style={{marginRight:30}}>提货时间: {cargo.pickTime}</span> <span>有效时间: {cargo.effectTime}</span></p>

        <Row>

          <Table columns={pickerInfoCol}
                 dataSource={[cargo]}
                 // title={() => '提货方信息'}

                 pagination={false}/>

          <Table columns={sendrInfoCol}
                 dataSource={[cargo]}
                 // title={() => '收货方信息'}

                 pagination={false}/>
        </Row>
        <Row>
          <Table style={{marginTop:10}}
                 columns={cargoInfosCol}
                 dataSource={[cargo]}
                 title={() => '货物信息'}

                 pagination={false}/>
        </Row>
      <h2 style={{marginTop:80}}>匹配方案列表</h2>
      {/* 车辆信息 */}
      {carsMatchList}

    </Page>);

}

CargoDetail.propTypes = {
  dispatch: PropTypes.func,
  cargoDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ cargoDetail, loading }) => ({ cargoDetail, loading }))(Form.create()(CargoDetail))
