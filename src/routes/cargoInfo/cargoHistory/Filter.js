import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import moment from 'moment';
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
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {
  const handleSubmit = () => {
    let fields = getFieldsValue();
    fields.pageSize = 10;
    onFilterChange(fields)
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span:6 }} className="searchFont">
        <FilterItem label="发布日期">
        {getFieldDecorator('createTime', { initialValue:moment(new Date(), 'YYYY-MM-DD')})(
          <DatePicker className="inputBox" format={'YYYY-MM-DD'} style={{ width: '100%' }} size="large"  />
        )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 6 }} sm={{ span: 12 }}>
        <div >
          <Button type="primary" size="large" className="margin-right primary-blue" onClick={handleSubmit}>搜索</Button>
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


// export default connect(({ cargo, loading }) => ({ cargo, loading }))(Form.create()(Filter))
