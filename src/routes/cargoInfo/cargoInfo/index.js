import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
// import Modal from './Modal'
import PlanModal from './PlanModal'

var params = {};

const Cargo = ({ location, dispatch, cargo, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys,count,routerDetail } = cargo
  const { pageSize } = pagination

  const modalProps = {
    item: routerDetail,
    visible: modalVisible,
    maskClosable: true,
    // confirmLoading: loading.effects['cargo/update'],
    title: '匹配方案',
    wrapClassName: 'vertical-center-modal',

    onCancel () {
      dispatch({
        type: 'cargo/hideModal',
      })
    },
    footer: null
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['cargo/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          current: page.current,
          pageSize: page.pageSize,
          status:params.status || null,
          startTime:params.startTime ||null,
          endTime:params.endTime || null
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'cargo/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'cargo/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onShowPlanModal (cargo) {
      dispatch({
        type: 'cargo/getMap',
        payload: {
          modalType: 'showPlan',
          currentItem: cargo
        }
      })
    },

    /*rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'cargo/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },*/
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      params = value,
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          current: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/cargo',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/cargo',
      }))
    },
    onAdd () {
      dispatch({
        type: 'cargo/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'cargo/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      {/*{
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'确定删除所选条目吗？'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      }*/}
      <List {...listProps} />

      {modalVisible && <PlanModal {...modalProps} />}
    </Page>
  )
}

Cargo.propTypes = {
  cargo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ cargo, loading }) => ({ cargo, loading }))(Cargo)
