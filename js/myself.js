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
            unique_names: false,
            save_key: false,
            domain: 'http://img.youxiake.com/',
            get_new_uptoken: false,
            container: 'container',
            max_file_size: '100mb',
            flash_swf_url: 'js/plupload/Moxie.swf',
            max_retries: 3,
            dragdrop: true,
            drop_element: 'container',
            chunk_size: '4mb',
            auto_start: false,
            filters: {
                max_file_size: '100mb',
                prevent_duplicates: false,
                mime_types: [{
                    title: "Image files",
                    extensions: "jpg,jpeg,png"
                }]
            },
            init: {
                'FilesAdded': function (up, files) {
                    plupload.each(files,function(file){
                        if(file.size>5242880){
                            layer.msg('文件太大，请重新上传');
                            up.removeFile(file);
                         }else{
                            up.start();
                         }
                    })
                },  
                'BeforeUpload': function (up, file) {

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
                    var prefix = 'youxiake';
                    var date = new Date();
                    var datas = parseFloat( date.getMilliseconds());
                    var _random = Math.random().toString(36).substr(2);
                    var keycode = datas + _random;
                    var fileType = file.name.substring(file.name.indexOf('.')+1);
                    var key = prefix+keycode+"."+ fileType;
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

            $all_sum.on('change',function () {
                var reg=/[\u4E00-\u9FA5]/g;
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
                $count = $count.replace(reg,'');
                if($count>all_count){
                    $count = all_count;
                }
                if($count==0||$count==''){
                   $count = 1; 
                }
                $price = $price.replace(reg,'');
                $priceTotal = parseFloat($count)*parseFloat($price);
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
                    title:'提示',
                    icon:2,
                    content: '确定删除该商品吗？',
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
                    title:'提示',
                    icon:2,
                    content: '确定删除失效商品吗？',
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
                    title:'提示',
                    icon:2,
                    content: '确定要删除该收货地址吗？',
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
                    title:'提示',
                    icon:2,
                    content: '确定要删除该收货地址吗？',
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
                    layer.msg('最多添加10条收货地址')
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
            function clear(){
                $('#m_username').val('');
                $('#m_phone').val('');
                $('#city').find('option:first-child').val('');
                $('#city').find('option:first-child').text('');
                $('#xian').find('option:first-child').val('');
                $('#xian').find('option:first-child').text('');
                $('#textsrea').val('')
            }
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
                            clear();
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
                    title:'提示',
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
                console.log(lengths)
                if(lengths>3){
                    layer.msg('最多上传3张')
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
            $('.moer_tui').on('keyup',function(){
                var val = $(this).val();
                var money = $(".price").html()*$(".count").html();
                var reg=/[\u4E00-\u9FA5]/g;
                val = val.replace(reg,'');
                if(val>money){
                    $(this).closest('.redund_money').find('.chaochu').removeClass('none')
                }else{
                    $(this).closest('.redund_money').find('.chaochu').addClass('none')
                }
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
                            // range:[0,money]
                        },
                        yuanyin:{
                            required:true
                        },
                        // introduce:{
                        //     required:true
                        // },
                    },
                    messages:{
                        money:{
                            required:'请输入退款金额',
                            // range:'退款超出金额'
                        },
                        yuanyin:{
                            required:'请输入退款原因'
                        },
                        // introduce:{
                        //     required:'请输入退款说明'
                        // },
                    }
                })
                $("#forms_re").submit();
            })

        })();
    };
    exports.shopComment = function(){
        (function(){
            // 处理换行
            hunahang($('.comment_p'));
             hunahang($('.hunahang'));
             function hunahang(val){
                var text = val;
                text.each(function(index,item){
                    if($(item).text().indexOf("<br/>")){
                        $(item).html($(item).text().replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, '<br/>'));
                    }            
                })
            
            }
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
                        layer.msg('至少输入5个字')
                        submit_mz = false;
                        return false;
                    }
                    if($(item).val().length>1000){
                        layer.msg('最多输入一千个字')
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
                    title:'提示',
                    icon:2,
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
                    title:'提示',
                    icon:2,
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
                    title:'提示',
                    icon:2,
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
    }
    return exports;
})