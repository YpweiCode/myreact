import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Input, InputNumber, Radio,Select, Modal, Table, Dropdown, Badge } from 'antd'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},cargos = [],
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        billId: item.id,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const columns = [
    { title: '货品名称', dataIndex: 'cargoName', key: 'cargoName' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '体积', dataIndex: 'volume', key: 'volume' },
    { title: '提货地址', dataIndex: 'pickAddress', key: 'pickAddress' },
    { title: '提货联系人', dataIndex: 'picker', key: 'picker' },
    { title: '提货联系电话', dataIndex: 'pickPhone', key: 'pickPhone' },
    { title: '收货地址', dataIndex: 'sendAddress', key: 'sendAddress' },
    { title: '收货联系人', dataIndex: 'sender', key: 'sender' },
    { title: '收货联系电话', dataIndex: 'sendPhone', key: 'sendPhone' },
  ];

  return (
    <Modal {...modalOpts}>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        dataSource={cargos}
        pagination={false}
      />
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  cargos: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
