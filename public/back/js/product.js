$(function(){

  var currentPage = 1;
  var pageSize = 2;
  render();
  // 渲染页面
  function render(){
    $.ajax({
      type:"GET",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        var htmlStr = template("pro-tmp",info);
        $("#product-tbody").html(htmlStr);
        //初始化分页
        $("#paginator").bootstrapPaginator({
          //声明版本
          bootstrapMajorVersion:3,
          //当前页
          currentPage:info.page,
          itemTexts:function(type, page, current){
            switch(type)
            { 
            case "page":
              return page;
            case "prev":
              return "上一页";
            case "first":
              return "首页";
            case "next":
              return "下一页";
            case "last":
              return "尾页";
            }
          },
          totalPages:Math.ceil(info.total/info.size),
          tooltipTitles:function(type,page,current){
            switch(type)
            { 
            case "page":
              return "前往第"+page+"页";
            case "prev":
              return "前往上一页";
            case "first":
              return "首页";
            case "next":
              return "前往下一页";
            case "last":
              return "尾页";
            }
          },
          // 使用 bootstrap 的提示框组件
          useBootstrapTooltip: true,
          //给页码绑定事件
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          }
        })
      }
    })
  }

  //点击添加按钮弹出模态框
  $(".btn-add").on("click",function(){
    $("#modal-add").modal("show");
  })

  //点击添加分类发送请求获取二级分类
  $("#dropdownMenu2").on("click",function(){
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      dataType:"json",
      success:function(info){
        // console.log(info);
        var htmlStr = template("second-list",info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  //渲染选择二级分类,通过事件委托
  $(".dropdown-menu").on("click","a",function(){
    $(".second-cate").text($(this).text()); 
    $("[name='brandId']").val($(this).data("id"));
    //手动改变校验状态
    $("#form").data("bootstrapValidator").updateStatus("brandId","VALID")
  })


  var imgArr = [];
  //使用fileupload获取图片地址,生成图片
  $("#file-btn").fileupload({
    dataType:"json",
    done:function(e,data){
      //将地址添加到数组  往前添加
      imgArr.unshift(data.result);
      // 动态生成img  往前生成
      $(".img-box").prepend('<img src="'+data.result.picAddr+'" width="100" alt="">');
      if(imgArr.length > 3){
        imgArr.pop();
        $(".img-box img:last-of-type").remove();
      }
      // 如果数组长度为3,手动通过校验
      if(imgArr.length === 3){
        $("#form").data("bootstrapValidator").updateStatus("imgStatus", "VALID");
      }      
    }
  })

  //进行表单校验
  $("#form").bootstrapValidator({
    // 重置排除项
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    // 配置字段校验规则
    fields:{
      // 二级分类
      brandId:{
        validators:{
          notEmpty:{
            message:"请选择二级分类"
          }
        }
      },
      // 商品名称
      proName:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      // 商品描述
      proDesc:{
        validators:{
          notEmpty:{
            message:"请输入商品描述"
          }
        }
      },
      // 商品库存
      num:{
        validators:{
          notEmpty:{
            message:"请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      // 商品尺码
      size:{
        validators:{
          notEmpty:{
            message:"请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码必须是 xx-xx 的格式, 例如: 32-40'
          }
        }
      },
      // 商品原价
      oldPrice:{
        validators:{
          notEmpty:{
            message:"请输入商品原价"
          }
        }
      },
      // 商品现价
      price:{
        validators:{
          notEmpty:{
            message:"请输入商品现价"
          }
        }
      },
      //图片
      imgStatus:{
        validators:{
          notEmpty:{
            message:"请选择3张图片"
          }
        }
      }
    }
  })

  //检验完成,阻止默认提交跳转,使用ajax进行提交
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    var formData = $("#form").serialize();
    formData += "&picName1="+imgArr[0].picName+"&picAddr1="+imgArr[0].picAddr;
    formData += "&picName2="+imgArr[0].picName+"&picAddr2="+imgArr[0].picAddr;
    formData += "&picName3="+imgArr[0].picName+"&picAddr3="+imgArr[0].picAddr;
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:formData,
      dataType:"json",
      success:function(info){
        if(info.success){
          // 关闭模态框
          $("#modal-add").modal("hide");
          //重置表单内容
          $("#form").data("bootstrapValidator").resetForm(true);
          // 手动重置下拉和图片内容'
          $(".second-cate").text("请选择二级分类"); 
          $(".img-box img").remove();
          //渲染第一页
          currentPage=1;
          render();
          
        }
      }
    })
  })
})