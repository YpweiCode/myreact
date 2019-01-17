import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Modal } from 'antd'


class planModal extends Component {
  constructor(props) { // 初始化的工作放入到构造函数
    super(props); // 在 es6 中如果有父类，必须有 super 的调用用以初始化父类信息

    this.state = { // 初始 state 设置方式

    };
  }

  static propTypes = {
    // form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    // onOk: PropTypes.func,
  };

  componentDidMount() {
let LatLng = this.props.data

    let map = new AMap.Map('trunkMap', {
      resizeEnable: true,
      zoom:11,
      center: [116.40, 39.91]
    });

    //const startPot = mapLatLng[0];
    //const endPot = mapLatLng[1];

    AMap.plugin(["AMap.Driving"], function() {
      var drivingOption = {
        policy:AMap.DrivingPolicy.LEAST_TIME,
        map:map
      };
      var driving = new AMap.Driving(drivingOption); //构造驾车导航类
      //根据起终点坐标规划驾车路线
      for(let i=0;i<LatLng.length-1;i++){
        driving.search(LatLng[0],LatLng[LatLng.length-1],function(status,result){});
        }

    });

  };




  render() {
    const { item , onOk, ...modalProps} = this.props;


    const handleOk = () => {
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }

    //const baseData = item.baseData
    return (
      <Modal {...modalOpts}>
    {/**<p>车牌号: {baseData.vehicleNo}</p>
            <p>发车时间: {baseData.pickTime}</p>
            <p>车主公司名称:{baseData.concatName}</p>
            <p>司机: {baseData.companyName}</p>
            <p>联系电话: {baseData.telephone}</p>**/}
            <div id = 'trunkMap' style = {{width: '100%', border: '1px solid #eee', borderRadius: 2,  height: 350, margin:'5px 0px'}}></div>
      </Modal>
    )
  }
}



export default planModal
