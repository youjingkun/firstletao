$(function(){
  var currentPage = 1;
  var pageSize = 5;
  // 页面渲染
  render();
  function render(){
    $.ajax({
      type:"GET",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        var htmlStr = template("tmp1",info);
        $("#second-tbody").html(htmlStr);
        //分页初始化
        $("#paginator").bootstrapPaginator({
          //设定版本
          bootstrapMajorVersion:3,
          totalPages:Math.ceil(info.total/info.size),
          currentPage:info.page,
          //给页码添加点击事件
          onPageClicked:function(a,b,c,page){
            //重新复制currentPage
            currentPage = page;
            //渲染
            render();
          }
        })
      }
    })
  }

  //点击添加弹出模态框
  $(".btn-default").on("click",function(){
    $("#modal-add").modal("show");
  })

  // 点击渲染下拉
  $(".btn-drop").on("click",function(){
    $.ajax({
      type:"GET",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:1,
        pageSize:10000
      },
      dataType:"json",
      success:function(info){
        var htmlStr = template("tmp2",info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  //获取选中下拉的值渲染给一级分类
  $('.dropdown-menu').on('click','a',function(){
    $(".first-cate").text($(this).text());
    var id = $(this).data("id")
    $("[name='categoryId']").val(id);
    // 上传图片后手动改变校验状态
    $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
  })

  //通过插件上传图片,获取响应图片的地址
  $("#file-btn").fileupload({
    dataType:"json",
    done:function(e,data){
      var src = data.result.picAddr;
      $("#fileimg").attr("src",src);
      $("[name='brandLogo']").val(src);
      // 上传图片后手动改变校验状态
      $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
  })

  //表单校验
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
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请选择图片"
          }
        }
      }
    }
  })

  //表单校验完成后,阻止默认提交,通过ajax请求
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        if(info.success){
          // 关闭模态框
          $("#modal-add").modal("hide");
          // 重置表单内容
          $("#form").data("bootstrapValidator").resetForm(true);
          // 重置id和图片
          $('.dropdown .first-cate').text("请选择一级分类");
          $("#fileimg").attr("src","./images/none.png");
          //渲染第一页
          currentPage = 1;
          render();
        }
      }
    })
  })
})