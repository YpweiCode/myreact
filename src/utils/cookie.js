
  const Cookies = {
    set: function (name, value, iDay){
      /* iDay 表示过期时间 */
      var oDate=new Date();
      oDate.setDate(oDate.getDate()+iDay);
      document.cookie=name+'='+value+';expires='+oDate + "; path=/";
    },
    get: function (name){
      /* 获取浏览器所有cookie将其拆分成数组 */
      var arr=document.cookie.split('; ');

      for(var i=0;i<arr.length;i++)    {
        /* 将cookie名称和值拆分进行判断 */
        var arr2=arr[i].split('=');
        if(arr2[0]==name){
          return arr2[1];
        }
      }
      return '';
    },
    remove: function(key) {
      this.set(key, '', -1);
    },

  }

module.exports = Cookies;
