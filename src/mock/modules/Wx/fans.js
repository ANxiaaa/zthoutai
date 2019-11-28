let userdata = [{
  name: '所有粉丝',
  id:1,
  children: [
    {name: '未分组',id:2},
    {name: '开发人员',id:3},
    {name: '啊啊人员',id:4},
    {name: '哦哦人员',id:5},
    {name: '额额人员',id:6},
    {name: '意义人员',id:7},
    {name: '五五人员',id:8},
    {name: '公司员工',id:9},
    {name: '六六人员',id:10},
    {name: '六六人员',id:11},
    {name: '六六人员',id:12},
    {name: '六六人员',id:13},
    {name: '六六人员',id:14},
    {name: '六六人员',id:15},
    {name: '六六人员',id:16},
    {name: '六六人员',id:17},
    {name: '六六人员',id:18},
    {name: '六人员',id:19},
    {name: '六六人员',id:20},
    {name: '六六人员',id:21},
  ]
}]
export function sorter() {
  let data=userdata;
  return {
    url: 'wxfans/sorter',
    type: 'get',
    data: {
      "code": 200,
      "msg": null,
      data
    }
  }
}


//声明假数据
let adata = [];
(function(){
  for(let i = 0;i < 25;i ++){
    adata.push({
      'id': i,
      'name': '用户' + Math.ceil((Math.random() * 10)),
      'city': '郑州',
      'pic': 'http://thirdwx.qlogo.cn/mmopen/PiajxSqBRaEKRgUG4BaA3Rsib6fibP4JjIibukgRLL4aR5MShoicuSwniaYOfM6Zic9Y0ba7k2Y1h1yYbdLTLes8JOmqg/132',
      'time':'2019-04-22T06:54:01.000+0000',
      'parentID': 1,
      'parentName': '全部粉丝',
      'mark':'啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
    })
  }
})();
let resultPage = {
  pageNum:1,
  pageSize:10,
  totalSize:adata.length
};
resultPage.totalPages = Math.ceil(adata.length / resultPage.pageSize);
export function findFans(data) {
  /*
  {parentID: 1,pageNum: 1,pageSize: 10}
  */
  let content = []
  let b = 0;
  for(let i = b;i < b + resultPage.pageSize;i ++){
    content.push(adata[i])
  }
  resultPage.content = content;
    return {
    url: 'wxfans/findFans',
    type: 'post',
    data: {
      "code": 200,
      "msg": null,
      data:resultPage
    }
  }
}

/////////////////////////////////////////////////////////////////
export function findTempData(data) {
  let tempData = [
    {num: 'asdaa456gadfsads2222', title: '1支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 1},
    {num: 'asdgadfgagsdg2123222', title: '2支付成功通知', first:'7IT科技', second: 'IT软件与服务', type: 1},
    {num: 'asdaagsd5g1523d2ag22', title: '3支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 2},
    {num: 'agd5g486ad5g1sfsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 2},
    {num: 'asdag5d6s4222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 3},
    {num: 'agsadgasdgdfsads2222', title: '5支付成功通知', first:'6IT科技', second: 'IT软件与服务', type: 1},
    {num: 'agsadgasdgdfsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 2},
    {num: 'agsadgasdgdfsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 6},
    {num: 'agsadgasdgdfsads2222', title: '6支付成功通知', first:'5IT科技', second: 'IT软件与服务', type: 7},
    {num: 'agsadgasdgdfsads2222', title: '支付成功通知', first:'8IT科技', second: 'IT软件与服务', type: 4},
    {num: 'agsadgasdgdfsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 6},
    {num: 'agsadgasdgdfsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 7},
    {num: 'agsadgasdgdfsads2222', title: '支付成功通知', first:'4IT科技', second: 'IT软件与服务', type: 8},
    {num: 'asdaa456gaddsa5g1sa3dg', title: '支付成功通知', first:'1IT科技', second: 'IT软件与服务', type: 4},
    {num: 'asdga53d1g2asads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 7},
    {num: 'asddagsd312gsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 6},
    {num: 'gds2a12gdsgs6gadfsads2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 8},
    {num: 'aafdsa12f3sdfss2222', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 1},
    {num: 'asdadfasd41fs2dfff2', title: '支付成功通知', first:'IT科技', second: 'IT软件与服务', type: 2},
  ]
  tempData.forEach((i, index)=>{
    i.content = 'fasfasfasfag噶都是房改房阿萨德阿发沙发上发送啊fasfasfasfaf';
    i.id = index
  })
  return {
    url: 'wxtemp/findTempData',
    type: 'get',
    data: {
      "code": 200,
      "msg": null,
      data:tempData
    }
  }
}