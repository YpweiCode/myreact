import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem, Page } from 'components'
import { connect } from 'dva'
import { Form, Row, Col, Button, Table, Input, Cascader, DatePicker, Select } from 'antd'
import city from 'utils/city'
import Modal from './Modal'
import styles from '../.././app.less'

const Option = Select.Option

// const { RangePicker } = DatePicker


const Money = (
  { dispatch, money, loading,
    form: {
      getFieldDecorator,
      getFieldsValue,
      setFieldsValue,
      validateFieldsAndScroll,
    },
  }) => {
  const ColProps = {
    xs: 12,
    sm: 4,
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

  const { dataSource, pagination, modalVisible, modalType, currentItem } = money
  const nature = [
    {
      nature: " ",
      natureName: '全部',
    },
    {
      nature: 3,
      natureName: '承运商',
    },
    {
      nature: 4,
      natureName: '货主',
    },
  ]

  const natureOptions = nature.map(opt => <Option key={opt.nature}>{opt.natureName}</Option>);


  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: '',
      render: (text, record, index) => {
        return index + 1
      },
    },
    {
      title: '客户性质',
      dataIndex: 'natureName',
      key: 'natureName',
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '所属区域',
      dataIndex: 'areaName',
      key: 'areaName',
    },
    {
      title: '物流园区',
      dataIndex: 'parkAddress',
      key: 'parkAddress',
    },
    {
      title: '保证金额',
      dataIndex: 'safeMoney',
      key: 'safeMoney',
    },
    {
      title: '到账日期',
      dataIndex: 'gatheringDate',
      key: 'gatheringDate',
    },
    {
      title: '是否到账',
      dataIndex: 'safeMoneyEd',
      key: 'safeMoneyEd',
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        if (record.safeMoneyEd && record.safeMoneyEd === '否' ) {
          return <a href="javascript:void(0);" onClick={() => handleConfirmModal(record)}>确认到账</a>
        } else {
          return ''
        }
      },
    },
  ]

  const ModalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['money/confirm'],
    title: '确认到账',
    wrapClassName: 'money-center-modal',
    onOk (data) {
      dispatch({
        type: 'money/confirm',
        payload: { ...currentItem, ...data, ...pagination },
      })
    },
    onCancel () {
      dispatch({
        type: 'money/hideModal',
      })
    },
  }

  const handleConfirmModal = (record) => {
    dispatch({
      type: 'money/update',
      payload: {
        id: record,
        modalType: 'confirm',
        // currentItem: record,
      },
    })
  }

  const handleSearch = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }

      let fields = getFieldsValue();

      for (let key in fields) {
        if (key == 'city') {
          if (fields.city) {
            let cityList = Object.assign([],fields.city);
            delete fields.city;
            let names = ['province', 'city', 'area'];
            cityList.forEach((item,index) => {
              fields[names[index]] = item;
            })
          }
        }

        if (!fields[key]) delete fields[key];

      }

      dispatch({ type: 'money/findPage', payload: { ...fields, ...pagination  } })
    })
  }

  const onChangeTable = (pagination, filters, sorter) => {

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'money/findPage', payload: { ...values, ...pagination } })
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
    handleSearch()
  }

  return (
    <div>
  {/** 搜索区域 */}
      <Row gutter={24} className="searchbox" style={{paddingLeft:15}}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <FilterItem label="所在区域">
            {getFieldDecorator('city', { initialValue: [] })(
              <Cascader
                size="large"
                style={{ width: '100%' }}
                options={city}
                placeholder="选择城市"
                className="inputBox"
              />)}
          </FilterItem>
        </Col>
        <Col {...SmColProps} xl={{ span: 4 }} md={{ span:6 }}>
          <FilterItem label="客户性质">
            {getFieldDecorator('nature')(
              <Select className="inputBox" showSearch style={{width: '100%'}}  placeholder="选择客户性质" size="large"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{natureOptions}</Select>
            )}
          </FilterItem>
        </Col>
        <Col {...SmColProps} xl={{ span: 4 }} md={{ span:6 }}>
          <FilterItem label="客户名称" >
            {getFieldDecorator('name', { initialValue: '' })(
              <Input placeholder="客户名称" className="inputBox" maxLength="15" style={{ width: '100%' }} size="large" />
            )}
          </FilterItem>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <FilterItem label="手机号">
            {getFieldDecorator('telephone',
              {
                initialValue: '',
                rules: [
                  {
                    pattern: /^1[34578]\d{9}$/,
                    message: '请输入有效手机号'
                  },
                ] })(<Input placeholder="手机号"  className="inputBox"  maxLength="11" style={{ width: '100%' }} size="large" />
            )}

          </FilterItem>
        </Col>
        <Col {...SmColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSearch}>查询</Button>
          {/* <Button size="large" onClick={handleReset}>重置</Button> */}
        </Col>
      </Row>
      {/** 列表区域 */}
      <Table
        loading={loading.effects['money/findPage']}
        dataSource={dataSource}
        scroll={{ x: '100%' }}
        columns={columns}
        pagination={pagination}
        onChange={onChangeTable}
        rowKey="id"
        className="searchwrap"
      />
      {modalVisible && <Modal {...ModalProps} />}
    </div>
  )
}

Money.propTypes = {
  dispatch: PropTypes.func,
  money: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ money, loading }) => ({ money, loading }))(Form.create()(Money))
