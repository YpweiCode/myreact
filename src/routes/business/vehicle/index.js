import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { connect } from 'dva'
import { Form, Row, Col, Button, Table, Input,Select,Popconfirm, DatePicker,Icon} from 'antd'
import { Page } from 'components'
import Modal from './Modal'

const { RangePicker } = DatePicker;
const Option = Select.Option;


const Vehicle = ({ dispatch, vehiclees, loading, form: {
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
  const ColPropsrow = {
    xs:24,
    sm: 24,
    style: {
      marginBottom: 16,
    },
  }
  const { list,modalVisible, pagination,modalType,currentItem,vehicleNo=[],carType,selectedRowKeys,selectedRows=[]} = vehiclees;

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record,index) => {
        return <p>{index+1}</p>
      },
    }, {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
    }, {
      title: '车型',
      dataIndex: 'carTypeName',
      key: 'carTypeName',
    }, {
      title: '通行证',
      dataIndex: 'passCard',
      key: 'passCard'
    }, {
      title: '司机',
      dataIndex: 'driver',
      key: 'driver',
    }, {
      title: '电话',
      dataIndex: 'driverPhone',
      key: 'driverPhone',
    }, {
      title: '说明',
      dataIndex: 'remark',
      key: 'remark',
    },{
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <a href = 'javascript:void(0);' className="primary-color" onClick = {e => editItem(record, e)}>编辑</a>
      },
    },
  ];

  const editItem = (item) => {
    dispatch({
      type: 'vehiclees/showModal',
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    });

    dispatch({
      type: 'vehiclees/thinkCarType',
      payload: {
        typeName: '',
      },
    })
  }

  const rowSelection = {
      selectedRowKeys,
      onChange: (keys,rows) => {
        dispatch({
          type: 'vehiclees/updateState',
          payload: {
            selectedRowKeys: keys,
            selectedRows: rows,
          },
        })
      }
  };

  const onAdd = () => {
    dispatch({
      type: 'vehiclees/showModal',
      payload: {
        modalType: 'create',
      },
    });
    dispatch({
      type: 'vehiclees/thinkCarType',
      payload: {
        typeName: '',
      },
    })
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'vehiclees/deleteBatch',
      payload: {
        id: selectedRowKeys.join(','),
      },
    })
    dispatch({
      type: 'vehiclees/updateState',
      payload: {
        selectedRows: [],
      },
    })
  };

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    carType:carType,
    maskClosable: false,
    width:630,
    confirmLoading: loading.effects['vehiclees/update'],
    title: `${modalType === 'create' ? '新增车辆' : '更新车辆'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `vehiclees/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'vehiclees/hideModal',
      })
    },
  }

  const handleSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'vehiclees/query', payload: {... values, ... pagination}});
    })
  }

  const onChangeTable = (pagination, filters, sorter) => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'vehiclees/query', payload: {... values, ... pagination}});
    })
  }

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
let options=null;
  if(vehicleNo&&vehicleNo.length){
     options = vehicleNo.map(d => <Option key={d.vehicleNo}>{d.vehicleNo}</Option>);
  }
  return (
    //<Page inner style={{background:'#fafafa'}}>
    <div className="searchboxbg">
      {/** 搜索区域**/}
      <Row gutter={24} className="searchbox" style={{ paddingLeft: 15}}>
        <Col {...ColProps}>
          <FilterItem label="车牌号">
            {getFieldDecorator('vehicleNo', { initialValue: '' })(
              <Select  showSearch style={{width: '100%'}} size="large"
                       placeholder="请输入车牌号" optionFilterProp="children"
                       filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {options}
              </Select>
            )}
          </FilterItem>
        </Col>

        <Col {...ColProps}>
          <FilterItem label="司机">
            {getFieldDecorator('driver', {initialValue: ''})(
              <Input style={{width: '100%'}} size="large" placeholder="请输入司机姓名"/>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps}>
          <FilterItem label="电话">
            {getFieldDecorator('driverPhone', {initialValue: ''})(
              <Input style={{width: '100%'}} size="large" placeholder="请输入电话号码"/>
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps} >
          <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSubmit}>查询</Button>
          <Button size="large" className="primary-white" onClick={handleReset}>重置</Button>
        </Col>
      </Row>
      <Row gutter={24}>
  <Col {...ColPropsrow} >
    <Button size="large" className="margin-right primary-green" onClick={onAdd}><Icon type="plus-circle-o"/>新增车辆</Button>
    <Popconfirm title={'确定删除所选条目吗？'} placement="right" onConfirm={handleDeleteItems}>
      <Button size="large" disabled={selectedRows.length==0} className={selectedRows.length==0?"primary-delete":"primary-white"}>删除</Button>
    </Popconfirm>
  </Col>
</Row>

      {/** 列表区域**/}
      <Table
        loading = { loading.effects['vehiclees/query'] }
        dataSource = {list}
        rowSelection={rowSelection}
        scroll={{ x: '100%' }}
        columns={columns}
        pagination = {pagination}
        onChange={onChangeTable}
        rowKey='id'
        className="searchwrap"
      />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )

}

Vehicle.propTypes = {
  dispatch: PropTypes.func,
  vehiclees: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  Select:PropTypes.object,
}

export default connect(({ vehiclees, loading }) => ({ vehiclees, loading }))(Form.create()(Vehicle))
