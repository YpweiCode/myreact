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
    showDetail(record)
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
      title: '货主',
      dataIndex: 'ownerName',
      key: 'ownerName',
    }, {
      title:'发布时间',
      dataIndex:'createTime',
      key:'createTime',
      render: (text, record, index) => {
        return String(text).substring(0,16)

      }
    },{
      title:'提货信息',
      dataIndex:'pickAddress',
      key:'pickAddress',
      width:150,
      render: (text, record, index) => {
        return <div>
                    <p>{record.pickTime?String(record.pickTime).substring(0,16):""}</p>
                    <p>{record.pickAddress?record.pickAddress:""}</p>
                    <p>{record.picker?record.picker+"        ":""}{record.pickPhone?record.pickPhone:""}</p>
              </div>
      }
    },{
      title:'收货信息',
      dataIndex:'sendAddress',
      key:'sendAddress',
      width:150,
      render: (text, record, index) => {
        return <div>
          <p>{record.lastArriveTime?String(record.lastArriveTime).substring(0,16):""}</p>
          <p>{record.sendAddress?record.sendAddress:""}</p>
          <p>{record.sender?record.sender+"        ":""}{record.sendPhone?record.sendPhone:""}</p>
        </div>
      }
    },{
      title:'货物类别',
      dataIndex:'cargoTypeText',
      key:'cargoTypeText',
    },{
      title:'货物信息',
      dataIndex:'volume',
      key:'volume',
      width:80,
      render: (text, record, index) => {
        return <div>
          <p>{record.cargoName}</p>
          <p>{record.quantity}(件)</p>
          <p>{record.volume}(方)</p>
          <p>{record.weight}(公斤)</p>
        </div>
      }
    },{
      title:'方案状态',
      dataIndex:'reStatus',
      key:'reStatus',
      render: (text, record, index) => {
        return text==null||text==2?"无":(text=='0'?"待货主确认":(text==1?"待承运商确认":"方案已生效"))
      }
    },{
      title: '可视化追踪',
      dataIndex: 'history',
      key: 'history',
      render: (text, record, index) => {
        return <a href = 'javascript:void(0);' disabled={!(record.reStatus >= 3)}
                  onClick = {() => getMap(record)}>查看详情</a>
      }
    },{
      title:'帐单状态',
      dataIndex:'billStatus',
      key:'billStatus',
      render: (text, record, index) => {
        if(text){
          return text==100?"账单待货主确认":(text==200?"账单待承运商确认":"已完成")
        }else{
          return '--'
        }

      }
    }, {
      title: '电子回单',
      dataIndex: 'remark1',
      key: 'remark1',
      render: (text, record, index) => {
        return <a href = 'javascript:void(0);' disabled={!(record.reStatus >= 3)} onClick = {() => getimage(record)}>查看</a>
      }
    },];

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
