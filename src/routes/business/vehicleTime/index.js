import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import { Form ,Row, Col, Button, Table, Input, Cascader, DatePicker ,Popconfirm,Select} from 'antd'
import { message } from 'antd';
import { Page } from 'components';
import RefuseModel from"./refuseModel"
import AddModel from"./addModel"
import PlanModal from './PlanModal'
import moment from 'moment';

const VehicleTime = ({ dispatch, vehicleTime, loading, form: {
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
  let selectedArr=null

  const { list, pagination, countData, noCountData,lockCountData,refusemodalVisible ,modalVisible,AddModelVisible,modalType,selectedRowKeys,selectedRows,routerDetail,readyCountData} = vehicleTime;
  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: '',
      render: (text, record,index) => {
        return <p>{index + 1}</p>
      }
    },
    {
      title: '班线状态',
      dataIndex: 'statusName',
      key: 'statusName',
      render:(text,record)=>{
          return  <div>{text}</div>
      }
     },
     {
       title: '操作',
       dataIndex: '',
       key: '',
       render:(text,record)=>{
         return <div><a className="primary-color"  style={{marginRight:5}} onClick={editItem.bind(this, record)}>详情</a>
                  <a className="primary-color"  style={{marginRight:5}} onClick={copeItem.bind(this, record)}>复制</a>
                </div>
             }
      },
    {
      title: '班线时间',
      dataIndex: 'pickTime',
      key: 'pickTime',
    }, {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
    }, {
      title: '始发地地址',
      dataIndex: 'pickAddress',
      key: 'pickAddress',
      /* render: (text, record){
       return <p>{record.cargos[0].pickAddress}</p>
       }*/
    },
  ];
  const modalProps = {
    item: routerDetail,
    visible: modalVisible,
    maskClosable: true,
    // confirmLoading: loading.effects['cargo/update'],
    title: '匹配方案',
    wrapClassName: 'vertical-center-modal',

    onCancel () {
      dispatch({
        type: 'vehicleTime/hidePlanModal',
      })
    },
    footer: null
  }
  const modalPropsadd = {
    //item: modalType === 'create' ? {} : currentItem,
    visible: AddModelVisible,
    //carType:carType,
    maskClosable: false,
    //confirmLoading: loading.effects['vehicle/update'],
    title: `班次拒绝`,
    wrapClassName: 'vertical-center-modal',
    onOk (parm) {
      let data={};
      data.id=selectedRows[0].id;
      data.refuseReason=parm.remark;
      data.vehicleNo=selectedRows[0].vehicleNo;
      dispatch({ type: 'vehicleTime/refuse', payload: {id:selectedRows[0].id,refuseReason:parm.remark,vehicleNo:selectedRows[0].vehicleNo}});
    },
    onCancel () {
      dispatch({
        type: 'vehicleTime/hideAddModal',
      })
    },
  };

  const editItem = (record) =>{
    var status = false;
    if(record.statusName == '已关闭'){
      status = true;
    }
    dispatch({ type: 'vehicleTime/edit', payload: {id: record.id+'?'+status}});
  };

  const copeItem = (record) =>{
    dispatch({ type: 'vehicleTime/addVehicleTime', payload: {id: record.id}});
  };

  const searchdetail = (e,record) =>{
    if(record.patterns=="无"){
      message.info("暂无方案")
      return
    }
    let data=dispatch({ type: 'vehicleTime/getmethod', payload: {vehicleTimeId: record.id}});
    data.then(function(result){
      dispatch({ type: 'vehicleTime/updateState', payload: {routerDetail:result}});
      dispatch({ type: 'vehicleTime/showPlanModal', payload: {}});
    })
    //
    //dispatch({ type: 'vehicleTime/edit', payload: {id: record.id}});
  }
  const delectItem = (e,record) =>{
    dispatch({ type: 'vehicleTime/toDetail', payload: {id: record.id}});
  }
  const rowSelection = {
    onChange: (Keys, Rows) => {
      dispatch({
        type: 'vehicleTime/updateState',
        payload: {
          selectedRowKeys: Keys,
          selectedRows: Rows,
        },
      })
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
    }),
  };
  const handleSubmit = (item) => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'vehicleTime/countTimes', payload: {... values, ... pagination}});
      dispatch({ type: 'vehicleTime/noCountTimes', payload: {... values, ... pagination, ...{status: 6}}});
      dispatch({ type: 'vehicleTime/readyCountTimes', payload: {... values, ... pagination, ...{status: 1}}});
      dispatch({ type: 'vehicleTime/lockCountTimes', payload: {... values, ... pagination, ...{status: 2}}});
      if(item){
        dispatch({ type: 'vehicleTime/query', payload: {... values, ... pagination, ...{status: item}}});
      }else {
        dispatch({ type: 'vehicleTime/query', payload: {... values, ... pagination}});
      }
      dispatch({ type: 'vehicleTime/updateState', payload: {selectedRowKeys:"",selectedRows:""}});
    })
  }
  const onAdd = () => {
    dispatch({ type: 'vehicleTime/add', payload: {}});
  }
  const onEdit = () => {
    dispatch({
      type: 'vehicle/showModal',
      payload: {
        modalType: 'create',
      },
    });
    dispatch({
      type: 'vehicle/thinkCarType',
      payload: {
        typeName: '',
      },
    })
  }

  const onPath = () => {
   const data= dispatch({
      type: 'vehicleTime/updateStatusToIssue',
      payload: {
        ids: selectedRowKeys.join(','),
      },
    })
    data.then(function(){
      handleSubmit()
    })

  }
  const onRefuse = () => {

    const data=dispatch({
      type: 'vehicleTime/showAddModal',
      payload: {
        modalType: 'update',
        //ids: selectedRowKeys.join(','),
      },
    })
    data.then(function(){
      handleSubmit()
    })

    //handleSubmit()
  }
  const onLock = () => {
    const data=dispatch({
      type: 'vehicleTime/updateStatusToLock',
      payload: {
        id: selectedRowKeys.join(','),
      },
    })
    data.then(function(){
      handleSubmit()
    })

  }

  const onChangeTable = (pagination, filters, sorter) => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'vehicleTime/query', payload: {... values, ... pagination}});
    })
  }

  const billConfirm = (pagination, filters) => {
    {/**账单确认**/}
  }
  const handleDeleteItems = () => {

    let data=dispatch({
      type: 'vehicleTime/deleteVehicleTime',
      payload: {
        id: selectedRowKeys[0]
      },
    })
    data.then(function(){
      handleSubmit()

    })


  };

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  return (
    <div className="searchboxbg">
      {/** 搜索区域**/}
      <div className="searchbox" style={{paddingLeft:27}}>
      <Row gutter={24}>
        <Col {...ColProps}>
          <FilterItem label="发布日期">
            {getFieldDecorator('time', { initialValue: moment(moment().subtract(0, 'days'),"YYYYMMDD")})(
              <DatePicker   />
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="账单状态">
            {getFieldDecorator('status', {initialValue: ''})(
              <Select  showSearch style={{width: '100%'}} size="large" optionFilterProp="children"
                       filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={-1}></Option>
                <Option value={1}>已发布</Option>
                <Option value={3}>已关闭</Option>
                <Option value={2}>已锁定</Option>
                <Option value={4}>已完成</Option>
              </Select>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <Button type="primary" size="large" className="margin-right primary-blue"  onClick={(e)=>handleSubmit()}>查询</Button>
        </Col>
      </Row>
</div>
      {/** 列表区域**/}
      <Table
        loading = { loading.effects['vehicleTime/query'] }
        dataSource = {list}
        rowSelection={rowSelection}
        scroll={{ x: '100%' }}
        columns={columns}
        pagination = {pagination}
        onChange={onChangeTable}
        rowKey='id'
        className="searchwrap"
      />
      {AddModelVisible && <AddModel {...modalPropsadd} />}
      {modalVisible && <PlanModal {...modalProps} />}
    </div>
  )

}

VehicleTime.propTypes = {
  dispatch: PropTypes.func,
  vehicleTime: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ vehicleTime, loading }) => ({ vehicleTime, loading }))(Form.create()(VehicleTime))
