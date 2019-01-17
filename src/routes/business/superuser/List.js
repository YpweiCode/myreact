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

  const handleClick = (record, e) => {

    if (e.target.innerText === '编辑') {
      onEditItem(record)
    } else if (e.target.innerText === '删除') {
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
    },{
      title: '联系人名称',
      dataIndex: 'concatName',
      key: 'concatName',
    },
    // {
    //  title: '保证金',
    //  dataIndex: '',
    //  key: '',
    //  render: ( text, record ) => {
    //    if(record.safeMoney && parseInt(record.safeMoney) > 0) {
    //      return '是';
    //    }else {
    //      return '否';
    //    }
    //  }
    //}, {
    //  title: '保证金额',
    //  dataIndex: 'safeMoney',
    //  key: 'safeMoney',
    //},
       {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <span onClick={e => handleClick(record, e)}><a href="javascript:void(0);" style={{marginRight:"10px"}}>编辑</a><a href="javascript:void(0);">删除</a></span>
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
        rowKey={record => record.id}
        className=""
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
