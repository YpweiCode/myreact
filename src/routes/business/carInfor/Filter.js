import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Select ,Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'
import city from 'utils/city'

const Search = Input.Search

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onAdd,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {

  const handleSubmit = () => {
    let fields = getFieldsValue();
    if(fields.city){
      let cityList = Object.assign([],fields.city);
      delete fields.city;
      let names = ['province', 'city', 'area'];
      cityList.forEach((item,index) => {
        fields[names[index]] = item;
      })
    }
    fields.pageSize = 10;
    onFilterChange(fields)
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


  const { address } = filter
  const arr=[1,2,3,4,5,6]
  const listItems = arr.map((number) =>
      <option key={number.toString()}>{number}</option>
  );
  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span:6 }}>
        <FilterItem label="车牌号">
        {getFieldDecorator('driver', { initialValue: address })(
            //<Input style={{ width: '100%' }} size="large"  />
            <Select

                showSearch
                style={{ width:150 }}
                placeholder="Select a person"
                //optionFilterProp="children"
                //onChange={handleChange}
                //onFocus={handleFocus}
                //onBlur={handleBlur}
                //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listItems}
            </Select
                >
            //, mountNode
        )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <FilterItem label="所在物流园">
          {getFieldDecorator('parkAddress', { initialValue: '' })(
            <Input style={{ width: '100%' }} size="large"  />
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 6}} sm={{ span: 12 }}>
        <FilterItem label="电话">
          {getFieldDecorator('driverPhone', { initialValue: '' })(
              <Input style={{ width: '100%' }} size="large"  />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          <div>
            <Button size="large" type="ghost" onClick={onAdd}>新增</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
