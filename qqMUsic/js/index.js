function ff(){
    $('.index').css('height', innerHeight - $('body .bottom').outerHeight() + 'px')///计算高度
    $('.phb').css('height', innerHeight - $('body .bottom .music').outerHeight() + 'px')///计算高度
    $('.mUsic-bfq>div').not('.top').css('height', $(window).height() - $('.mUsic-bfq .top')
        .outerHeight(true) + 'px')
}
ff()
window.onresize=function(){
    ff()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let url = 'http://api.cimns.com:8081/'
let musicData = [];
let songlength = 0;
let kou = [];
let lb = null;
let musicHistory=window.localStorage;
//////////////////////////////////////////////////////////////////////
function shiping(item) {///有无mv
    if (item.vid) return '&#xe6bf;'
}

let isHigh = (n) => {///高清 超高清 独家
    if (n.sizeogg != 0 || n.sizeflac != 0 || n.sizeape != 0) return '&#xe60c;';
    else if (n.size320 != 0) return '&#xe8ab;';
    else return '&#xe61c;';
}
dataINdex()
/////////首页数据封装////////////////////////
function dataINdex() {
    // $('.load').html('下拉刷新')
    $.ajax({
        "url": url + 'focus',
        "type": "get",
        "dataType": "json",
        "success": function (data) {
            $('.banner .swiper-wrapper ').html(' ')
            $.each(data.data.list, function (index, item) {
                let ss = item.pic_info.url
                $(`<div class="swiper-slide"><img src="${ss}" alt=""></div>`).appendTo($('.banner .swiper-wrapper '))
            })
            mySwiper = new Swiper('.swiper-container', {
                loop: true, // 循环模式选项,
                initialSlide: 2,
                speed: 250,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                slidesPerView: 'auto',
                grabCursor: true,
                pagination: {
                    el: '.swiper-pagination',
                },
            })
            // sx()
        }
    })
    //////////////////////////////首页歌单
    $.ajax({
        "type": "get",
        "dataType": "json",
        "url": url + "hotrecom",
        "success": function (data) {
            $('.one  .swiper-wrapper').html('')
            $('.two  .swiper-wrapper').html('')
            lb = data.data;
            $.each(data.data, function (index, item) {
                kou.push(item.content_id);
                let oItem = $(`
                        <div class="item swiper-slide .cc" index="${index}">
                           <div class="img">
                               <img src="${item.cover}" alt="">
                               <i class="iconfont">&#xe616;</i>
                           <div>
                               <span>${item.listen_num / 10000}</span>万 <i class="iconfont">&#xe61d;</i>
                           </div>
                        </div>
                      <p>${item.title}</p>
                  </div>`);
                if (index <= 5) {
                    oItem.appendTo($('.one  .swiper-wrapper'))
                } else {
                    oItem.appendTo($('.two  .swiper-wrapper'))
                }
            })
            let one = new Swiper('.auto', {
                slidesPerView: 'auto'
            })
            $('load').html('下拉刷新')
            $('.index>div').css({
                'top': `0px`,
                // 'transition':'0s'
            })
        }
    })
}
//////////////////////////////////////////搜索///////////////////////////////////////////////////////////////////////////////////
let numm = 0;

$('.fh').click(function () {
    $('.bottom-nav').parent().show(200)
    dh()
})
$('input').on('click', function () {
    $('header')
    $('.phb header').html(`<div class="icon"><i class="iconfont fh">&#xe613;</i><input type="text" id="search"><i class="iconfont"></i></div>`).css('height','auto')
    $('.phb').css({
        transform: 'translateX(0)',
        transition: '.5s',
        'z-index': 99,
    }).siblings().not('.bottom ').not('.mUsic-bfq').not('audio').css({
        transform: 'translateX(-100%)',
        transition: '1.5s',
        'z-index': 1,
    })
    $('#search').on('input', function () {

        console.log($(this).val())
        let name=$(this).val();
        $.ajax({
            url:`https://c.y.qq.com/soso/fcgi-bin/client_search_cp?g_tk=5381&p=1&n=50&w=${name}&format=jsonp&jsonpCallback=callback&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&flag_qc=0`,
            dataType:'jsonp',
        })
    })
})
function callback(data) {
    musicData=[]
    dataSong=data;
    $('.phb .list').html(' ')
    let Data=data.data.song.list;
    console.log(Data)
    $('.phb .cntrols .num').html(Data.length)
    itemS(Data, numm)
}
/////////////////////////////////////////phb////////////////////////////////////////////////////////////////////////////////

////////////歌曲列表/////////////////////////////////////////////////////////////////////////////////////////

$('.list-1').on('click', '.item', function () {
    let oIndex = $(this).attr('index')
    /////////////排行榜出现
    musicData = []
    $('.bottom-nav').hide(200)
    $('.phb').css({
        transform: 'translateX(0)',
        transition: '.5s',
        'z-index': 99,
    }).siblings().not('.bottom ').not('.mUsic-bfq').not('audio').css({
        transform: 'translateX(-100%)',
        transition: '1.5s',
        'z-index': 1,
    })
    $('.phb header').html('')
    $('.phb .list').html('')
    $(`
                             <img src="" alt="">
                             <div class="icon">
                                  <i class="iconfont fh">&#xe613;</i>
                                  <i class="iconfont">&#xe604;</i>
                             </div>
                             <div class="text">
                                  <h3>${lb[oIndex].title}</h3>
                                  <h2>${lb[oIndex].rcmdtemplate}</h2>
                                  <div class="time">
                                      <span>2019</span>-
                                      <span>05</span>-
                                      <span>14</span>
                                      <em>更新</em>
                                       <i class="iconfont">&#xe74e;</i>
                                  </div>
                             </div>
          `).appendTo($('.phb header').css('background-image',`url(${lb[oIndex].cover})`));
    ////////////////////////////
    $.ajax({
        url: url + 'playlist/detail',
        type: 'get',
        dataType: 'json',
        data: {
            "type": 1,
            "disstid": kou[oIndex],
        },
        success: function (data) {
            console.log(data)
            /////////////头部/////////////
            //////////全部播放右边的数量//////////////////////////
            $('.phb .cntrols .num').html(data.songlist.length)
            songlength = data.songlist.length;
            ///////////////////歌曲///////////
            dataSong = data.songlist;
            numm = 0;
            itemS(data.songlist, numm)
            console.log(data.songlist)
        }
    })
})
let oLEngth = 20;//数据显示数量
$('.phb').scroll(function () {
    $.each($('.phb .list .item'), function (index, item) {
        if ($('.phb').scrollTop() + innerHeight > $('.phb')[0].scrollHeight) {
            numm += oLEngth;
            itemS(dataSong, numm)
        }
    })
})

/////////////////////渲染歌曲列表数据////////////////////////////////////////////////////////////////////////////
function itemS(data, le) {
    $.each(data, function (index, item) {
        musicData.push(item);
        if (index < le) {
            return
        }
        if (index >= le + oLEngth) {
            console.log(le)
            return;
        }

        $(`
                              <div class="item">
                                  <div class="rank">
                                      <span>${index + 1}</span>
                                  </div>
                                  <div class="info">
                                      <span class="name">${item.songname}</span>
                                      <div class="singer">
                                          <i class="iconfont">250</i>
                                          <span>${item.albumname}</span>
                                      </div>
                                  </div>
                                  <div class="right">
                                      <i class="iconfont"></i>
                                      <i class="iconfont">&#xe604;</i>
                                  </div>
                              </div>
                  `).appendTo($('.phb .list')).find('.singer i').html(isHigh(item)).end()
            .find('.right i').eq(0).html(shiping(item))//////////清晰度  mv
    })
}


///////////////////////////播放/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////出现详情播放页////////////////////////////////////////////////////////////////
$('.bottom .music').click(function () {
    let This;
    /////////////详情播放出现////////////
    $('.mUsic-bfq').show()
    setTimeout(function () {
        $('.mUsic-bfq').css({
            'transform': ' translateY(0)'
        }).find('.hide').click(function () {///详情播放消失
            This = this
            $(this).parents('.mUsic-bfq').css({
                'transform': ' translateY(100%)'
            })
            setTimeout(function () {
                $(This).parents('.mUsic-bfq').hide()
            }, 500)
        })
    })
    s = new Swiper('.autoa', {
        slidesPerView: 'auto'
    })
})
//////////////////////////歌曲播放/暂停////////////////////////////////////////////////////////
let isplay = true;
$('.stop').click(function () {
    if (isplay) {
        $('audio')[0].pause()
        $('.stop').html('&#xe61a;')

    } else {
        $('audio')[0].play();
        $('.stop').html('&#xe6db;')

    }
    isplay = !isplay;
    return false
})
/////////////////////播放/请求数据//////////////////////////////////////////////////////////////////////////////////////
let songText = [];//歌词
let songtime = [];//歌词时间
let num = 0;//第几首
function music(num) {//播放数据请
    console.log(num)

    songText = [];
    songtime = [];
    $.ajax({
        url: url + 'song/detail',
        type: 'get',
        data: {
            mid: musicData[num].songmid?musicData[num].songmid:num,
        },
        dataType: "json",
        success: function (data) {
            $('.mUsic-bfq .textwarp ul').html('')
            $('audio').attr('src', data.sip[0] + data.purl)[0].play()
            $('.stop').html('&#xe6db;')
            let kg = false;
            $('.mUsic-bfq .name').html(data.detail.extras.name)//歌曲名
            ///////////////////////////歌词数据///////////////////
            $.each(data.lyric.split('['), function (index, item) {
                item.substring(0, item.indexOf(']'))
                songtime.push(item.substring(0, item.indexOf(']')));
                songText.push(item.substring(item.indexOf(']')));
            })

            ///////////////////////歌手名//////////////////////////////
            function singerName(data) {
                let name = '';
                $.each(data.detail.track_info.singer, function (index, item) {
                    name += item.name + '  / '
                })
                singernames = name.substring(0, name.length - 2)
                return singernames
            }

            $('.mUsic-bfq .songer-bf').html(singerName(data))
            $('.phb .list .item').eq(num).addClass('active').siblings().removeClass('active')
            $('.mUsic-bfq .songtext')[0].innerHTML = '大'
            $.each(songtime, function (index, item) {
                $(`<li>${songText[index].substring(1)}</li>`).appendTo($('.mUsic-bfq .songtext'))
            })
        }
    })
}


$('.phb .list').on('click', '.item', function () {////列表点击
    num = $(this).index();
    $('.stop').html('&#xe6db;')
    music(num)
})
///////////////////上一曲下一曲
$('.music-button .next').click(function () {
    if ($(this).index() == 1) {
        num--
    } else {
        num++
    }

    music(num)
})
//////////////播放完下一曲
$('audio').on('ended', function () {
    num++
    music(num)
})

// 进度条/////////
function b0(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num
    }
}


$('audio').on('timeupdate', function () {
    let scale = $('audio')[0].currentTime / $('audio')[0].duration;
    $('.tiao').css('transform', `translateX(${scale * 100}%)`)
    let s = $('audio')[0].currentTime;

    function oCurrentTime(s) {
        let q = 0;
        if (s > 60) {
            q = parseInt(s / 59) + ':' + b0(parseInt(s % 60));
        } else {
            q = '00:' + parseInt(s);
        }
        return q
    }

    $('.jd ul li').eq(0).html(oCurrentTime(s))
})
////////////////////////////滑动进度条
$('.music-button .jd').on('touchstart', function (e) {
    let tt = e.originalEvent.changedTouches[0].pageX - $(this).offset().left
    $(this).find('.tiao').css('transform', `translateX(${tt / $(this).width() * 100}%)`)
    $('audio')[0].currentTime = tt / $(this).width() * $('audio')[0].duration
    $(this).on('touchmove', function (e) {
        let move = e.originalEvent.changedTouches[0].pageX - $(this).offset().left
        $('audio')[0].currentTime = move / $(this).width() * $('audio')[0].duration
    })
})
//歌词///////

$('audio')[0].ontimeupdate = function () {
    let progressValue = $('audio')[0].currentTime;
    $.each(songtime, function (index, item) {
        let f = item.substring(0, item.indexOf(':'))
        let m = item.substring(item.indexOf(':') + 1, item.indexOf('.'))
        let hm = item.substring(item.indexOf('.') + 1)
        let long = f * 60 + m * 1 + hm / 100
        if (progressValue > long) {
            // console.log(songText[index].substring(1))
            $('.topp .song-text').html(songText[index].substring(1))
            $('.mUsic-bfq .songtext').css('transform', `translateY(-${$('.mUsic-bfq .songtext li')
                .eq(index).position().top}px)`).find('li').eq(index).addClass('active').siblings('li').removeClass('active')
        }
    })
    musicHistory.timer=$('audio')[0].currentTime;
    musicHistory.songnum=num;
    musicHistory.data=JSON.stringify(musicData[num]);

}

///////////////////////////返回首页//////////////////////////////////////////////////////////////////////////

///////////////////////歌曲列表返回首页/////////////////////////////////////////////////
function dh() {
    numm = 0//延迟加载归位
    $('.bottom-nav').show(200)
    $('.phb').css({
        transition: '1s',
        transform: 'translateX(100%)',
        'z-index': -1,
    }).siblings('.index').css({
        transition: '.5s',
        transform: 'translateX(0)',
        'z-index': 99,
    })
}
//点击返回首页
function f1() {
    $('.phb header').on('click','.fh', function () {
        dh()
    })
}
f1()

//滑动返回
$('.phb').on('touchstart', function (e) {
    let startX = e.originalEvent.changedTouches[0].pageX
    let num = 0;
    $(this).on('touchmove', function (e) {
        num += .2
        let move = e.originalEvent.changedTouches[0].pageX - startX
        $(this).css({
            'transition': '0s',
            'transform': `translateX(${move / innerWidth * 100}%)`,
        }).siblings('.index').css({
                'transition': '0s',
                'transform': `translateX(-${100 - move / innerWidth * 100 - num}%)`,
            }
        )
        $(this).on('touchend', function (e) {
            let stopX = e.originalEvent.changedTouches[0].pageX
            if (stopX - innerWidth / 2 > startX) {
                dh()
                $(this).css({
                    // 'transform': `translateX(0)`,
                    'transition': '0s',
                }).siblings('.index').css({
                    'transition': '0s',
                })
            } else {
                $(this).css({
                    'transform': `translateX(0)`,
                    'transition': '0s',
                })
            }
        })
    },)
})

//////////////////////////////////////////////////////////////////////////////////////////
// if (musicHistory.songnum){
//     let data=JSON.parse(musicHistory.data);
//
//     let a=data.songmid;
//     let timer=musicHistory.timer;
//     console.log(a)
//     musicHistory.data=JSON.stringify(data)
//     // function music(num) {//播放数据请求
//         // if(num-1!=NaN){
//         //     num < 0 ? num = songlength - 1 : num = num;
//         //     num > songlength - 1 ? num = 0 : num = num;
//         // }
//         console.log(num)
//
//         songText = [];
//         songtime = [];
//     $('audio')[0].currentTime=musicHistory.timer
// }


// 搜索（跨域）
// url： https://c.y.qq.com/soso/fcgi-bin/client_search_cp?g_tk=5381&p=1&n=20&w=%E6%AC%A7%E9%98%B3%E6%9C%B5&format=jsonp&jsonpCallback=callback&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&flag_qc=0
//     参数：
//
// w：搜索关键字
// p：当前页
// n：每页歌曲数量
// format：数据格式
// jsonpCallback：jsonp回调函数
//
// 说明： 在返回数据中有一个zhida字段里面有一个type字段，其中1表示歌手、2表示专辑。如不需要jsonp调用，将format参数值修改为json并且去掉jsonpCallback参数
//
// 作者：code_mcx
// 链接：https://juejin.im/post/5a35228e51882506a463b172
//     来源：掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
