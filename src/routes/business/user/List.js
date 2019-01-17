import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e== '1') {
      onEditItem(record)
    } else if (e == '2') {
      confirm({
        title: '确定要删除此条记录?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '客户性质',
      dataIndex: 'natureName',
      key: 'natureName'
    }, {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      dataIndex: 'telephone',
      key: 'telephone',
    }, {
      title: '所属区域',
      dataIndex: 'areaName',
      key: 'areaName'
    }, {
      title: '物流园区',
      dataIndex: 'parkAddress',
      key: 'parkAddress',
    }, {
      title: '保证金',
      dataIndex: '',
      key: '',
      render: ( text, record ) => {
        if(record.safeMoney && parseInt(record.safeMoney) > 0) {
          return '是';
        }else {
          return '否';
        }
      }
    }, {
      title: '保证金额',
      dataIndex: 'safeMoney',
      key: 'safeMoney',
    }, {
      title: '联系人名称',
      dataIndex: 'concatName',
      key: 'concatName',
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <div>
          <a className="primary-color" style={{marginRight:5}} onClick={handleMenuClick.bind(this, record,1)}>编辑</a>
          <a className="primary-color"  style={{marginRight:5}} onClick={handleMenuClick.bind(this, record,2)}>删除</a>
        </div>
        //return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },
  ]


  return (
    <div>
      <Table
        {...tableProps}
        scroll={{ x: '100%' }}
        columns={columns}
        simple
        className="searchwrap"
        rowKey={record => record.id}
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
