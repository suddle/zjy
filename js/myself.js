define([
    'jquery','validate','layer','cookie','tool@v3'
], function($){
    var exports = {};
    exports.name = "商城2.0";
    exports.init = function () {
        this[__shop2_funName]();
    }
    //七牛
    function imageUPload(btn,upload_token,cb){
        Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: btn,
            uptoken_url: upload_token,
            // uptoken : '',
            unique_names: true,
            // save_key: true,
            domain: 'http://img.youxiake.com/',
            get_new_uptoken: false,
            container: 'container',
            max_file_size: '5mb',
            flash_swf_url: 'js/plupload/Moxie.swf',
            max_retries: 3,
            dragdrop: true,
            drop_element: 'container',
            chunk_size: '4mb',
            auto_start: false,
            filters: {
                max_file_size: '5mb',
                prevent_duplicates: false,
                mime_types: [{
                    title: "Image files",
                    extensions: "jpg,jpeg,png"
                }]
            },
            init: {
                'FilesAdded': function (up, files) {
                    up.start();
                },
                'BeforeUpload': function (up, file) {
                    // up.files=[]
                    // 每个文件上传前,处理相关的事情
                     if(up.total.size>5242880){
                        layer.msg('文件太大，请重新上传');
                        window.location.reload();
                        return false;
                    }
                },
                'UploadProgress': function (up, file) {
                    // 每个文件上传时,处理相关的事情
                },
                'FileUploaded': function (up, file, info) {
                    // 每个文件上传成功后,处理相关的事
                    var domain = up.getOption('domain');
                    var res = JSON.parse(info.response);
                    var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                    // // var imageInfoObj = Qiniu.imageInfo(res.key);
                    cb(sourceLink)
                },
                FilesRemoved: function () {
                    console.log('文件被删除')
                },
                'Error': function (up, err, errTip) {
                    //上传出错时,处理相关的事情
                    console.log(err)
                },
                'UploadComplete': function () {
                    //队列文件处理完毕后,处理相关的事情
                },
                'Key': function (up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var key = "";
                    // do something with key here
                    return key
                }
            }
        })
    }
    // 商城详情页JS
    exports.shopDetail = function(){
        // banner图初始化swiper
        (function(){
            var bannerSwiper = new Swiper ('.header_banner_container', {
                mode: 'horizontal',
                loop: true,
                autoplay: false,
                speed: 1000,
                autoplayDisableOnInteraction: false,
            });
            $(".header_nav").click(function(){
                $(".color_bigPic").hide();
                $(".header_nav").removeClass("header_nav_focus");
                $(this).addClass("header_nav_focus");
                bannerSwiper.swipeTo($(this).index(), 500);
            });
        })();
        // header选择颜色、规格、数量
        (function(){
            $(".color_pic").click(function(){
                $(".color_bigPic").css("background-image", $(this).css("background-image"));
                $(".color_bigPic").show();
                $(".color_pic").removeClass("color_pic_focus");
                $(this).addClass("color_pic_focus");
            });
            $(".size_select").click(function(){
                $(".size_select").removeClass("size_select_focus");
                $(this).addClass("size_select_focus");
            });
            $(".count_plus").click(function(){
                var total = parseFloat($(".count_left").text());
                var count = parseFloat($(".count_number").text());
                if (count < total) {
                    count++;
                    $(".count_number").text(count);
                    if (count < total) {
                        $(this).css("cursor", "pointer");
                    } else {
                        $(this).css("cursor", "not-allowed");
                    }
                    $(".count_reduce").css("cursor", "pointer");
                }
            });
            $(".count_reduce").click(function(){
                var total = parseFloat($(".count_left").text());
                var count = parseFloat($(".count_number").text());
                if (count > 1) {
                    count--;
                    $(".count_number").text(count);
                    if (count > 1) {
                        $(this).css("cursor", "pointer");
                    } else {
                        $(this).css("cursor", "not-allowed");
                    }
                    $(".count_plus").css("cursor", "pointer");
                }
            });
            $('.rightFloat_phone').hover(function(){
                $(this).find('.ewm').fadeIn();
            },function(){
                $(this).find('.ewm').fadeOut();
            });
        })();
        (function(){
            $(document).on('click','.button_shopcart',function(){
                var txt = $('.size_select_focus').text();
                var color = $('.color_pic_focus').text();
                var number = $('.count_number').text();
                if(color==''){

                }
                $.ajax({
                    url:'',
                    type:'get',
                    data:'',
                    success:function(data){
                        if(data.code==200){
                            $('.count_leftText .count_left').text()
                        }
                    }
                })
            })
            $(document).on('click','.rightFloat_toTop',function(){
                $('body,html').animate({scrollTop:0},500);
            })
        })();
    };
    //========================================购物车======================================================
    exports.shopCar = function(){
        (function(){

            //全局的checkbox选中和未选中的样式
            var $allCheckbox = $('input[type="checkbox"]'),     //全局的全部checkbox
                $wholeChexbox = $('.whole_check'),
                $cartBox = $('.cartBox'),                       //每个商铺盒子
                $shopCheckbox = $('.shopChoice'),               //每个商铺的checkbox
                $sonCheckBox = $('.son_check');                 //每个商铺下的商品的checkbox
            $allCheckbox.click(function () {
                if ($(this).is(':checked')) {
                    $(this).next('label').addClass('mark');

                } else {
                    $(this).next('label').removeClass('mark')
                }
            });

            //======全局全选与单个商品的关系=======
            $wholeChexbox.click(function () {
                var $checkboxs = $cartBox.find('input[type="checkbox"]');
                if ($(this).is(':checked')) {
                    $checkboxs.prop("checked", true);
                    $checkboxs.next('label').addClass('mark');
                    $wholeChexbox.next('label').addClass('mark');
                } else {
                    $checkboxs.prop("checked", false);
                    $checkboxs.next('label').removeClass('mark');
                    $wholeChexbox.next('label').removeClass('mark');
                }
                totalMoney();
            });


            $sonCheckBox.each(function () {
                if($(this).is(':checked')){
                    if($('.son_check').length==$('.son_check:checked').length){
                        $wholeChexbox.closest('.list_chk').find('label ').addClass('mark');
                    }
                    $(this).closest('.list_chk').find('label ').addClass('mark');
                    totalMoney();
                }
                $(this).click(function () {
                    if ($(this).is(':checked')) {
                        //判断：所有单个商品是否勾选
                        var len = $sonCheckBox.length;
                        var num = 0;
                        $sonCheckBox.each(function () {
                            if ($(this).is(':checked')) {
                                num++;
                            }
                        });
                        if (num == len) {
                            $wholeChexbox.prop("checked", true);
                            $wholeChexbox.next('label').addClass('mark');
                        }
                    } else {
                        //单个商品取消勾选，全局全选取消勾选
                        $wholeChexbox.prop("checked", false);
                        $wholeChexbox.next('label').removeClass('mark');
                    }
                })
            })

            //=========每个店铺checkbox与全选checkbox的关系/每个店铺与其下商品样式的变化=========

            //店铺有一个未选中，全局全选按钮取消对勾，若店铺全选中，则全局全选按钮打对勾。
            $shopCheckbox.each(function () {
                $(this).click(function () {
                    if ($(this).is(':checked')) {
                        //判断：店铺全选中，则全局全选按钮打对勾。
                        var len = $shopCheckbox.length;
                        var num = 0;
                        $shopCheckbox.each(function () {
                            if ($(this).is(':checked')) {
                                num++;
                            }
                        });
                        if (num == len) {
                            $wholeChexbox.prop("checked", true);
                            $wholeChexbox.next('label').addClass('mark');
                        }

                        //店铺下的checkbox选中状态
                        $(this).parents('.cartBox').find('.son_check').prop("checked", true);
                        $(this).parents('.cartBox').find('.son_check').next('label').addClass('mark');
                    } else {
                        //否则，全局全选按钮取消对勾
                        $wholeChexbox.prop("checked", false);
                        $wholeChexbox.next('label').removeClass('mark');

                        //店铺下的checkbox选中状态
                        $(this).parents('.cartBox').find('.son_check').prop("checked", false);
                        $(this).parents('.cartBox').find('.son_check').next('label').removeClass('mark');
                    }
                    totalMoney();
                });
            });


            //============每个店铺checkbox与其下商品的checkbox的关系===========

            //店铺$sonChecks有一个未选中，店铺全选按钮取消选中，若全都选中，则全选打对勾
            $cartBox.each(function () {
                var $this = $(this);
                var $sonChecks = $this.find('.son_check');
                $sonChecks.each(function () {
                    $(this).click(function () {
                        if ($(this).is(':checked')) {
                            //判断：如果所有的$sonChecks都选中则店铺全选打对勾！
                            var len = $sonChecks.length;
                            var num = 0;
                            $sonChecks.each(function () {
                                if ($(this).is(':checked')) {
                                    num++;
                                }
                            });
                            if (num == len) {
                                $(this).parents('.cartBox').find('.shopChoice').prop("checked", true);
                                $(this).parents('.cartBox').find('.shopChoice').next('label').addClass('mark');
                            }

                        } else {
                            //否则，店铺全选取消
                            $(this).parents('.cartBox').find('.shopChoice').prop("checked", false);
                            $(this).parents('.cartBox').find('.shopChoice').next('label').removeClass('mark');
                        }
                        totalMoney();
                    });
                });
            });


            //===========商品数量=============
            var dts = [];
            var allarr = [];
            var $plus = $('.plus'),
                $reduce = $('.reduce'),
                $all_sum = $('.sum');
            $plus.click(function () {
                dts = [];
                allarr = [];
                var $inputVal = $(this).prev('input'),
                    $count = parseFloat($inputVal.val())+1,
                    $obj = $(this).parents('.amount_box').find('.reduce'),
                    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
                    $price = $(this).parents('.order_lists').find('.price').html(),  //单价
                    $price = $price.replace(/[^\d.]/g,''),
                    $priceTotal = $count*($price),
                    inventory = $(this).closest('.order_lists').attr('data-cartid'),
                    all_count = parseFloat($(this).closest('.order_arr').attr('data-id')),
                    mz_nid = $(this).closest('.order_lists').attr('data-nid');
                if(parseFloat($inputVal.val()) >=parseFloat(all_count) ){
                    $inputVal = all_count;
                    layer.msg('库存有限，请重新选择')
                    return false;
                }
                $inputVal.val($count);
                $priceTotalObj.html($priceTotal.toFixed(2)+'元');
                if($inputVal.val()>1 && $obj.hasClass('reSty')){
                    $obj.removeClass('reSty');
                }
                var chenks = $(this).closest('.order_lists ').find('.son_check');
                if(chenks.is(':checked')){
                    $('.son_check:checked').each(function(index,item){
                        allarr.push($(item).attr('data-id'))
                    })
                    $('.order_arr ').find('.son_check:checked').each(function(index,item){
                        var a = $(item).attr('data-id');
                        var b = $(item).closest('.order_arr').find('.sum').val();
                        (function (a, b) {
                            dts.push({
                                'id':a,
                                'num':b
                            });
                        })(a, b)
                    })
                    $('#arr_cart').val(JSON.stringify(dts))
                }else{
                    allarr = [];
                    dts = [];
                }
                $.ajax({
                    url:editacr_url,
                    type:'post',
                    data:{
                        id:inventory,
                        nid:mz_nid,
                        num:$count,
                    },
                    success:function(){

                    }
                })
                totalMoney();
            });

            $reduce.click(function () {
                dts = [];
                allarr = [];
                var $inputVal = $(this).next('input'),
                    $count = parseFloat($inputVal.val())-1,
                    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
                    $price = $(this).parents('.order_lists').find('.price').html(),  //单价
                    $price = $price.replace(/[^\d.]/g,''),
                    $priceTotal = $count*($price),
                    inventory = $(this).closest('.order_lists').attr('data-cartid'),
                    mz_nid = $(this).closest('.order_lists').attr('data-nid');
                if($inputVal.val()>1){
                    $inputVal.val($count);
                    $priceTotalObj.html($priceTotal.toFixed(2)+'元');
                }
                if($inputVal.val()==1 && !$(this).hasClass('reSty')){
                    $(this).addClass('reSty');
                }
                var chenks = $(this).closest('.order_lists ').find('.son_check');
                if(chenks.is(':checked')){
                    $('.son_check:checked').each(function(index,item){
                        allarr.push($(item).attr('data-id'))
                    })
                    $('.order_arr').find('.son_check:checked').each(function(index,item){
                        var a = $(item).attr('data-id');
                        var b = $(item).closest('.order_arr').find('.sum').val();
                        (function (a, b) {
                            dts.push({
                                'id':a,
                                'num':b
                            });
                        })(a, b)
                    })
                    $('#arr_cart').val(JSON.stringify(dts))
                }else{
                    allarr = [];
                    dts = [];
                }

                $.ajax({
                    url:editacr_url,
                    type:'post',
                    data:{
                        id:inventory,
                        nid:mz_nid,
                        num:$count,
                    },
                    success:function(){

                    }
                })
                totalMoney();
            });

            $all_sum.keyup(function () {
                var $count = 0,
                    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
                    $price = $(this).parents('.order_lists').find('.price').html(),  //单价
                    $priceTotal = 0,
                    //库存
                    all_count = parseFloat($(this).closest('.order_arr').attr('data-id')),
                    //购物车id
                    inventory = parseFloat($(this).closest('.order_lists').attr('data-cartid')),
                    //规格
                    mz_nid = $(this).closest('.order_lists').attr('data-nid');

                // $(this).val($(this).val().replace(/\D|^0/g,''));
                $count = $(this).val();
                if($count>all_count){
                    $count = all_count;
                }
                if($count==0||$count==''){
                   $count = 1; 
                }
                var reg=/[\u4E00-\u9FA5]/g;
                $price = $price.replace(reg,'');
                $priceTotal = $count*parseFloat($price);
                $(this).attr('value',$count);
                $priceTotalObj.html($priceTotal+'元');
                $.ajax({
                    url:editacr_url,
                    type:'post',
                    data:{
                        id:inventory,
                        nid:mz_nid,
                        num:$count,
                    },
                    success:function(){

                    }
                })
                totalMoney();
            })

            //=========移除商品========

            var $order_lists = null;
            var $order_content = '';
            $('.delBtn').click(function () {
                $order_lists = $(this).parents('.order_lists');
                $order_content = $order_lists.parents('.order_content');
                allarr = [];
                var ss = $(this).closest('.order_lists ').find('.son_check').attr('data-id');
                allarr.push(ss);
                layer.open({
                    content: '是否删除',
                    btn: ['确定', '取消',],
                    yes: function (index, layero) {
                        $.ajax({
                            url:delcart_url,
                            type:'post',
                            data:{"id":allarr},
                            success:function(data){

                                if(data.code==200){

                                    $order_lists.remove();
                                    if($order_content.html().trim() == null || $order_content.html().trim().length == 0){
                                        $order_content.parents('.cartBox').remove();
                                    }
                                    layer.msg('删除成功')
                                    $sonCheckBox = $('.son_check');
                                    totalMoney();
                                    window.location.reload();
                                }
                            }
                        })

                    }
                })

            });

            //=========总计========

            function totalMoney() {
                var total_money = 0;
                var total_count = 0;
                var calBtn = $('.calBtn a');
                var money = 0;
                $sonCheckBox.each(function () {
                    if ($(this).is(':checked')) {
                        var count = parseFloat($(this).closest('.order_lists').find('.sum').val());
                        var price =  parseFloat(($(this).parents('.order_lists').find('.price').html()).replace(/[^\d.]/g,''));

                        money = count*price;
                        total_count += count;
                        total_money += money;

                        $('.total_text').html(total_money.toFixed(2)+'元');
                        $('.piece_num').html(total_count);
                        $(this).parents('.order_lists').find('.sum_price').text(money.toFixed(2)+'元')
                    }
                });
                if(total_money!=0 && total_count!=0){
                    if(!calBtn.hasClass('btn_sty')){
                        calBtn.addClass('btn_sty');
                    }
                }else{
                    if(calBtn.hasClass('btn_sty')){
                        $('.total_text').html(0+'元');
                        $('.piece_num').html(0);
                        calBtn.removeClass('btn_sty');
                    }
                }
            }
            $(document).on('ready',function(){
                totalMoney();
            })
            //去结算
            $('.whole_check').on('click',function(){
                if($(this).is(':checked')){
                    $('.son_check').each(function(index,item){
                        allarr.push($(item).attr('data-id'))
                    })
                    $('.order_arr ').each(function(index,item){

                        var a = $(item).find('.son_check').attr('data-id');
                        var b = $(item).find('.sum').val();
                        (function (a, b) {
                            dts.push({
                                'id':a,
                                'num':b
                            });
                        })(a, b)
                    })
                    $('#arr_cart').val(JSON.stringify(dts))
                }else{
                    allarr = [];
                    dts = [];
                }
            })
            //单个结算
            $('.son_check').on('click',function(){
                dts = [];
                allarr = [];
                    $('.son_check:checked').each(function(index,item){
                        allarr.push($(item).attr('data-id'))
                    })
                    $('.order_arr ').find('.son_check:checked').each(function(index,item){
                        var a = $(item).attr('data-id');
                        var b = $(item).closest('.order_arr').find('.sum').val();
                        (function (a, b) {
                            dts.push({
                                'id':a,
                                'num':b
                            });
                        })(a, b)
                    })
                    $('#arr_cart').val(JSON.stringify(dts))
            });
            //点击失效删除
            $('.loseBtn').on('click',function(){
                var _this = $(this);
                allarr = [];
                var ss = $(this).closest('.order_lists ').find('.shixiao').attr('data-id');
                allarr.push(ss);
                layer.open({
                    content: '是否删除',
                    btn: ['确定', '取消',],
                    yes: function (index, layero) {
                        $.ajax({
                            url:delcart_url,
                            type:'post',
                            data:{"id":allarr},
                            success:function(data){
                                if(data){
                                    layer.msg('删除成功')
                                    _this.closest('.order_lists ').remove();
                                }
                            }
                        })
                    }
                })
            })
            var sxarr = [];
            $('.shixiao').each(function(index,item){
                sxarr.push($(item).attr('data-id'));
            })
            //删除
            $('.remove_goods').on('click',function(){
                if(allarr==''){
                    layer.msg('请选择商品')
                }
                $.ajax({
                    url:delcart_url,
                    type:'post',
                    data:{"id":allarr},
                    success:function(data){

                        if(data.code==200){
                            layer.msg('删除成功')
                            window.location.reload();
                        }
                    }
                })
            })
            //清空
            $('.empty_goods').on('click',function(){
                if($('.shixiao').length==0){
                    layer.msg('没有失效物品')
                    return false;
                }
                layer.open({
                    content: '是否清空',
                    btn: ['确定', '取消',],
                    yes: function(index, layero){
                        $.ajax({
                            url:clearcart_url,
                            type:'post',
                            data:{"id":sxarr},
                            success:function(data){
                                if(data.code==200){
                                    layer.msg('清空成功')
                                    window.location.reload();
                                }
                            }
                        })
                    },
                });

            })
            //去结算
            $(document).on('click','.btn_sty',function(){
               $('#forms').submit();
            })
        })();
    };
    //========================================添加地址======================================================
    exports.manageAddress = function(){
        (function(){
            //修改地址
            var _brnTHis;
            $('.change').on('click',function(){
                var _this = $(this);
                _brnTHis = $(this);
                var user_name =  $(this).closest('.receiver_details_head').find('.user_name').text();
                var phones =  $(this).closest('.receiver_details_head').find('.user_phone').text();
                var user_pr =  $(this).closest('.receiver_details_head').find('.user_pr').text();
                var user_pr_val =  $(this).closest('.receiver_details_head').find('.user_pr').attr('data-id');
                var user_city =  $(this).closest('.receiver_details_head').find('.user_city').text();
                var user_city_val =  $(this).closest('.receiver_details_head').find('.user_city').attr('data-id');
                var user_qu =  $(this).closest('.receiver_details_head').find('.user_qu').text();
                var user_qu_val =  $(this).closest('.receiver_details_head').find('.user_qu').attr('data-id');
                var user_jt =  $(this).closest('.receiver_details_head').find('.user_jt').text();
                $.each($('#provice').find('option'),function(i,n){
                    if(user_pr==$(n).text()){
                        $(this).remove();
                    }
                })
                $.each($('#city').find('option'),function(i,n){
                    if(user_city==$(n).text()){
                        $(this).remove();
                    }
                })
                $.each($('#xian').find('option'),function(i,n){
                    if(user_qu==$(n).text()){
                        $(this).remove();
                    }
                })
                $('#provice').find('option:first-child').text(user_pr);
                $('#provice').find('option:first-child').val(user_pr_val);
                $('#city').find('option:first-child').text(user_city);
                $('#city').find('option:first-child').val(user_city_val);
                $('#xian').find('option:first-child').text(user_qu);
                $('#xian').find('option:first-child').val(user_qu_val);
                $("#m_username").val(user_name);
                $("#m_phone").val(phones);
                $('#textsrea').text(user_jt);
                $('.place_txt').text('修改收货地址')
                $('.change_address').show();
                $('.save_address').hide();
            })
            //点击省份
            $('#provice').on('change',function(){
                var vals = $(this).val();
                $.ajax({
                    url:getarea_url,
                    type:'post',
                    data:{'zipcode':vals},
                    success:function(data){
                            if(data){
                                $('#city').html('');
                                $('#xian').html('');
                                $('#city').append('<option value="">请选择</option>');
                                $('#xian').append('<option value="">请选择</option>');
                                $.each(data,function(i,n){
                                    var html = '<option value="'+data[i].zipcode+'">'+data[i].name+'</option>';
                                    $('#city').append(html)
                                })
                            }
                    }
                })
            })
            //点击市
            $('#city').on('change',function(){
                var vals = $(this).val();
                $.ajax({
                    url:getarea_url,
                    type:'post',
                    data:{'zipcode':vals},
                    success:function(data){
                        if(data){
                            $('#xian').html('');
                            $('#xian').append('<option value="">请选择</option>');
                            $('.area_tip').addClass('none')
                            $.each(data,function(i,n){
                                var html = '<option value="'+data[i].zipcode+'">'+data[i].name+'</option>';
                                $('#xian').append(html)
                            })
                        }
                    }
                })
            })
            //点击县
            $('#xian').on('change',function(){
                $('.area_tip').addClass('none')
            })
            //用户名输入
            $('#m_username').on('change',function(){
                $('.name_tip').addClass('none')
            })
            //电话号码输入
            $('#m_phone').on('change',function(){
                var phone = $(this).val();
                var num = /^1[34578]\d{9}$/;
                if(!num.test(phone)){
                    $('.phone_tip').removeClass('none')
                    $('.phone_tip').text('请输入正确号码')
                }else{
                    $('.phone_tip').addClass('none')
                    $('.phone_tip').text('请输入手机号码')

                }
            })
            //详细地址输入
            $('#textsrea').on('change',function(){
                $('.text_tip').addClass('none')
            })
            var allarr =[];
            var _this;
            //删除地址
            $('.remove').on('click',function(){
                var ids = $(this).closest('.receiver_details').attr('data-id');
                _this = $(this);
                allarr.push(ids)
                for(var i=0;i<allarr.length;i++){
                    ids = allarr[i];
                }
                layer.open({
                    content: '是否删除',
                    btn: ['确定', '取消',],
                    yes: function (index, layero) {
                        $.ajax({
                            url:deladdress_url,
                            type:'post',
                            data:{id:ids},
                            success:function(data){
                                if(data){
                                    layer.msg('删除成功')
                                    if($('.receiver_details').length==1){
                                        $('.receive_addres').remove();
                                        $('.receiver_details').remove();
                                    }else{
                                        _this.closest('.receiver_details').remove();
                                    }

                                }
                            }
                        })
                    }
                })
            })
            //确定按钮，移除商品
            $('.cy_set_default').on('click',function(){
                $(this).toggleClass('mark');
                checkDefault();
            })
            checkDefault();
            function checkDefault(){
                if($('.cy_set_default').hasClass('mark')){
                    $('.set_default_place').attr('checked',true);
                }else{
                    $('.set_default_place').attr('checked',false);
                }
            }
            //设为默认
            $('.set_default_place').on('click',function(){
                var ids = $(this).closest('.receiver_details').attr('data-id');
                    $.ajax({
                        url:setdeault_url,
                        type:'post',
                        data:{id:ids},
                        success:function(data){
                            if(data!=0){
                                layer.msg('设置成功')
                                window.location.reload();
                            }
                        }
                    })
            })
            //保存地址
            $('.save_address').on('click',function(){
                if($('.receiver_details').length>9){
                    layer.msg('地址太多，请删除一些')
                    return false;
                }
                var username= $("#m_username").val();
                var phone = $("#m_phone").val();
                var texts = $('#textsrea').val();
                var user_pr = $('#provice').find('option:selected').text();
                var user_city =  $('#city').find('option:selected').text();
                var user_qu =  $('#xian').find('option:selected').text();
                if(username==''){
                    $('.name_tip').removeClass('none')
                    return false;
                }if(phone==''){
                    $('.phone_tip').removeClass('none')
                    return false;
                }
                if(texts==''){
                    $('.text_tip').removeClass('none')
                    return false;
                }
                if(user_city=='城市/地区'||user_city=='请选择'){
                    $('.area_tip').removeClass('none')
                    $('.area_tip').text('请选择所在地址')
                    return false;
                }
                var num = /^1[34578]\d{9}$/;
                if(!num.test(phone)){
                    $('.phone_tip').removeClass('none')
                    $('.phone_tip').text('请输入正确号码')
                    return false;
                }

                $.ajax({
                    url:addaddress_url,
                    type:'post',
                    data:{
                        'province_id': $("#provice").val(),
                        'city_id': $("#city").val(),
                        'xian_id': $("#xian").val(),
                        'name': $("#m_username").val(),
                        'phone':$("#m_phone").val(),
                        'address':$("#textsrea").val(),
                        'status':$('#m_status').is(':checked')?1:0
                    },
                    success:function(data){
                        if(data){
                            layer.msg('保存成功')
                            window.location.reload();
                        }
                    }
                })
            })
            //修改地址
            $('.change_address').on('click',function(){
                var ids = _brnTHis.closest('.receiver_details').attr('data-id');

                var username= $("#m_username").val();
                var phone = $("#m_phone").val();
                var texts = $('#textsrea').val();
                var user_pr = $('#provice').find('option:selected').text();
                var user_city =  $('#city').find('option:selected').text();
                var user_qu =  $('#xian').find('option:selected').text();
                if(username==''){
                    $('.name_tip').removeClass('none')
                    return false;
                }
                if(phone==''){
                    $('.phone_tip').removeClass('none')
                    return false;
                }
                if(texts==''){
                    $('.text_tip').removeClass('none')
                    return false;
                }
                if(user_city=='城市/地区'||user_city=='请选择'){
                    $('.area_tip').removeClass('none')
                    $('.area_tip').text('请选择所在地址')
                    return false;
                }
                var num = /^1[34578]\d{9}$/;
                if(!num.test(phone)){
                    $('.phone_tip').removeClass('none')
                    $('.phone_tip').text('请输入正确号码')
                    return false;
                }

                $.ajax({
                    url:editaddress_url,
                    type:'post',
                    data:{
                        'id':ids,
                        'province_id': $("#provice").val(),
                        'city_id': $("#city").val(),
                        'xian_id': $("#xian").val(),
                        'name': $("#m_username").val(),
                        'phone':$("#m_phone").val(),
                        'address':$("#textsrea").val(),
                        'status':$('#m_status').is(':checked')?1:0
                    },
                    success:function(data){
                        if(data){
                            layer.msg('修改成功')
                            window.location.reload();
                        }
                    }
                })
            })
            var address_wrap = $('.address_wrap').height();
            $('.g-bysb150').css({'height':address_wrap});
        })();
    };
    //========================================衍生页面======================================================

    exports.yanSheng = function(){
        (function(){
            //轮播
            var mySwiper = new Swiper('.swiper-container',{
                pagination : '.swiper-pagination',
                direction: 'vertical',
                autoplay:5000,
                loop:true,
                prevButton:'.swiper-button-prev',
                nextButton:'.swiper-button-next',
                simulateTouch: true,
                paginationClickable :true,
                progress: true,
                onProgressChange: function(swiper) {
                    for (var i = 0; i < swiper.slides.length; i++){    
                         var slide = swiper.slides[i];    
                         var progress = slide.progress;    
                         var translate = progress*swiper.width;      
                         var opacity = 1 - Math.min(Math.abs(progress),1);    
                         slide.style.opacity = opacity;    
                         swiper.setTransform(slide,'translate3d('+translate+'px,0,0)');    
                       } 
                },
                onSetWrapperTransition: function(swiper, speed) {
                    for (var i = 0; i < swiper.slides.length; i++){
                      swiper.setTransition(swiper.slides[i], speed);  
                    }
                }
            })
            $('.swiper-button-prev').on('click',function(){
                mySwiper.swipePrev();
            })
            $('.swiper-button-next').on('click',function(){
                mySwiper.swipeNext();
            })
            $('.swiper-container').hover(function(){
                $('.swiper-button-prev').toggle();
                $('.swiper-button-next').toggle();
            })
        })();
    };
    //========================================退款通过======================================================
    exports.approve = function(){
        (function(){
            //提交以及验证
            $('#submit').on('click',function(){
                var company = $('.company').val();
                var number = $('.moer_tui').val();
                var introduce =  $('.mz_introduce').val();
                if(!company){
                    $('.company_tip').removeClass('none');
                    return false;
                }else{
                    $('.company_tip').addClass('none');
                }
                if(!number){
                    $('.money_tip').removeClass('none');
                    return false;
                }else{
                    $('.money_tip').addClass('none');
                }
                if(introduce.length>500){
                    $('.introduce_tip').removeClass('none');
                    return false;
                }else{
                    $('.introduce_tip').addClass('none');
                }
                $.ajax({
                    url:wuliu_url,
                    type:'post',
                    data:{
                        'company':company,
                        'number':number,
                        'introduce':introduce
                    },
                    success:function(data){
                        if(data.code==200){
                            layer.msg('成功')
                            window.location.reload();
                        }
                    }
                })
            })
            $('.repeal').on('click',function(){
                layer.open({
                    icon:2,
                    content: '撤销申请后，不能再次申请退款，您确定撤销申请吗?',
                    btn: ['确定', '取消',],
                    yes: function (index, layero) {
                       window.location = url;
                    }
                })
            })

        })();
    };
    //========================================申请退款======================================================
    exports.appplyRefund = function(){
        (function(){
            var qn = 0;
            var _upload_button;
            var arr = $(".text_hide").val();
            if(arr){
                arr = JSON.parse(arr);
            }else{
                arr = [];
            }

            $('.add_lis').on('click',function(){
                _upload_button = $(this);
                $('#pickfiles').click();
                if($(this).closest('.goods_text2').find('.lisss').length==3){
                    $(this).hide();
                }
                return false;
            })
            //七牛
            imageUPload('pickfiles',qiniu_token_url,function(sourceLink){
                var htmls = '<li class="lisss">'+
                    '<em class="none"><img src="'+png+'"></em>'+
                    '<img src="'+sourceLink+'">'+
                    '</li>';
                var lengths = _upload_button.closest('.addImg').find('.lisss').length+1;
                if(lengths>3){
                    layer.msg('图片超过限制')
                    return false;
                }else{
                    _upload_button.before(htmls);
                }
                arr.push(sourceLink);
                _upload_button.closest('#forms_re').find('.text_hide').text(JSON.stringify(arr))
            })
            //点击减少
            var mz_service = $("#mz_service_num").val();
            var mz_feight = Number($("#mz_feight").val());
            $('.reduce').on('click',function(){
                var txt = $('.count').text();
                var val = $('.moer_tui').val();
                var price = $('.price').text();
                txt = txt-1;
                if(txt<1){
                    txt=1;
                }
                val = txt*price;
                if(mz_service=1){
                    val = txt*price+mz_feight;
                }
                $('.count').text(txt);
                $("input[name='count']").val(txt);
                // $('.moer_tui').val(val);
            })
            //点击增加
            $('.add').on('click',function(){
                var txt = parseFloat( $('.count').text());
                var val = $('.moer_tui').val();
                var price = $('.price').text();
                txt = txt+1;
                if(txt>more){
                    txt=more;
                }
                val = txt*price;
                if(mz_service=1){
                    val = txt*price+mz_feight;
                }
                $('.count').text(txt);
                $("input[name='count']").val(txt);
                // $('.moer_tui').val(val);
            })
            //退款说明
            $('.rebate').hover(function(){
                $('.rebate_wrap').toggleClass('none')
            })
            $(document).on('mouseenter','.lisss',function(){
                $(this).find('em').removeClass('none');
            })
            $(document).on('mouseleave','.lisss',function(){
                $(this).find('em').addClass('none');
            })
            //点击删除图片
            $(document).on('click','.lisss em',function(e){
                qn = $(this).closest('li').index();

                var txt = $('.text_hide').text();
                var imgs = $(this).closest('.lisss').find('img:nth-child(2)').attr('src');
                var arrss=JSON.parse( txt.split(",") );
                function indexOf(val){
                    for(var i = 0; i < arrss.length; i++){
                        if(arrss[i] == val){
                            return i;
                        }
                    }
                }
                function remove(val){
                    var index = indexOf(val);
                    if(index > -1){
                        arrss.splice(index,1);
                    }
                }
                remove(imgs)
                $('.text_hide').text(JSON.stringify(arrss))
                arr = [];
                for(var i = 0; i < arrss.length; i++){
                    arr.push(arrss[i]);
                }
                $(this).closest('li').remove();
                window.event? window.event.cancelBubble = true : e.stopPropagation();
                return false;
            })
            //点击提交
            $('#submit').on('click',function(){
                $('.addImg').each(function(index,item){
                    var imgs =  $(item).find('img').attr('src');
                     $('.images').push(imgs);
                })
                money = $(".price").html()*$(".count").html();
                if(mz_service=1){
                    money = $(".price").html()*$(".count").html()+mz_feight;
                }

                var validate = $("#forms_re").validate({
                    rules:{
                        money:{
                            required:true,
                            range:[0,money]
                        },
                        yuanyin:{
                            required:true
                        },
                        introduce:{
                            required:true
                        },
                    },
                    messages:{
                        money:{
                            required:'请输入退款金额',
                            range:'退款超出金额'
                        },
                        yuanyin:{
                            required:'请输入退款原因'
                        },
                        introduce:{
                            required:'请输入退款说明'
                        },
                    }
                })
                $("#forms_re").submit();
            })

        })();
    };
    exports.shopComment = function(){
        (function(){

        })();
    };
    //========================================申请退款======================================================
    exports.writeCommont = function(){
        (function(){
            var _upload_button;
            var arr = [];
            //点击添加图片
            $('.add_lis').on('click',function(){
                _upload_button = $(this);
                $('#pickfiles').click();
                if($(this).closest('.goods_text2').find('.lisss').length==9){
                    $(this).hide();
                }
                return false;
            })
            //七牛上传
            imageUPload('pickfiles',qiniu_token_url,function(sourceLink){
                var htmls = '<li class="lisss">'+
                    '<em class="none"><img src="'+png+'"></em>'+
                    '<img src="'+sourceLink+'">'+
                    '</li>';
                var lengths = _upload_button.closest('.addImg').find('.lisss').length+1;
                if(lengths>9){
                    layer.msg('超过限制张数，请重新上传')
                    return false;
                }else{
                    _upload_button.before(htmls);
                }
                if(lengths>=9){
                    $('.add_lis').hide();
                }else{
                   $('.add_lis').show(); 
                }

                _upload_button.closest('.addImg').find('.color_fen_all').text(lengths);
                _upload_button.closest('.addImg').find('.color_fen_rest').text(9-lengths);
                arr.push(sourceLink);
                _upload_button.closest('.goods_text2').find('.text_hide').text(JSON.stringify(arr))
            })
            //星星打分
            $('.goods_score i').on('click',function(){
                $(this).addClass('on');
                $(this).nextAll().removeClass('on')

                if($(this).index()==0){
                    $(this).closest('.goods_score').find('.star_txt').text('1星失望')
                }
                if($(this).index()==1){
                    $(this).closest('.goods_score').find('.star_txt').text('2星一般')
                }
                if($(this).index()==2){
                    $(this).closest('.goods_score').find('.star_txt').text('3星不错')
                }if($(this).index()==3){
                    $(this).closest('.goods_score').find('.star_txt').text('4星满意')
                }if($(this).index()==4){
                    $(this).closest('.goods_score').find('.star_txt').text('5星惊喜')
                }
                $(this).closest('.goods_text2').find('.hidden').val($(this).index()+1);
                return false;
            })
            $('.goods_score i').on('mouseenter',function(){
                $(this).addClass('on')
                $(this).prevAll().addClass('on')
                $(this).nextAll().removeClass('on');
                if($(this).index()==0){
                    $(this).closest('.goods_score').find('.star_txt').text('1星失望')
                }
                if($(this).index()==1){
                    $(this).closest('.goods_score').find('.star_txt').text('2星一般')
                }
                if($(this).index()==2){
                    $(this).closest('.goods_score').find('.star_txt').text('3星不错')
                }if($(this).index()==3){
                    $(this).closest('.goods_score').find('.star_txt').text('4星满意')
                }if($(this).index()==4){
                    $(this).closest('.goods_score').find('.star_txt').text('5星惊喜')
                }
                $(this).closest('.goods_text2').find('.hidden').val($(this).index()+1)
                leave();
            })
            leave();
            function leave(){
                $('.goods_score i').on('mouseleave',function(){
                    $(this).prevAll().addClass('on');
                    $(this).addClass('on');
                    if($(this).index()==0){
                        $(this).closest('.goods_score').find('.star_txt').text('1星失望')
                    }
                    if($(this).index()==1){
                        $(this).closest('.goods_score').find('.star_txt').text('2星一般')
                    }
                    if($(this).index()==2){
                        $(this).closest('.goods_score').find('.star_txt').text('3星不错')
                    }if($(this).index()==3){
                        $(this).closest('.goods_score').find('.star_txt').text('4星满意')
                    }if($(this).index()==4){
                        $(this).closest('.goods_score').find('.star_txt').text('5星惊喜')
                    }
                    $(this).closest('.goods_text2').find('.hidden').val($(this).index()+1);
                })
            }
            //验证
            $('.shop_provice').bind('input propertychange', function(){
                $(this).each(function(index,item){
                    var txt = 1000-$(item).val().length;
                    var htmls = '还可输入<em>'+txt+'</em>字';
                    if($(item).val().length<=5){
                        $(item).closest('.write_area').find('.tip').text('至少填写5个字');
                    }else{
                        $(item).closest('.write_area').find('.tip').html(htmls)
                    }
                })
                
            })
            var qn = 0;
            //鼠标移入删除
            $(document).on('mouseenter','.lisss',function(){
                $(this).find('em').removeClass('none');
            })
            $(document).on('mouseleave','.lisss',function(){
                $(this).find('em').addClass('none');
            })
            //点击删除
            $(document).on('click','.lisss em',function(e){
                qn = $(this).closest('li').index();
                var lengths= $(this).closest('.addImg').find('.lisss').length-1;
                if(lengths<9){
                    $('.add_lis').show();
                }
                $(this).closest('.addImg').find('.color_fen_all').text(lengths);
                $(this).closest('.addImg').find('.color_fen_rest').text(9-lengths);
                var txt = $(this).closest('.goods_text2').find('.text_hide').text();
                var imgs = $(this).closest('.lisss').find('img:nth-child(2)').attr('src');
                var arrss=JSON.parse( txt.split(",") );
                function indexOf(val){
                    for(var i = 0; i < arrss.length; i++){
                        if(arrss[i] == val){
                            return i;
                        }
                    }
                }
                function remove(val){
                    var index = indexOf(val);
                    if(index > -1){
                        arrss.splice(index,1);
                    }
                }
                remove(imgs)
                $(this).closest('.goods_text2').find('.text_hide').text(JSON.stringify(arrss))
                $(this).closest('li').remove();
                window.event? window.event.cancelBubble = true : e.stopPropagation();
                return false;
            })
            //提交
            $('#sumits').on('click',function(){
                var submit_mz = true;
                $('.shop_provice').each(function(index,item){
                    if($(item).val().length<5){
                        layer.msg('请输入至少5个字')
                        submit_mz = false;
                        return false;
                    }
                    if($(item).val().length>999){
                        layer.msg('请输入最多一千个字')
                        submit_mz = false;
                        return false;
                    }
                    if($(item).val()==''){
                        layer.msg('请输入商品评价')
                        submit_mz = false;
                        return false;
                    }
                })

                if(submit_mz){
                    $('#forms').submit();
                }

            })

        })();
    };
 //========================================我的订单======================================================
    exports.myorders = function() {
        (function(){
                    $('.replace').on('click',function(){
                        mz_oid = $(this).attr('data-id');
                        layer.open({
                            content: '确定取消订单吗？',
                            btn: ['确定', '取消',],
                            yes: function (index, layero) {
                                window.location = url+"?id="+mz_oid;
                            }
                        })
                    });
                    //删除单个
                    $('.act-hd').find('.rabbage').on('click',function(){
                        var ids =$(this).attr('data-id');
                        var key =$(this).attr('data-key');
                        layer.open({
                            content: '确定删除订单吗？',
                            btn: ['确定', '取消',],
                            yes: function(index, layero){
                                $.ajax({
                                    url:orderhandle_url,
                                    type:'post',
                                    data:{oid:ids,key:key},
                                    success:function(data){
                                        if(data.code==200){
                                            layer.msg('删除成功')
                                            window.location.reload();
                                        }
                                    }
                                })
                            },
                        });
                    });
                    //永久删除订单
                    $(document).on('click','.delorder_yj',function(){
                        var ids =$(this).attr('data-id');
                        var key =$(this).attr('data-key');
                        layer.open({
                            icon: 2,
                            content: '确定永久删除订单吗？永久删除后您将无法再查看该订单，也无法进行售后处理，请谨慎操作！',
                            btn: ['确定', '取消',],
                            yes: function (index, layero) {
                                $.ajax({
                                    url:orderhandle_url,
                                    type:'post',
                                    data:{oid:ids,key:key},
                                    success:function(data){
                                        if(data.code==200){
                                            layer.msg('删除成功')
                                            window.location.reload();
                                        }
                                    }
                                })
                            }
                        })
                    });
                    //还原订单
                    $(document).on('click','.recorder',function(){
                        var ids =$(this).attr('data-id');
                        var key =$(this).attr('data-key');
                        $.ajax({
                            url:orderhandle_url,
                            type:'post',
                            data:{oid:ids,key:key},
                            success:function(data){
                                if(data.code==200){
                                    layer.msg('还原成功');
                                    window.location.reload();
                                }
                            }
                        })
                    });
                })();
            };
             exports.myorders = function() {
                 (function(){
                    /* 
        * @Author: Marte
        * @Date:   2018-02-01 09:33:43
        * @Last Modified by:   Marte
        * @Last Modified time: 2018-02-02 14:57:19
        */

        $(function(){
            // 售价初始化
            var price = parseFloat($('#goodsprice').text());
            $('#goodsprice').text(price.toFixed(2));
            // 初始化颜色规格id
            var postdata = {
                    'goods_id':goods_id,
                    'color_id': '',
                    'norms_id':'',
                    'goods_num':1,
                    'uid':uid
            };


            //星星打分
            $.fn.raty.defaults.path = star_img;
            $('#function-demo').raty({
                number: 5, //多少个星星设置
                targetType: 'hint', //类型选择，number是数字值，hint，是设置的数组值
                path: star_img,
                hints: ['差', '一般', '好', '非常好', '全五星'],
                size: 200,
                readOnly:true,
                starHalf: 'ban_star.png',
                starOff: 'star_dark.png',
                starOn: 'start_light.png',
                target: '#function-hint',
                score:function(){
                    return star_count;
                }
            });


            //商品预售
            var timer = setInterval(function(){
                currtime--;
                if(currtime<=0){
                    $('#end_yushou').html("商品预售已结束。");
                    clearInterval(timer);
                }else {
                    var timestring = timeStamp(currtime);
                    $('#timestring').html(timestring);
                }
            },1000);


            // 点击颜色图片
            $('#swiper-smallimg').click(function () {
                $(".color_bigPic").hide();
            });


            //选择颜色和规格
            var selectCN = function(){
                // $(this).siblings().removeClass('active');
                // $(this).addClass('active');
                if($(this).attr('class').indexOf('selectColor')>=0){
                    postdata['color_id'] = $(this).attr('data-id');
                    $(".color_bigPic").css("background-image", "url("+$(this)[0].src+")");
                    
                }
                if($(this).attr('class').indexOf('selectNorm')>=0){
                    postdata['norms_id'] = $(this).attr('data-id');
                };
                
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $('.storagenum').text(num_all);
                    if($(this).attr('class').indexOf('selectColor')>=0){
                        postdata['color_id'] ='';
                        $(".color_bigPic").hide();
                    }
                    if($(this).attr('class').indexOf('selectNorm')>=0){
                         postdata['norms_id'] ='';
                    }
                }else{
                    $(".color_bigPic").show();
                   $(this).addClass('active'); 
                   $(this).siblings().removeClass('active');
                   if( postdata['color_id'] &&  postdata['norms_id']){
                     getpriceajax();
                   }
                }
            }


            // 颜色规格ajax
            var getpriceajax = function (){
                $.post(getpriceurl,{
                    color_id:postdata['color_id'],
                    norms_id:postdata['norms_id'],
                    goods_id:postdata['goods_id']
                },function(data){
                    var price = data['price'];
                    var stock = data['stock'];
                    $('#goodsprice').text(price.toFixed(2));
                    $('.operation .storagenum').text(stock);
                    $('.operation .goods_st_h').val(stock);
                    if(stock<=0){
                     $('.nnum').val('0');
                     $('.storagenum').text('0');
                     $('.cut').addClass('not_allowed');
                     $('.nnum').addClass('not_allowed');
                     $('.add').addClass('not_allowed');
                    }else{
                     $('.nnum').val('1');
                     $('.cut').removeClass('not_allowed');
                     $('.nnum').removeClass('not_allowed');
                     $('.add').removeClass('not_allowed');
                    }
                    $('.storagenum').text(parseInt($('.operation .goods_st_h').val())-parseInt($('.operation .nnum').val()));
                })
            };


            // 点击颜色规格
            $('.selectColor').click(selectCN);
            $('.selectNorm').click(selectCN);
            $('.storagenum').text(parseInt($('.operation .goods_st_h').val())-parseInt($('.operation .nnum').val()));



            //添加减少购买数量
            var oAddCut = function(){
                var currnum = parseInt($('.operation .nnum').val());
                var storagenum = parseInt($('.operation .storagenum').text());
                var storagenum_b = parseInt($('.operation .goods_st_h').val());
                if($(this).attr('class').indexOf('add')>=0 && storagenum>0){
                    if(currnum>storagenum_b){
                        currnum = storagenum_b-currnum
                    }else{
                        currnum++;
                        storagenum=storagenum_b-currnum;
                    }
                }
                if($(this).attr('class').indexOf('cut')>=0 && storagenum>=0){
                    // if(storagenum =storagenum_b ){
                    //         currnum=1;
                    if(currnum<=1){
                        currnum=1;
                    }else{
                        currnum--;
                        storagenum=storagenum_b-currnum;
                    }
                }

                $('.operation .storagenum').text(storagenum);
                postdata['goods_num']=currnum;
                $('.operation .nnum').val(currnum)
            };


            // 数量输入框输入
            function numCHange(){
                var currnum = parseInt($('.operation .nnum').val());//输入框个数
                var storagenum = parseInt($('.operation .storagenum').text());  //剩余
                var storagenum_b = parseInt($('.operation .goods_st_h').val());//总数
                if($('.operation .nnum').val()==''){
                    currnum = 1;
                }
                if(currnum == storagenum_b){
              
                    currnum = storagenum_b;
                }
                if(currnum>storagenum_b){
                 
                    currnum = storagenum;
                    storagenum=storagenum_b-currnum;
                }
                
                if(currnum<=1){
                    currnum = 1;
                    storagenum=storagenum_b-currnum;
                }

                storagenum=storagenum_b-currnum;

                $('.operation .storagenum').text(storagenum);
                postdata['goods_num']=currnum;
                $('.operation .nnum').val(currnum)
            }


           //点击减少增加数量 输入框输入数量 
            $('.operation .add').click(oAddCut);
            $('.operation .cut').click(oAddCut);
            $('.operation .nnum').change(numCHange);


            //立即预定按钮
            $(document).click(function(){
                $('.ydbtn .message').hide();
            })

            // 点击抢购方法
            var reserveSubmit = function(e){
                e.stopPropagation();
                if(currtime <0){
                   $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('商品预售已结束')
                    return false; 
                }
                var currnum = parseInt($('.operation .nnum').val());
                var storagenum =parseInt($('.operation .goods_st_h').val());

                if(!postdata['color_id']){
        //                $('.ydbtn .message').show();
        //                $('.ydbtn .tmessage').text('请选择款式');
                    $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('请选择颜色')
                    return false;
                }
                if(!postdata['norms_id']){
        //                $('.ydbtn .message').show();
        //                $('.ydbtn .tmessage').text('请选择尺码');
                    $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('请选择规格')
                    return false ;
                }
                if(currnum-storagenum>0){
        //                $('.ydbtn .message').show();
        //                $('.ydbtn .tmessage').text('商品数量超过库存');
                    $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('商品数量超过库存');
                    $('.goods_mask_tsmr').css('background-position','108px center');
                    $('.goods_mask_tsmr').css('text-indent','36px');
                    return false;
                }
                $("input[name='goods_id']").val(postdata['goods_id']);
                $("input[name='color_id']").val(postdata['color_id']);
                $("input[name='norms_id']").val(postdata['norms_id']);
                $("input[name='goods_num']").val(postdata['goods_num']);
            };
            //点击抢购
            $('.btn1').click(reserveSubmit)



           // 点击购买方法
            var offset=$('.rightFloat_shoppingCart').offset();
            var ds = function(e){
                var num =1;
                var addcar=$(this);
                e.stopPropagation();
                if(currtime <0){
                   $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('商品预售已结束')
                    return false; 
                }
                if(postdata['uid']<1){
                    window.location.href=login_url;
                    return false;
                }
                if(!postdata['color_id']){
                    $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('请选择颜色')
                    return false;
                }
                if(!postdata['norms_id']){
                    $('.goods_mask').show();
                    $('.goods_mask_ts').show();
                    $('.goods_mask_tsmr em').text('请选择规格')
                    return false ;
                }
                var color_id_c= $('.cimgs').find('.active').attr('data-id');
                var norms_id_c = $('.sml').find('.active').attr('data-id');
                var goods_num_c = $('.nnum').val();
                var goods_id_c = postdata['goods_id'];
                $.ajax({
                    url:shop_cart_url,
                    type:'post',
                    data:{"color_id":color_id_c,"norms_id":norms_id_c,"goods_num":goods_num_c,"goods_id":goods_id_c},
                    success:function(data){
                        if(data.code==200){
                            $('.goods_mask').show();
                            $('.goods_mask_ts').show();
                            $('.goods_mask_tsmr em').text('加入购物车成功！');
                            $('.shoppingCart_count').text(data.carnum);
                        }
                    }
                })
            }
        //        点击购买
            $('.btn2').click(ds)



           
            //预售倒计时     时间戳 转 月日时分秒   
            function timeStamp( second_time ){
                var time = parseInt(second_time) + "秒";
                if( parseInt(second_time )> 60){

                    var second = parseInt(second_time) % 60;
                    var min = parseInt(second_time / 60);
                    time = min + "分" + second + "秒";

                    if( min > 60 ){
                        min = parseInt(second_time / 60) % 60;
                        var hour = parseInt( parseInt(second_time / 60) /60 );
                        time = hour + "小时" + min + "分" + second + "秒";

                        if( hour > 24 ){
                            hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                            var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                            time = day + "天 " + hour + "小时 " + min + "分 " + second + "秒";
                        }
                    }
                }
                return time;
            }



            //鼠标移上预售事件
            $('.rule').hover(function(){
                $('.book_rule').toggle();
            })



            var foot_height;
            setTimeout(function(){
                foot_height = document.body.scrollHeight;
            },500)
            //scroll 事件 商品详情吸顶
            $(window).scroll(function() {
                console.log(foot_height)
                var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
                if(scrolltop>=(document.body.scrollHeight-800)){
                    $(".d_leftBox").css('bottom','250px')

                }else{
                    $(".d_leftBox").css('bottom','50px')
                }
               if(scrolltop>792){
                   $('.x_buy_fix').addClass('tops')
               }else{
                   $('.x_buy_fix').removeClass('tops')
               }
               if(scrolltop>foot_height-1000){
                $('.shop2_rightFloat').hide();
               }else{
                    $('.shop2_rightFloat').show();
               }
            });



            //提示框弹层js
            $('.goods_mask_tstr').click(function(){
                $('.goods_mask').hide();
                $('.goods_mask_ts').hide();
            });
            $('.goods_mask_tsbb').click(function(){
                $('.goods_mask').hide();
                $('.goods_mask_ts').hide();
            });
            $('.x_buy_fixl span').on('click',function(){
                $(this).addClass('detaikl_color').siblings().removeClass('detaikl_color')
            })


            // 点击商品详情  评价晒单
            var sd_height = 0;
            var xq_height = 0;
            setTimeout(function(){
                sd_height = $('#comment_header').offset().top-200;
            },500)
            xq_height = $('.viewDetails_botlb').offset().top-200;
            $('.appris_dan').on('click',function(){
                $('body,html').animate({scrollTop:sd_height},500);
            })



            // 鼠标移上侧边二维码
            $('.shop_detail').on('click',function(){
                $('body,html').animate({scrollTop:xq_height},500);
            })
            $('.rightFloat_phone').hover(function(){
                $(this).find('.ewm').show();
            },function(){
                $(this).find('.ewm').hide();
            });



            //点击回到顶部 
            $(document).on('click','.rightFloat_toTop',function(){
                $('body,html').animate({scrollTop:0},500);
            })
            $('.ps-current ul li').on('click',function(){
                $(this).closest('.ps-current').hide();
            })
            $('.ps-prev,.ps-next').on('click',function(e){
                window.event? window.event.returnValue = false : e.preventDefault();
            })
            $('.ps-list').on('click',function(){
                $('.ps-current').show();
            })



        //      分页
            $(".page").Page({
                totalPages:all_page,
                liNums: 5,
                activeClass: 'activP',
                firstPage: '首页',
                lastPage: '末页',
                prv: '上一页',
                next: '下一页',
                callBack : function(page){
                    $.ajax({
                        url:page_url,
                        type:'post',
                        data:{"id":goods_id,"page":page},
                        success:function(data){
                            if(data.code==200){
                                $(".comment_ul").html("");
                                var count = data.list;
                                $("#pictureBox").html(html);
                                $('.pgwSlideshow').pgwSlideshow();

                                for(var j=0;j<count.length;j++){
                                    var html = '<div class="comment_li clearfix">' +
                                        '<div class="comment_li_avatar">' +
                                        '<a href="" style="background-image: url(' + count[j].avatar + ');"></a>' +
                                        '<div class="yxk_user">' + count[j].username + '</div>' +
                                        '</div>' +
                                        '<div>' +
                                        '<div class="comment_li_content clearfix">' +
                                        '<div class="li_content_stars clearfix">' +
                                        star_loop(count[j].mark)+
                                        '</div>' +
                                        '<div class="li_content_comment">' + count[j].content + '</div>' +
                                        lunbos(count[j].img)+
                                        '<div class="li_content_date">' + count[j].created_at +
                                        '</div>' +
                                        '</div>';
                                    if (count[j].channel == 3) {
                                        html = '<div class="comment_li clearfix">' +
                                            '<div class="comment_li_avatar">' +
                                            '<a href="" style="background-image: url(' + count[j].avatar + ');"></a>' +
                                            '<div class="yxk_user">' + count[j].username + '</div>' +
                                            '</div>' +
                                            '<div>' +
                                            '<div class="comment_li_content clearfix">' +
                                            '<div class="li_content_stars clearfix">' +
                                            star_loop(count[j].mark)+
                                            '</div>' +
                                            '<div class="li_content_comment">' + count[j].content + '</div>' +
                                            lunbos(count[j].img)+
                                            '<div class="li_content_date">' + count[j].created_at + '<span>来自<a href="" target="_blank">游侠客APP</a></span></div>' +
                                            '</div>' +
                                            '</div>';
                                    }
                                    if (count[j].reply.content !== undefined) {
                                        html = '<div class="comment_li clearfix">' +
                                            '<div class="comment_li_avatar">' +
                                            '<a href="" style="background-image: url(' + count[j].avatar + ');"></a>' +
                                            '<div class="yxk_user">' + count[j].username + '</div>' +
                                            '</div>' +
                                            '<div>' +
                                            '<div class="comment_li_content clearfix">' +
                                            '<div class="li_content_stars clearfix">' +
                                            star_loop(count[j].mark)+
                                            '</div>' +
                                            '<div class="li_content_comment">' + count[j].content + '</div>' +
                                            lunbos(count[j].img)+
                                            '<div class="li_content_date">'+count[j].created_at+
                                            '<div class="pingjia">' +
                                            '<p>' + '<em class="">游小侠 回复：</em>' + count[j].reply.content + '</p>' +
                                            '<p>' + count[j].reply.created_at + '</p>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>';
                                    }
                                    if(count[j].channel == 3 && count[j].reply.content !== undefined){
                                        html = '<div class="comment_li clearfix">' +
                                            '<div class="comment_li_avatar">' +
                                            '<a href="" style="background-image: url('+count[j].avatar+');"></a>' +
                                            '<div class="yxk_user">'+count[j].username+'</div>'+
                                            '</div>'+
                                            '<div>' +
                                            '<div class="comment_li_content clearfix">'+
                                            '<div class="li_content_stars clearfix">'+
                                            star_loop(count[j].mark)+
                                            '</div>'+
                                            '<div class="li_content_comment">'+count[j].content+'</div>'+
                                            lunbos(count[j].img)+
                                            '<div class="li_content_date">'+count[j].created_at+'<span>来自<a href="" target="_blank">游侠客APP</a></span></div>'+
                                            '<div class="pingjia">'+
                                            '<p>'+'<em class="">游小侠 回复：</em>'+count[j].reply.content+'</p>'+
                                            '<p>'+count[j].reply.created_at+'</p>'+
                                            '</div>'+
                                            '</div>'+
                                            '</div>';
                                    }
                                    $(".comment_ul").append(html);
                                    nameStar();
                                }
                            }
                        }
                    })
                }
            });


            
            // 名字加星显示
            nameStar();
            function nameStar(){
              $('.yxk_user').each(function(index,item){
                    var name = $(item).text().replace(/(.{1}).*(.{1})/,"$1**$2");
                    $(item).text(name)
             })  
            }




            //循环星星
            function star_loop(num) {
                var html_star = "";
                for(var j=0;j<num;j++){
                    html_star += '<div class="star"></div>';
                }
                for(var j=0;j<(5-num);j++){
                    html_star += '<div class="stardark"></div>';
                }
                return html_star;
            }




            // 轮播
            function lunbos(imgs){
                var lunbohtml = '';
                if(!imgs){
                    return lunbohtml;
                }
                lunbohtml = '<div class="lunbo">'+
                    '<ul class="zy_uls clearfix">'+
                    loop_img(imgs)+
                    '</ul>'+
                    '<div class="cy_banner">'+
                    '<ul class="cy_lus clearfix">'+
                    '<div class="cy_imgs">'+
                    loop_img(imgs)+
                    '</div>'+
                    '</ul>'+
                    '<strong class="bt1"></strong>'+
                    ' <strong class="bt2"></strong>'+
                    ' </div>'+
                    ' </div>';
                return lunbohtml;
            }
            //   轮播
            function loop_img(num) {
                var html_star = "";
                for(var m=0;m<num.length;m++){
                    html_star += '<li><img src="'+num[m]+'"></li>';
                }
                return html_star;
            }
            //轮播
            var lbindex = 0;
            var lengths  ;
            $(document).on('click','.zy_uls li',function(){
                var count = $(this).index();
                lbindex = $(this).index();
                $(this).closest('.lunbo').find('.cy_banner').show();
                $(this).addClass('on').siblings().removeClass('on');
                $(this).closest('.lunbo').find('.cy_lus li').eq(count).addClass('block').siblings().removeClass('block');
            })

            $(document).on('click','.bt2',function(){
                lbindex++;
                lengths  = $(this).closest('.lunbo').find('.zy_uls li').length;
                if(lbindex>lengths-1){
                    lbindex=0;
                }
                $(this).closest('.lunbo').find('.zy_uls li').eq(lbindex).addClass('on').siblings().removeClass('on');
                $(this).closest('.lunbo').find('.cy_lus li').eq(lbindex).addClass('block').siblings().removeClass('block')
            })

            $(document).on('click','.bt1',function(){
                lbindex--;
                lengths  = $(this).closest('.lunbo').find('.zy_uls li').length-1;
                if(lbindex<0){
                    lbindex=lengths;
                }
                $(this).closest('.lunbo').find('.zy_uls li').eq(lbindex).addClass('on').siblings().removeClass('on');
                $(this).closest('.lunbo').find('.cy_lus li').eq(lbindex).addClass('block').siblings().removeClass('block');
            })
            $(document).on('click','.cy_imgs',function(){
                $(this).closest('.lunbo').find('.cy_banner').hide();
            })
            //    分享
            $('#share').on('mouseenter',function(){
                $('.video_shareBox').show();
            })
            $('#share').on('mouseleave',function(){
                $('.video_shareBox').hide();
            })
         });
       })();
     }
    return exports;
})