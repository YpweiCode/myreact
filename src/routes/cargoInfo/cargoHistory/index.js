import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import History from './PlanModal'
import ImgModel from './imgModel'
import ImgDeal from './dealImg'
import Filter from './Filter'



var params = {createTime:new Date()};

const CargoHistory = ({ location, dispatch, cargoHistory, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, mapodate,AddModelVisible,modalType, selectedRowKeys ,propobj,modalVisibleimg,imgArr,currentImg,modalVisibleimgdel} = cargoHistory
  const { pageSize } = pagination

  const modalProps = {
    visible: modalVisible,
    maskClosable: true,
    title: '匹配方案',
    wrapClassName: 'vertical-center-modal',
    footer: null
  }
  const modalPropsimg = {
    visible: modalVisibleimg,
    maskClosable: true,
    title: '电子回单信息',
    wrapClassName: 'vertical-center-modal',
    width:imgArr.length>1?450:250,
    footer: null,
    onCancel (index) {
      if(isNaN(index)){
        dispatch({
          type: 'cargoHistory/hideimgMap',
        })
      }else{
        dispatch({
          type: 'cargoHistory/hideimgMap',
        })
        dispatch({
          type: 'cargoHistory/updateState',
          payload:{
            currentImg:index
          }
        })
        dispatch({
          type: 'cargoHistory/showimgMapdel',
        })
      }

    },

  }
  const modalPropsimgdel = {
    visible: modalVisibleimgdel,
    maskClosable: true,
    title: '电子回单信息',
    wrapClassName: 'vertical-center-modal',
    width:770,
    footer: null,
    onCancel () {
      dispatch({
        type: 'cargoHistory/hideimgMapdel',
      })
      dispatch({
        type: 'cargoHistory/showimgMap',
      })
    },

  }
  const modalPropsadd = {
    visible: AddModelVisible,
    maskClosable: false,
    title: `历史轨迹`,
    footer:null,
    width:"960px",
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cargoHistory/hideMap',
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['cargoHistory/query'],
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
          createTime:params.createTime || null,
        },
      }))
    },
    showDetail (id) {
      dispatch(routerRedux.push({
        pathname: '/cargo/cargoDetail?'+id,
      }))
    },
    getimages (record) {
      dispatch({
        type: 'cargoHistory/getreturnimg',
        payload: {
          orderCode: record,
        },
      })
    },
    showAdd (id) {
      dispatch(routerRedux.push({
        pathname: '/cargo/newCargoList?'+id,
      }))
    },
    showMaps (record) {
      dispatch({
        type: 'cargoHistory/getCargoStatus',
        payload: {
          orderCode: record,
        },
      })
    },
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
        pathname: '/cargoHistory',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/cargoHistory',
      }))
    },
  }

  return (
    <div>
      <Row className="searchbox" style={{ paddingLeft: 25}}>
        <Filter {...filterProps} />
      </Row>
      <Row className="searchwrap">
        <List {...listProps} />
      </Row>
      {modalVisible && <PlanModal {...modalProps} />}
      {modalVisibleimg && <ImgModel {...modalPropsimg} imgArr={imgArr} />}
      {AddModelVisible && <History {...modalPropsadd} propobj={propobj} data={mapodate}/>}
      {modalVisibleimgdel && <ImgDeal {...modalPropsimgdel} imgArr={imgArr} currentImg={currentImg} />}
    </div>
    // <Page inner>
    //   <Filter {...filterProps} />
    //   <List {...listProps} />
    //   {modalVisible && <PlanModal {...modalProps} />}
    //   {AddModelVisible && <History {...modalPropsadd} propobj={propobj} data={mapodate}/>}
    // </Page>
  )
}

CargoHistory.propTypes = {
  cargoHistory: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ cargoHistory, loading }) => ({ cargoHistory, loading }))(CargoHistory)
