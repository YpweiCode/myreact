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

const OperatingTimecar = ({ location, dispatch, operatingTimecar, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, mapodate,AddModelVisible,modalType, selectedRowKeys ,propobj,modalVisibleimg,imgArr,currentImg,modalVisibleimgdel,getparms} = operatingTimecar
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
          type: 'operatingTimecar/hideimgMap',
        })
      }else{
        dispatch({
          type: 'operatingTimecar/hideimgMap',
        })
        dispatch({
          type: 'operatingTimecar/updateState',
          payload:{
            currentImg:index
          }
        })
        dispatch({
          type: 'operatingTimecar/showimgMapdel',
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
        type: 'operatingTimecar/hideimgMapdel',
      })
      dispatch({
        type: 'operatingTimecar/showimgMap',
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
        type: 'operatingTimecar/hideMap',
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['operatingTimecar/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'operatingTimecar/query',
        payload: {
          ...getparms,
          current: page.current,
          pageSize: page.pageSize,
        },
      })

      //dispatch(routerRedux.push({
      //  pathname,
      //  query: {
      //    ...query,
      //    current: page.current,
      //    pageSize: page.pageSize,
      //    createTime:params.createTime || null,
      //  },
      //}))
    },
    showDetail (id) {
      dispatch(routerRedux.push({
        pathname: '/cargo/cargoDetail?'+id,
      }))
    },
    getimages (record) {
      dispatch({
        type: 'operatingTimecar/getreturnimg',
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
        type: 'operatingTimecar/getCargoStatus',
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
      dispatch({
        type: 'operatingTimecar/query',
        payload: {
            ...value,
            current: 1,
            pageSize,
        },
      })
      dispatch({
        type: 'operatingTimecar/updateState',
        payload: {
          getparms:value
        },
      })
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/operatingTimecar',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/operatingTimecar',
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

OperatingTimecar.propTypes = {
  operatingTimecar: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ operatingTimecar, loading }) => ({ operatingTimecar, loading }))(OperatingTimecar)
