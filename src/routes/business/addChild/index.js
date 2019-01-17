import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm,Icon } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import AddModal from './addsModel'
import Cookies from 'utils/cookie'

let params = {};
const AddChild = ({ location, dispatch, addChild, loading }) => {
  location.query = queryString.parse(location.search)

  const { list, pagination, currentItem, addmodalVisible,modalVisible, modalType, selectedRowKeys } = addChild
  const { pageSize } = pagination
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    userType:Cookies.get("roleType"),
    confirmLoading: loading.effects['addChild/update'],
    title: `${modalType === 'create' ? '创建用户' : '更新用户'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `addChild/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'addChild/hideModal',
      })
    },
  }
  const addmodalProps = {
    item: 'create',
    visible: addmodalVisible,
    maskClosable: false,
    width:"800px",
    style:{minWidth:"8"},
    userType:Cookies.get("roleType"),
    confirmLoading: loading.effects['addChild/update'],
    title: `创建用户`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `addChild/${modalType}`,
        payload: data,
      })
      dispatch({
        type: 'addChild/hideAddModal',
      })
    },
    onCancel () {
      dispatch({
        type: 'addChild/hideAddModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['addChild/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          current:page.current,
          pageSize: page.pageSize,
          parkAddress:params.parkAddress || '',
          province:params.province || '',
          city:params.city || '',
          area:params.area || ''
        },
      }))
    },

    onDeleteItem (id) {
      dispatch({
        type: 'addChild/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'addChild/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    //rowSelection: {
    //  selectedRowKeys,
    //  onChange: (keys) => {
    //    dispatch({
    //      type: 'addChild/updateState',
    //      payload: {
    //        selectedRowKeys: keys,
    //      },
    //    })
    //  },
    //},
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      params = value;
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
        pathname: '/addChild',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/addChild',
      }))
    },
    onAdd () {
      dispatch({
        type: 'addChild/showAddModal',
        payload: {},
      })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'addChild/multiDelete',
      payload: {
        ids: selectedRowKeys.join(',')
      },
    })
  }

  return (
    <div>
      <Row className="">
        <Filter {...filterProps} />
      </Row>
      <Row className="searchwrap">
      <List {...listProps} />
      </Row>
      {modalVisible && <Modal {...modalProps} />}
      {addmodalVisible && <AddModal {...addmodalProps} />}
    </div>
    // <div className="searchboxbg">
    //   <Filter {...filterProps} />
    //   <List {...listProps} />
    //   {modalVisible && <Modal {...modalProps} />}
    //   {addmodalVisible && <AddModal {...addmodalProps} />}
    // </div>
  )
}


AddChild.propTypes = {
  addChild: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ addChild, loading }) => ({ addChild, loading }))(AddChild)
