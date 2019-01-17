import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, onShowPlanModal, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定要删除此条记录?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const handleShowPlan = (cargo) =>{
    onShowPlanModal(cargo)
  }

  const childColumns =  [
    {
      title: '客户单号',
      dataIndex: 'cargoCode',
      key: 'cargoCode',
    }, {
      title: '货物名称',
      dataIndex: 'cargoName',
      key: 'cargoName',
    }, {
      title:'收货地址',
      dataIndex:'sendAddress',
      key:'sendAddress',
    },{
      title:'收货方姓名',
      dataIndex:'sender',
      key:'sender'
    },{
      title:'收货方电话',
      dataIndex:'sendPhone',
      key:'sendPhone'
    },{
      title:'体积（m³）',
      dataIndex:'volume',
      key:'volume'
    },{
      title:'件数',
      dataIndex:'quantity',
      key:'quantity'
    },{
      title:'重量（千克）',
      dataIndex:'weight',
      key:'weight'
    },
    {
      title: '匹配方案',
      // width: 300,
      dataIndex: '',
      key: '',
      render: (text, cargo, index) => {
        if (cargo.relevance && cargo.relevance.status === 2) {
          return <a href = 'javascript:void(0);' onClick = {() => handleShowPlan(cargo)}>查看</a>
        } else {
          return '无'
        }
      }
    }];

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '订单日期',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '提货方姓名',
      dataIndex: 'picker',
      key: 'picker',
    }, {
      title: '提货方电话',
      dataIndex: 'pickPhone',
      key: 'pickPhone',
    },{
      title: '提货方地址',
      dataIndex: 'pickAddress',
      key: 'pickAddress',
    }, {
      title: '提货时间',
      dataIndex: 'pickTime',
      key: 'pickTime',
    },{
      title: '有效时间',
      dataIndex: 'effectTime',
      key: 'effectTime',
    },];

  const expandedRowRender = (pItem) => {
    return (
        <Table
          columns={childColumns}
          dataSource={pItem.cargos}
          rowKey={record => record.id}
          pagination={false}
        />
    );

  }


  return (
    <div>
      <Table
        {...tableProps}
        className='components-table-demo-nested'
        scroll={{ x: '100%' }}
        columns={columns}
        simple
        expandedRowRender={expandedRowRender}
        rowKey={(record) => {return record.id}}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
