import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import moment from 'moment'
import { connect } from 'dva'
import { Form, Button, Select ,Row, Col, DatePicker, Input, Cascader, Switch ,Tabs} from 'antd'
import { Link } from 'dva/router'


const Search = Input.Search
const TabPane = Tabs.TabPane

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
  cargo,
  onAdd,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const {count} = cargo
  const handleSubmit = () => {
    let fields = getFieldsValue();
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

  const onChangeTab = (value) => {
    let fields = getFieldsValue();
    fields.status = value;
    onFilterChange(fields)
  }

  return (
    <Row gutter={24}>
      {getFieldDecorator('status', { initialValue: '0' })(
      <Tabs defaultActiveKey="0" onChange={onChangeTab}>
        <TabPane tab={"全部订单("+(count.total || 0) +")"} key="0"></TabPane>
        <TabPane tab={"无运输方案订单("+(count.wysfa || 0) +")"} key="1"></TabPane>
        <TabPane tab={"方案待确认订单("+(count.fadqr || 0) +")"} key="2"></TabPane>
        <TabPane tab={"方案已锁定订单("+(count.faysd || 0) +")"} key="3"></TabPane>
      </Tabs>
      )}
      <Col {...ColProps} xl={{ span: 3 }} md={{ span:6 }}>
        <FilterItem label="开始时间">
        {getFieldDecorator('startTime', { initialValue:null })(
          <DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} size="large"  />
        )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <FilterItem label="截止时间">
          {getFieldDecorator('endTime', { initialValue: null})(
            <DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} size="large"  />
          )}
        </FilterItem>

      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <div >
          <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
          <Button size="large" onClick={handleReset}>重置</Button>
        </div>

      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <Button size="large" type="ghost"><Link to="/cargo/newCargoList">新增</Link></Button>

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

// export default Form.create()(Filter)


export default connect(({ cargo, loading }) => ({ cargo, loading }))(Form.create()(Filter))
