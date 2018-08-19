$(function(){
  var currentPage = 1;
  var pageSize = 5;

  // 1.渲染页面
  render();
  function render(){
    $.ajax({
      type:"GET",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        var htmlStr = template("tmp1",info);
        $("tbody").html(htmlStr);
        // 初始化分页
        $("#paginator").bootstrapPaginator({
          //声明版本
          bootstrapMajorVersion:3,
          //总页数
          totalPages:Math.ceil(info.total/info.size),
          // 当前页
          currentPage:info.page,
          //给页码添加点击事件
          onPageClicked:function(a,b,c,page){
            // 更新currentpage值
            currentPage = page;
            //重新渲染
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

  //表单校验
  $("#form").bootstrapValidator({
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    //字段
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"请输入一级分类名"
          }
        }
      }
    }
  })
  //阻止浏览器默认提交跳转
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"POST",
      url:"/category/addTopCategory",
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        if(info.success){
          //添加成功.渲染页面,关闭模态框,重置表单
          $("#modal-add").modal("hide");
          currentPage=1;
          render();
          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })
  
})