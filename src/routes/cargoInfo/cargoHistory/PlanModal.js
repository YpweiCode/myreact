import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Modal,Timeline } from 'antd'


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
    let map = new AMap.Map('trunkMap', {
      resizeEnable: true,
      zoom:13,
      center: [116.40, 39.91]
    });
    let LatLng=this.props.propobj.lnglat
    new AMap.Marker({
      map: map,
      position: LatLng[0],
      icon: new AMap.Icon({
        size: new AMap.Size(40, 50),  //图标大小
        image: "http://webapi.amap.com/theme/v1.3/markers/n/start.png",
        imageOffset: new AMap.Pixel(0, 0)
      })
    });
    new AMap.Marker({
      map: map,
      position: LatLng[LatLng.length-1],
      icon: new AMap.Icon({
        size: new AMap.Size(40, 50),  //图标大小
        image: "http://webapi.amap.com/theme/v1.3/markers/n/end.png",
        imageOffset: new AMap.Pixel(0, 0)
      })
    });
    AMap.plugin(["AMap.Driving"], function() {
      let drivingOption = {
        policy:AMap.DrivingPolicy.LEAST_DISTANCE,
        hideMarkers:true,
        showTraffic:false
      };
      let lineArr=[]
      for(let i=0;i<LatLng.length-1;i++){
        var driving = new AMap.Driving(drivingOption); //构造驾车导航类
        driving.search(LatLng[i],LatLng[i+1],function(status,result){
          for(let j=0;j<result.routes[0].steps.length;j++){
            for(let m=0;m<result.routes[0].steps[j].path.length;m++){
              let arrobj=[result.routes[0].steps[j].path[m].lng,result.routes[0].steps[j].path[m].lat]
              lineArr.push(arrobj)
            }
          }

          if(i==LatLng.length-2){
            new AMap.Polyline({
              map:map,
              path:lineArr,
              strokeColor: "#3366FF", //线颜色
              strokeOpacity: 1,       //线透明度
              strokeWeight: 5,        //线宽
              strokeStyle: "solid",   //线样式
              strokeDasharray: [10, 5] //补充线样式
            })
          }
        });
      }


      //var driving = new AMap.Driving(drivingOption); //构造驾车导航类
      //  driving.search(LatLng[0],LatLng[LatLng.length-1],arr,function(status,result){});

    });
    map.setFitView();
  };
  render() {
    const { item , onOk, ...modalProps} = this.props;
    let timearr=this.props.propobj.list
    let timeobj=timearr.map((item ,index)=>{
      return (<Timeline.Item key={index}>{item}</Timeline.Item>)
    })
    const handleOk = () => {
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }
    return (
      <Modal {...modalOpts}>
        <div style = {{float:"left",width: '10%',marginTop:10}}>
          <Timeline>
            {timeobj}
          </Timeline>
        </div>
        <div id = 'trunkMap' style = {{float:"left",width: '90%', border: '1px solid #eee', borderRadius: 2,  height: 350, margin:'5px 0px'}}></div>
      </Modal>
    )
  }
}



export default planModal
