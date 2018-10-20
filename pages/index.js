
import { Component } from 'react'
import Head from 'next/head'
import Game from '../src/game'
import $ from  'jquery'

export default class extends Component {

    componentDidMount() {
        // Client-side
        if(typeof window !== 'undefined') {

            window.requestAnimFrame = window.requestAnimationFrame 
                || window.webkitRequestAnimationFrame 
                || window.mozRequestAnimationFrame 
                || window.oRequestAnimationFrame 
                || window.msRequestAnimationFrame 
                || function(requestID) {
                    window.setTimeout(requestID, 1000 / 60);
                };

            window.cancelAnimationFrame = window.cancelAnimationFrame
                || window.mozCancelAnimationFrame
                || function(requestID){clearTimeout(requestID)};
                 
            
            const game = new Game(this.canvas)
        }

//授权事宜-----------------
        //获取URL参数
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if ( r != null ){
                return decodeURI(r[2]);
            }else{
                return null;
            }
        }


        var userData;
        var dataInfo={};
        function ouathinit() {
        //首先判断用户数据cookie是否存在
        var userInf = localStorage.getItem('data');
        if(userInf!=null && userInf!=""){
            userData = userInf;
        }else {
            //判断是否有带好友openid参数
            var Fopenid = getQueryString('Fopenid')
            if(Fopenid){
                var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("http://localhost:3000/?Fopenid="+Fopenid);
                //var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("http://guerlain.wcampaign.cn?Fopenid="+Fopenid);
                window.location.href = oAtuhUrl;
            }else {
                var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("http://localhost:3000/")
                //var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("http://guerlain.wcampaign.cn")
                window.location.href = oAtuhUrl;
            }
        }

        if(getQueryString('data')){
            var user = atob(getQueryString('data'));
            localStorage.setItem('data',user); // cookie过期时间为30天。
            userData = user;
            userData = JSON.parse(userData);
            $.ajax({
                url:'https://guerlain.wechat.wcampaign.cn/user/add',
                type:'POST',
                data:{
                    from_openid:getQueryString('Fopenid'),
                    openid:userData.original.openid,
                    nickname:userData.original.nickname,
                    headimgurl:userData.original.headimgurl
                },
                success:function (data) {
                    console.log(data);
                }
            })
        }else{
            if(userInf){
                userData = JSON.parse(userData);
            }
        }

    }
        ouathinit();
        console.log(userData);
        




    //结束-----------------


        //点击排行榜
        $(".rank,.rank2").click(function(){
            $(".mask").fadeIn(500);
            $(".rankBox").fadeIn(500);
            $.ajax({
                url:'https://guerlain.wechat.wcampaign.cn/user/getlist',
                type:'POST',
                dataType: "json",
                success:function (data) {
                    console.log(data);
                    $(".rankList").html("");
                    var liveScore = sessionStorage.getItem('liveScore');
                    if(liveScore){
                        $(".myScore").html('我的当前分数：' + liveScore);
                    }else{
                        $(".myScore").html('我的当前分数：0');
                    }
                    
                    for(var i=0;i<data.length;i++){
                        var oDov = $("<p><span className='listName'>"+data[i].nickname+":</span><span className='listScore'>"+data[i].score+"</span></p>")
                        $(".rankList").append(oDov);
                    }
                }
            })
        })

        //一开始展现好友分数
        var userInfI = localStorage.getItem('data');
        if(userInfI){
            $.ajax({
                url:'https://guerlain.wechat.wcampaign.cn/user/getfriendlist',
                type:'POST',
                data:{openid:userData.original.openid},
                dataType: "json",
                success:function (data) {
                    console.log(data);
                    $(".frendScore").html("");
                    for(var i=0;i<data.length;i++){
                        var oDov = $("<p><span className='listName'>"+data[i].nickname+":</span><span className='listScore'>"+data[i].score+"</span></p>")
                        $(".frendScore").append(oDov);
                    }
                }
            })
        }
        

        //点击遮罩消失
        $(".mask,.off").click(function(){
            $(".mask").fadeOut(500);
            $(".rankBox").fadeOut(500);
        })

        // const publickey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6KzAVhTxDl/6EUTtCbtRFOPKA4/WOD9WOSP+vxIa7+wjHnNXtWWf2JuzlTapHrx++J8K9zn75tGibXHsZb/DHvp4Pl50Ln2w1VhYuwg2MAUuf/Q2c8dIhM8srRmPGqEn621GTK0cNGweyLR1y88epLSt6MnbQAY89vGVd/LR5TwIDAQAB-----END PUBLIC KEY-----';

        // const key = new NodeRSA({b: 512});
        // key.importKey(publickey, 'pkcs8-public');

        // //var pubKey = new NodeRSA(publickey,'pkcs8-public');//导入公钥
        // var encrypted = key.encrypt('hithere', 'base64'); //使用公钥加密字符串
        // console.log('========encrypted: ', encrypted);
 
        // const privatekey = '-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQC6KzAVhTxDl/6EUTtCbtRFOPKA4/WOD9WOSP+vxIa7+wjHnNXtWWf2JuzlTapHrx++J8K9zn75tGibXHsZb/DHvp4Pl50Ln2w1VhYuwg2MAUuf/Q2c8dIhM8srRmPGqEn621GTK0cNGweyLR1y88epLSt6MnbQAY89vGVd/LR5TwIDAQABAoGAWD1WKi0flk45pc+2zdMoK7NFRhBGeFJK/4jcIBx/XCQtUielQj2pSAPFLx5zwkxgOEoyRLLWflajalgYRMNJFSSZA9tCPmIID32OYmVm+ChCt5sTxvrugzDvA8zVz/p97Kbz1/8BezTa4fWOfvrmPH0JrOkVcTJYpu5WlDVcf9ECQQDnVVlKccb/a8us71FIVCZo6gBnwBf9sVeEj2WVIQdrzIYVQfVMguTiDSL0GT6FonL84XTNM8kJOYpwG9mq9GCXAkEAzgT9Tm3aRMAG+33pCjED05za1OwwXf3xSeFNH4p9PMEsga/cew8RpZcfC+qLj/t/yiDhf5TpHytJzQ20g9oMCQJAMYNAAEIH8KVWy6XRROTV78Cd45bmy6LIc5PpjxipqPX2gNhEM2MUsBlVsN8yVZHmgJ+Uy1LZJYNOUR504TU68wJBAIUxUJreBpkgFOOO+ZTvL2wmIow5zuNVhCOhl3zmyiT3NtD5Y2/jxCLsWtQXZPdHP8zsCR20pirSj7oUPDpqRBECQQCANhG5Oo8eP0CU0Ruik7GmA6RuLbryEtCc3urf1VEp/ebhi8ynGyC8FNxwUe+kqYwJHNvkU8WqkxhSoPsU4+WO-----END RSA PRIVATE KEY-----';
        // const key2 = new NodeRSA({b: 512});
        // key2.importKey(privatekey, 'pkcs1-private');

        // var decrypted = key2.decrypt(encrypted, 'base64');
        // console.log('========decrypted: ', decrypted);       
        // //var flag = key.verify('hithere', encrypted);

        // //console.log('========verify: ', flag==true? "success": "fail");
    }

    render() {
        return (
            <div className="gameContainer">
                <Head>
                    <title>皇帝蜂大作战</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="preload" href="/static/fonts/Montserrat-Light.ttf" as="font" />
                    <link rel="preload" href="/static/fonts/Montserrat-Thin.ttf" as="font" />
                </Head>
                <canvas
                    ref={c => this.canvas = c}
                    height="450"
                    width="600"
                />
                <div className='mask'></div>
                <div className='rankBox'>
                    <img className='off' src='/static/assets/off.png' alt='' />
                    <p className='rankTitle'>排行榜</p>
                    <p className='rankExplain'>排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明排行榜说明</p>
                    <p className='myScore'>我的得分：10000</p>
                    <div className='rankList'>
                        
                    </div>
                </div>
                <div className='beeBox'>
                    <div className='play'></div>
                    <div className='rank'></div>
                    <div className='rule'></div>
                </div>
                <div className='palyAgainBox'>
                    <div className='frendScore'>
                        
                    </div>
                    <div className='playAgainBg'>
                        <div className='playAgain'></div>
                        <div className='rank2'></div>
                        <div className='rule2'></div>
                    </div>
                </div>
                <style jsx global>
                    {`
                        html, body {
                            height: 100vh;
                            margin: 0;
                            overflow: hidden;
                            background-color: black;
                        }
                        p{
                            margin: 0;
                            padding: 0;
                        }
                        .off{
                            position: absolute;
                            right: -10%;
                            top: 0;
                            width: 13%;
                            margin-top: -18%;
                        }
                        .beeBox{
                            position: absolute;
                            width: 80%;
                            height: 99.75vw;
                            left: 10%;
                            top:19%;
                            background-image: url(/static/assets/p1-t2.png);
                            background-repeat: no-repeat;
                            background-size: 100% auto;
                            display:none;
                        }
                        .palyAgainBox{
                            width:80%;
                            height:100vw;
                            position: absolute;
                            left: 10%;
                            top: 32%;
                            //border: 1px solid white;
                            display:none;
                        }
                        .frendScore{
                            width: 100%;
                            height: 17vw;
                            position: relative;
                            overflow-y: auto;
                            color: white;
                            text-align: center;
                        }
                        .playAgainBg{
                            width: 100%;
                            height: 44.42vw;
                            position: absolute;
                            background-image: url(/static/assets/playAgain.png);
                            background-repeat: no-repeat;
                            background-size: 100% auto;
                        }
                        .playAgainBg div{
                            margin-left: 15%;
                            width: 70%;
                            //border: 1px solid white;
                        }
                        .beeBox div{
                            margin-left: 10%;
                            width: 80%;
                            //border: 1px solid white;
                        }
                        .play{
                            margin-top: 81%;
                            height:14%
                        }
                        .playAgain{
                            margin-top: 12%;
                            height: 28%;
                        }
                        .rank{
                            margin-top: 2%;
                            height:9%
                        }
                        .rank2{
                            margin-top: 6%;
                            height: 18%;
                        }
                        .rule{
                            margin-top: 3%;
                            height: 10%;
                        }
                        .rule2{
                            margin-top: 2%;
                            height: 17%;
                        }
                        .mask{
                            width: 100%;
                            height: 100%;
                            position: fixed;
                            left: 0;
                            top: 0;
                            z-index: 100;
                            background-image: url(/static/assets/bg.png);
                            background-repeat: no-repeat;
                            background-size: 100% 100%;
                            display: none;
                        }
                        .rankList{
                            width:90%;
                            height: 80%;
                            overflow: auto;
                        }
                        .rankList p{
                            margin-top: 5%;
                            color: #edb97b;
                            width: 100%;
                            text-align: center;
                            font-size: 16px;
                            padding: 5px 0;
                        }
                        .listName{
                            display: inline-block;
                            width: 50%;
                            text-align: right;
                        }
                        .listScore{
                            display: inline-block;
                            width: 50%;
                            text-align: left;
                        }
                        .myScore{
                            color:#edb97b;
                            width: 100%;
                            text-align: center;
                            font-size: 16px;
                        }
                        .rankBox{
                            width: 80%;
                            height: 80%;
                            position: absolute;
                            z-index: 10001;
                            left: 10%;
                            top:10%;
                            display:none;
                        }
                        .rankTitle{
                            color: #fbe0b2;
                            width: 100%;
                            text-align: center;
                        }
                        .rankExplain{
                            color:#edb97b;
                            width: 100%;
                            text-align: center;
                            font-size: 13px;
                        }
                        .gameContainer {
                            height: 100vh;
                        }

                        @font-face {
                            font-family: "Montserrat-Regular";
                            src: url("/static/fonts/Montserrat-Regular.ttf") format("truetype")
                        }
                        @font-face {
                            font-family: "Montserrat-Light";
                            src: url("/static/fonts/Montserrat-Light.ttf") format("truetype")
                        }
                        @font-face {
                            font-family: "Montserrat-Thin";
                            src: url("/static/fonts/Montserrat-Thin.ttf") format("truetype")
                        }
                    `}
                </style>
            </div>
        )
    }
}