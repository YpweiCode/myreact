import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem, Page } from 'components'
import { connect } from 'dva'
import { Form, Row, Col, Button, Table, Input, Cascader, DatePicker, Select ,Timeline } from 'antd'
import { routerRedux } from 'dva/router'
import Modal from './PlanModal'
const Option = Select.Option

const CargoIndex = (
  { dispatch, cargoIndex, loading,
    form: {
      getFieldDecorator,
      getFieldsValue,
      setFieldsValue,
      validateFieldsAndScroll,
      },
    }) => {
  const ColProps = {
    xs: 12,
    sm: 6,
    style: {
      marginBottom: 16,
    },
  }

  const SmColProps = {
    xs: 12,
    sm: 4,
    style: {
      marginBottom: 16,
    },
  }
  const {pagination, modalVisible, currentItem,propobj,cargoArr,billArr,AddModelVisible } = cargoIndex
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width:50,
      render: (text, record, index) => {
        return index + 1
      },
    },
    {
      title: '提货点信息',
      dataIndex: 'pickInfo',
      key: 'pickInfo',
      render: (text, record, index) => {
        return <p>{record.picker}/{record.pickPhone}<br/>{record.pickAddress}</p>
      },
    },
    {
      title: '送货点信息',
      dataIndex: 'sendInfo',
      key: 'sendInfo',
      render: (text, record, index) => {
        return <p>{record.sender}/{record.sendPhone}<br/>{record.sendAddress}</p>
      },
    },
    {
      title: '货物信息',
      dataIndex: 'caogoInfo',
      key: 'caogoInfo',
      render: (text, record, index) => {
        return <p>{record.cargoName}<br/>{record.quantity}件/{record.volume}方/{record.weight}公斤</p>
      },
    },
    {
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
          return <a href="javascript:void(0);" className="primary-color" onClick={() => godetail(record)}>查看详情</a>
      },
    },
  ]
  const dealcolumns = [
    {
      title: '序号',
      dataIndex: 'dadsdsa',
      key: 'dadsdsa',
      width:50,
      render: (text, record, index) => {
        return index + 1
      },
    },
    {
      title: '提货点信息',
      dataIndex: 'pickInfo',
      key: 'pickInfo',
      render: (text, record, index) => {
        return <p>{record.picker}/{record.pickPhone}<br/>{record.pickAddress}</p>
      },
    },
    {
      title: '送货点信息',
      dataIndex: 'sendInfo',
      key: 'sendInfo',
      render: (text, record, index) => {
        return <p>{record.sender}/{record.sendPhone}<br/>{record.sendAddress}</p>
      },
    },
    {
      title: '货物信息',
      dataIndex: 'cargoInfo',
      key: 'cargoInfo',
      render: (text, record, index) => {
        return <p>{record.cargoName}<br/>{record.cargoQuantity}件/{record.cargoVolume}方{record.cargoWeight}公斤</p>
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <a href="javascript:void(0);" className="primary-color" onClick={() => getstatus(record)}>状态跟踪</a>
      },
    },
  ]
  const ModalProps = {
    item: currentItem,
    visible: AddModelVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cargoIndex/confirm'],
    title: '状态跟踪',
    width:800,
    wrapClassName: 'cargoIndex-center-modal',
    onOk (data) {
      dispatch({
        type: 'moncargoIndexey/confirm',
        payload: { ...currentItem, ...data, ...pagination },
      })
    },
    onCancel () {
      dispatch({
        type: 'cargoIndex/hideMap',
      })
    },
  }
  const godetail=(record)=>{
    dispatch(routerRedux.push({
      pathname: '/cargo/cargoDetail?'+record.id,
    }))

  }
  const getstatus=(record)=>{
    dispatch({
      type: 'cargoIndex/getCargoStatus',
      payload: {
        orderCode: record,
      },
    })
  }
  const handleConfirmModal = (record) => {
    dispatch({
      type: 'cargoIndex/update',
      payload: {
        id: record,
        modalType: 'confirm',
        // currentItem: record,
      },
    })
  }
  return (
    <div className="searchboxbg" style={{paddingBottom:20}}>
      {/** 列表区域 */}
      <div style={{width:"49%",float:"left"}}>
        <div className="tabletitlewrap"><div className="tabletitle"></div>待处理零担列表</div>
        <Table
          loading={loading.effects['cargoIndex/query']}
          dataSource={cargoArr}
          scroll={{ x: '48%' }}
          columns={columns}
          pagination={false}
          rowKey="id"
          className="searchwrap"
        />
      </div>
      <div style={{width:"49%",float:"right"}}>
        <div className="tabletitlewrap"><div className="tabletitle"></div>待处理账单列表</div>
        <Table
          loading={loading.effects['cargoIndex/query']}
          dataSource={billArr}
          scroll={{ x: '50%' }}
          columns={dealcolumns}
          pagination={false}
          rowKey="id"
          className="searchwrap"
        />
      </div>

      {AddModelVisible && <Modal propobj={propobj} {...ModalProps} />}
    </div>
  )
}
CargoIndex.propTypes = {
  dispatch: PropTypes.func,
  cargoIndex: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
export default connect(({ cargoIndex, loading }) => ({ cargoIndex, loading }))(Form.create()(CargoIndex))
