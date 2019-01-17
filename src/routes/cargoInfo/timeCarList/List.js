import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({addCargo, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    addCargo(record.id,record.transportationVolume,record.transportationWeight)
  }

  const columns =  [
    {
      title: '序号',
      dataIndex: '',
      key: '',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      },
    }, {
      title: '始发地',
      dataIndex: 'pickAddress',
      key: 'pickAddress',
    }, {
      title:'目的地',
      dataIndex:'sendAddress',
      key:'sendAddress',
    },{
      title:'车牌号',
      dataIndex:'vehicleNo',
      key:'vehicleNo'
    },{
      title:'发车时间',
      dataIndex:'pickTime',
      key:'pickTime'
    },{
      title:'剩余体积(方)',
      dataIndex:'transportationVolume',
      key:'transportationVolume'
    },{
      title:'剩余重量(公斤)',
      dataIndex:'transportationWeight',
      key:'transportationWeight'
    },{
      title:'操作',
      dataIndex:'choosed',
      key:'choosed',
      width:85,
      render: (text, record, index) => {
        return <div><a href = 'javascript:void(0);' style={{marginRight:5}} onClick = {() => handleMenuClick(record)}>选择该班线</a></div>
      }
    }];

  return (
    <div>
      <Table
        {...tableProps}
        className='components-table-demo-nested'
        scroll={{ x: '100%' }}
        columns={columns}
        simple
        // className="searchwrap"
      />
    </div>
  )
}

List.propTypes = {
  location: PropTypes.object,
}

export default List
