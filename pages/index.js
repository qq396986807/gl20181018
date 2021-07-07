
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
                // var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("http://localhost:3000/?Fopenid="+Fopenid);
                var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("https://guerlain.wcampaign.cn?Fopenid="+Fopenid);
                window.location.href = oAtuhUrl;
            }else {
                // var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("http://localhost:3000/")
                var oAtuhUrl = "https://guerlain.wechat.wcampaign.cn/oauth?redirecturl=" + btoa("https://guerlain.wcampaign.cn")
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
                    ////console.log(data);
                }
            })
        }else{
            if(userInf){
                userData = JSON.parse(userData);
            }
        }

    }

        ouathinit();
        //console.log(userData);
        




    //结束-----------------


        //点击排行榜
        $(".rank,.rule2").click(function(){
            $(".mask").fadeIn(500);
            $(".rankBox").fadeIn(500);
            $.ajax({
                url:'https://guerlain.wechat.wcampaign.cn/user/getlist',
                type:'POST',
                dataType: "json",
                success:function (data) {
                    $(".rankList").html("");
                    for(var i=0;i<data.length;i++){
                        
                        if(i%2 === 0){
                            var oDov = $("<p class='scoreBg'><span class='listName'>"+data[i].nickname+"</span><span class='listScore'>"+data[i].score+"</span></p>")
                        }else{
                            var oDov = $("<p><span class='listName'>"+data[i].nickname+"</span><span class='listScore'>"+data[i].score+"</span></p>")
                        }
                        $(".rankList").append(oDov);
                    }
                    var scrollbar = $("<div class='scrolLine'></div>")
                        $(".rankList").append(scrollbar);
                }
            })

            if(userData)
            {
                try{
                    $.ajax({
                        url:'https://guerlain.wechat.wcampaign.cn/user/getsingle',
                        type:'POST',
                        data:{openid:userData.original.openid},
                        dataType: "json",
                        success:function (data) {   
                            $(".myScore .listScore").html(data[0].score);
                        }
                    })

                }catch(err)
                {
                    console.log("index.js, ajax getsingle, userData is null!");
                }
                
            }else
            {
                console.log("index.js, ajax getsingle, userData is null!");
            }

            
        })

        //点击分享，弹出浮层
        $(".rank2").click(function(){
            $(".share").fadeIn(500);
        });

        //点击规则
        $(".rule").click(function(){
            $(".ruleShow").fadeIn(500);
        })

        //点击shanre消失
        $(".share,.ruleShow").click(function(){
            $(this).fadeOut(500);
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
                    $(".frendScore").html("");
                    for(var i=0;i<data.length;i++){
                        var oDov = $("<p class='again-friend-w'><span class='listName'>"+data[i].nickname+"</span><span class='listScore'>"+data[i].score+"</span></p>")
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

        //微信share
        var data = {};
        data.pageurl = window.location.href;
        $.ajaxSettings.async = true;
        $.getJSON("https://guerlain.wechat.wcampaign.cn/jssdk", data, function(data){
            wx.config(data);
        });

        //微信分享,接受参数传值
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '嗡嗡嗡，暴露眼力和手速的帝皇蜂大作战来一局？', // 分享标题
                link: "https://guerlain.wcampaign.cn/?Fopenid=" + userData.original.openid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'https://guerlain.wcampaign.cn/static/share-icon.jpg', // 分享图标
                success: function () {
                    
                }
            });
            wx.onMenuShareAppMessage({
                title: '嗡嗡嗡，暴露眼力和手速的帝皇蜂大作战来一局？', // 分享标题
                desc: '圣诞季我们一起去浦东机场玩同款游戏赢取娇兰190周年庆惊喜好礼！', // 分享描述
                link: "https://guerlain.wcampaign.cn/?Fopenid=" + userData.original.openid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'https://guerlain.wcampaign.cn/static/share-icon.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    
                }
            });
        });
        
        // 清空用户现有记录
        //localStorage.setItem('bestScore', 0);

        // 百度统计
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?ffa39d05b2ad971fbe3170b74f5c7604";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();


    }

    render() {
        return (
            <div className="gameContainer">
                <Head>
                    <title>帝皇蜂大作战</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <link rel="manifest" href="/manifest.json" />
                    <script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
                    <script src="https://cdn.wcampaign.cn/20181019gl/h5/jweixin.js"></script>
                </Head>
                <canvas
                    ref={c => this.canvas = c}
                    height="450"
                    width="600"
                />
                <img className='share' src='https://cdn.wcampaign.cn/20181019gl/h5/static/assets/share.png' alt='' />
                <img className='ruleShow' src='https://cdn.wcampaign.cn/20181019gl/h5/static/assets/rule.png' alt='' />
                <div className='mask'></div>
                <div className='rankBox'>
                    <img className='off' src='https://cdn.wcampaign.cn/20181019gl/h5/static/assets/off.png'  />
                    <p className='rankTitle'>
                    <img className='phb' src='https://cdn.wcampaign.cn/20181019gl/h5/static/assets/phb.png' alt='' />
                    </p>
                    <p className='rankExplain'></p>
                    <p className='myScore'>
                    <span className='listName'>我的分数</span><span className='listScore'>500</span>
                    </p>
                    <div className='rankList'>
                        
                    </div>
                </div>
                <div className='beeBox'>
                    <div className='play'></div>
                    <div className='rank'></div>
                    <div className='rule'></div>
                </div>
                <div className='palyAgainBox'>
                    <div className='again-myscore-w'><span className='listName again-myscore-t'>我的分数</span><span id='myScore' className='listScore  again-myscore'></span></div>
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
                        *{-webkit-user-select: none; user-select: none;}
                        html, body {
                            height: 100vh;
                            margin: 0;
                            overflow: hidden;
                            background-color: black;
                            font-family: "SF Pro SC","SF Pro Text","SF Pro Icons","PingFang SC","Helvetica Neue","Helvetica","Arial",sans-serif;
                        }
                        p{
                            margin: 0;
                            padding: 0;
                        }
                        .off{
                            position: absolute;
                            right: -5.5%;
                            top: 0;
                            width: 13%;
                            margin-top: -12%;
                        }
                        .share,.ruleShow{
                            width: 100%;
                            height: auto;
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 1000;
                            display:none;
                        }
                        .phb{
                            width:31%;
                        }
                        .beeBox{
                            position: absolute;
                            width: 80%;
                            height: 99.75vw;
                            left: 10%;
                            top:19%;
                            background-image: url(https://cdn.wcampaign.cn/20181019gl/h5/static/assets/p1-t2.png);
                            background-repeat: no-repeat;
                            background-size: 100% auto;
                            display:none;
                        }
                        .palyAgainBox{
                            width:80%;
                            height:100vw;
                            position: absolute;
                            left: 10%;
                            top: 20%;
                            display:none;
                        }
                        .palyAgainBox>.listName,.palyAgainBox>.listScore{
                            color=#eee2b2;
                        }
                        .scoreBg{
                            background-color: #342d23;
                        }
                        .frendScore{
                            width: 100%;
                            height: 28vw;
                            position: relative;
                            overflow-y: auto;
                            color: white;
                            text-align: center;
                            margin-top: 2%;
                        }
                        .playAgainBg{
                            width: 100%;
                            height: 44.42vw;
                            position: absolute;
                            background-image: url(https://cdn.wcampaign.cn/20181019gl/h5/static/assets/playAgain.png);
                            background-repeat: no-repeat;
                            background-size: 100% auto;
                        }
                        .playAgainBg div{
                            margin-left: 15%;
                            width: 70%;
                        }
                        .beeBox div{
                            margin-left: 10%;
                            width: 80%;
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
                            background-image: url(https://cdn.wcampaign.cn/20181019gl/h5/static/assets/bg.png);
                            background-repeat: no-repeat;
                            background-size: 100% 100%;
                            display: none;
                        }
                        .rankList{
                            width:100%;
                            height: 76%;
                            overflow: auto;
                        }
                        .rankList::-webkit-scrollbar {
                            width: 0.4em;//表示垂直滚动条的宽度
                            height: 1px;//表示水平滚动条的高度
                        }
                        /*正常情况下滑块的样式*/
                        .rankList::-webkit-scrollbar-thumb {
                            background-color: #fedaa5;
                            border-radius: 10px;
                          
                        }
    
                        .scrolLine{
                            position: absolute;
                            width: 2px;
                            height: 75%;
                            right: 0.15em;
                            top: 26%;
                            border-right: 1px solid #ffcd76;
                            z-index: -1;
                        }
                        .rankList p{
                            
                            color: #edb97b;
                            width: 100%;
                            text-align: center;
                            font-size: 16px;
                            padding: 3px 0;
                            display: flex;
                            opacity: .8;
                        }
                        .listName{
                            display: inline-block;
                            width: 48%;
                            text-align: right;
                            color:#eab883;
                            font-size: 0.8em;
                            letter-spacing:2px;
                            height: 27px;
                            line-height: 27px;
                            overflow: hidden;
                        }
                        .listScore{
                            margin-left:4%;
                            display: inline-block;
                            width: 48%;
                            text-align: left;
                            color:#eab883;
                            font-size: 1.2em;
                            letter-spacing:4px;
                            height: 27px;
                            line-height: 27px;
                        }
                        .myScore{
                            color:#edb97b;
                            width: 100%;
                            text-align: center; 
                            padding: 3px 0;
                            display: flex;
                        }
                        .rankBox{
                            width: 90%;
                            height: 80%;
                            position: absolute;
                            z-index: 10001;
                            left: 5%;
                            top: 6%;
                            display:none;
                        }
                        .rankTitle{
                            width: 100%;
                            text-align: center;
                            padding-bottom: 10px;
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

                        .again-myscore-t{
                            color: #fddfaf;
                        }

                        .again-myscore{
                            color: #fddfaf;
                        }

                        .again-myscore-w{
                            display: flex;
                        }

                        .again-friend-w{
                            display: flex;
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