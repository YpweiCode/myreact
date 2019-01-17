import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

const confirm = Modal.confirm

const List = ({ showDetail,showAdd, showMaps,getimages,location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    var statusClose = false;
    let date=new Date(record.effectTime).getTime();
    let newdate=new Date().getTime()
    if((record.status<=3)&&newdate>=date){
      statusClose = true;
    }
    showDetail(record.id+"?"+statusClose);
  }
  const handleShowAdd = (record, e) => {
    showAdd(record)
  }
  const getMap = (record, e) => {
    showMaps(record)
  }

const getimage = (record, e) => {
  getimages(record)
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
      title: '货物状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        let date=new Date(record.effectTime).getTime();
        let newdate=new Date().getTime()
        if((record.status<=3)&&newdate>=date){
          return <p>已过期</p>
        }else{
        return <p>{record.status==1?'发布':record.status==2?'已确定':record.status==3?'已拒绝':record.status==4?'已锁定':record.status==6?'已过期':'已取消'}</p>
        }
      }
    }, {
      title:'提货方信息',
      dataIndex:'pickAddress',
      key:'pickAddress',
    },{
      title:'收货方信息',
      dataIndex:'sendAddress',
      key:'sendAddress'
    },{
      title:'货物名称',
      dataIndex:'cargoName',
      key:'cargoName'
    },{
      title:'件数',
      dataIndex:'quantity',
      key:'quantity'
    },{
      title:'体积(方)',
      dataIndex:'volume',
      key:'volume'
    },{
      title:'重量（公斤）',
      dataIndex:'weight',
      key:'weight'
    },{
      title:'最晚送达时间',
      dataIndex:'lastArriveTime',
      key:'lastArriveTime'
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      dataIndex: '查看详情',
      key: '查看详情',
      width:80,
      render: (text, record, index) => {
        return <div><a href = 'javascript:void(0);' style={{marginRight:5}} onClick = {() => handleMenuClick(record)}>详情</a>
          <a href = 'javascript:void(0);' onClick = {() => handleShowAdd(record.id)}>复制</a></div>
      }
    },{
      title: '电子回单',
      dataIndex: 'remark1',
      key: 'remark1',
      render: (text, record, index) => {
        return <a href = 'javascript:void(0);' disabled={!(record.status === 4)} onClick = {() => getimage(record)}>查看</a>
      }
    },{
      title: '历史轨迹',
      dataIndex: 'history',
      key: 'history',
      render: (text, record, index) => {
        return <a href = 'javascript:void(0);' disabled={!(record.status === 4)}
                  onClick = {() => getMap(record)}>查看轨迹</a>
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
        rowKey={(record) => {return record.id}}
      />
    </div>
  )
}

List.propTypes = {
  location: PropTypes.object,
}

export default List
