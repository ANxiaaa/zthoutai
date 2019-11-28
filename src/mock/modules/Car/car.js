// 全部品牌
let brandData = {
    "status": 0,
    "msg": "ok",
    "result": [
        {
            "id": "1",
            "name": "奥迪",
            "initial": "A",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/1.png",
            "depth": "1"
        },
        {
            "id": "2",
            "name": "阿斯顿·马丁",
            "initial": "A",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/2.png",
            "depth": "1"
        },
        {
            "id": "3",
            "name": "阿尔法·罗密欧",
            "initial": "A",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/3.png",
            "depth": "1"
        },
        {
            "id": "4",
            "name": "AC Schnitzer",
            "initial": "A",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/4.png",
            "depth": "1"
        },
        {
            "id": "5",
            "name": "Artega",
            "initial": "A",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/5.png",
            "depth": "1"
        },
        {
            "id": "6",
            "name": "奥克斯",
            "initial": "A",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/6.png",
            "depth": "1"
        },
        {
            "id": "7",
            "name": "本田",
            "initial": "B",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/7.png",
            "depth": "1"
        },
        {
            "id": "205",
            "name": "云雀",
            "initial": "Y",
            "parentid": "0",
            "logo": "http://api.jisuapi.com/car/static/images/logo/300/205.png",
            "depth": "1"
        }
    ]
}
export function findList() {
    return {
        url: 'carList/findList',
        type: 'get',
        data: {
            "code": 200,
            "msg": null,
            data: brandData
        }
    }
}
// 根据品牌获取车型
let arcticData = {
    "status": 0,
    "msg": "ok",
    "result": [
        {
            "id": "219",
            "name": "一汽奥迪",
            "fullname": "",
            "initial": "A",
            "list": [
                {
                    "id": "220",
                    "name": "A3",
                    "fullname": "奥迪A3",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/220.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "221",
                    "name": "A4L",
                    "fullname": "奥迪A4L",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/221.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "222",
                    "name": "A6L",
                    "fullname": "奥迪A6L",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/222.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "223",
                    "name": "Q3",
                    "fullname": "奥迪Q3",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/223.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "224",
                    "name": "Q5",
                    "fullname": "奥迪Q5",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/224.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "225",
                    "name": "A4",
                    "fullname": "奥迪A4",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/225.jpg",
                    "salestate": "停销",
                    "depth": "3"
                },
                {
                    "id": "226",
                    "name": "100",
                    "fullname": "奥迪100",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/226.jpg",
                    "salestate": "停销",
                    "depth": "3"
                },
                {
                    "id": "227",
                    "name": "200",
                    "fullname": "奥迪200",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/227.jpg",
                    "salestate": "停销",
                    "depth": "3"
                }
            ]
        },
        {
            "id": "228",
            "name": "进口奥迪",
            "fullname": "",
            "initial": "A",
            "list": [
                {
                    "id": "229",
                    "name": "A1",
                    "fullname": "奥迪A1(进口)",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/229.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "230",
                    "name": "A3",
                    "fullname": "奥迪A3(进口)",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/230.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "231",
                    "name": "A3 e-tron",
                    "fullname": "A3 e-tron",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/231.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "232",
                    "name": "A4",
                    "fullname": "奥迪A4(进口)",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/232.jpg",
                    "salestate": "待销",
                    "depth": "3"
                },
                {
                    "id": "233",
                    "name": "A4 allroad",
                    "fullname": "奥迪A4 allroad",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/233.jpg",
                    "salestate": "在销",
                    "depth": "3"
                },
                {
                    "id": "234",
                    "name": "A5",
                    "fullname": "奥迪A5(进口)",
                    "logo": "http://api.jisuapi.com/car/static/images/logo/300/234.jpg",
                    "salestate": "在销",
                    "depth": "3"
                }
            ]
        }
    ]
}
export function findArctic() {
    return {
        url: 'carList/findArctic',
        type: 'get',
        data: {
            "code": 200,
            "msg": null,
            data: arcticData
        }
    }
}
// 根据车型获取车
let vehicleData = {
    "status": 0,
    "msg": "ok",
    "result": {
        "id": "220",
        "name": "A3",
        "initial": "A",
        "fullname": "奥迪A3",
        "logo": "http://api.jisuapi.com/car/static/images/logo/300/220.jpg",
        "salestate": "在销",
        "depth": "3",
        "list": [
            {
                "id": "2571",
                "name": "2016款 Sportback 35TFSI 进取型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2571.jpg",
                "price": "18.49万",
                "yeartype": "2016",
                "productionstate": "在产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2572",
                "name": "2016款 Limousine 35TFSI 进取型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2572.jpg",
                "price": "19.09万",
                "yeartype": "2016",
                "productionstate": "在产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2573",
                "name": "2016款 Sportback 35TFSI 领英型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2573.jpg",
                "price": "20.92万",
                "yeartype": "2016",
                "productionstate": "在产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2574",
                "name": "2016款 Limousine 35TFSI 领英型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2574.jpg",
                "price": "21.52万",
                "yeartype": "2016",
                "productionstate": "在产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2575",
                "name": "2016款 Sportback 35TFSI 风尚型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2575.jpg",
                "price": "22.59万",
                "yeartype": "2016",
                "productionstate": "在产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2576",
                "name": "2016款 Limousine 35TFSI 风尚型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2576.jpg",
                "price": "23.19万",
                "yeartype": "2016",
                "productionstate": "在产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2577",
                "name": "2015款 Sportback 35TFSI 手动 进取型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2577.jpg",
                "price": "18.49万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2578",
                "name": "2015款 Limousine 35TFSI 手动 进取型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2578.jpg",
                "price": "19.09万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2579",
                "name": "2015款 Sportback 35 TFSI 纪念智领版",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2579.jpg",
                "price": "22.79万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2580",
                "name": "2015款 Limousine 35 TFSI 纪念智领版",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2580.jpg",
                "price": "23.39万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2581",
                "name": "2015款 Sportback 35 TFSI 纪念舒享版",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2581.jpg",
                "price": "23.98万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2582",
                "name": "2015款 Limousine 35 TFSI 纪念舒享版",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2582.jpg",
                "price": "24.58万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2583",
                "name": "2015款 Sportback 35 TFSI 纪念乐享版",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2583.jpg",
                "price": "27.57万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2584",
                "name": "2015款 Limousine 35 TFSI 纪念乐享版",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2584.jpg",
                "price": "28.17万",
                "yeartype": "2015",
                "productionstate": "停产",
                "salestate": "在销",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2585",
                "name": "2014款 Sportback 35TFSI 进取型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2585.jpg",
                "price": "19.99万",
                "yeartype": "2014",
                "productionstate": "停产",
                "salestate": "停产",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2586",
                "name": "2014款 Limousine 35TFSI 进取型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2586.jpg",
                "price": "20.59万",
                "yeartype": "2014",
                "productionstate": "停产",
                "salestate": "停产",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2587",
                "name": "2014款 Sportback 35TFSI 时尚型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2587.jpg",
                "price": "21.89万",
                "yeartype": "2014",
                "productionstate": "停产",
                "salestate": "停产",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2588",
                "name": "2014款 Limousine 35TFSI 时尚型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2588.jpg",
                "price": "22.49万",
                "yeartype": "2014",
                "productionstate": "停产",
                "salestate": "停产",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2589",
                "name": "2014款 Sportback 35TFSI 舒适型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2589.jpg",
                "price": "24.88万",
                "yeartype": "2014",
                "productionstate": "停产",
                "salestate": "停产",
                "sizetype": "紧凑型车"
            },
            {
                "id": "2590",
                "name": "2014款 Limousine 35TFSI 舒适型",
                "logo": "http://api.jisuapi.com/car/static/images/logo/300/2590.jpg",
                "price": "25.48万",
                "yeartype": "2014",
                "productionstate": "停产",
                "salestate": "停产",
                "sizetype": "紧凑型车"
            }
        ]
    }
}
export function findVehicle() {
    return {
        url: 'carList/findVehicle',
        type: 'get',
        data: {
            "code": 200,
            "msg": null,
            data: vehicleData
        }
    }
}

// 获取分页手机用户
let userInfoData = {
    pageNum: 1,
    pageSize: 30,
    totalPages: 3,
    totalSize: 400,
    content:[{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    },{
        phone: '19933330000',
        account: 'abc123' + Math.random(),
        password: '123456',
        nickName: 'aaa',
        authentication: '是',
        referralCode: '15645das1d4a5',
        createDate: '2019-04-22T06:54:01.000+0000',
        lastLoginDate: '2019-04-22T06:54:01.000+0000',
        defaultCarInfoId: 123,
        source: '微信'
    }]
}
userInfoData.content.forEach((i,index) => {
    i.id = index
});
export function userInfoData() {
    return {
        url: 'carList/userInfoData',
        type: 'get',
        data: {
            "code": 200,
            "msg": null,
            data: userInfoData
        }
    }
}
// 按用户id查用户所有信息
let userData = {
    
    phone: '19933330000',
    account: 'abc123' + Math.random(),
    password: '123456',
    nickName: 'aaa',
    authentication: '是',
    referralCode: '15645das1d4a5',
    createDate: '2019-04-22T06:54:01.000+0000',
    lastLoginDate: '2019-04-22T06:54:01.000+0000',
    defaultCarInfoId: 123,
    source: '微信'
}
export function userData() {
    return {
        url: 'carList/userData',
        type: 'get',
        data: {
            "code": 200,
            "msg": null,
            data: userData
        }
    }
}