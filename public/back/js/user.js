$(function(){
  var currentPage = 1;
  var pageSize = 5;

  var userId;
  var isDelete;
  //1.进入页面先渲染一次
  render();
  function render(){

    //一进入页面进行渲染
    $.ajax({
      type:"GET",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        var htmlStr = template("tmp",info);
        $("tbody").html(htmlStr);
        //初始化分页
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


  // 2.操作功能
    // 点击弹出模态框
  $("tbody").on("click",".btn",function(){
    $("#modal-user").modal("show");
    userId = $(this).parent().parent().attr("data-id");
    isDelete = $(this).hasClass("btn-danger")?"0":"1";
  })
  // 点击确定发送请求
  $(".user-btn").on("click",function(){
    $.ajax({
      type:"POST",
      url:"/user/updateUser",
      data:{
        id:userId,
        isDelete:isDelete
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          //说明后台操作成功,关闭模态框,从新渲染页面
          $("#modal-user").modal("hide");
          render();
        }
      }
    })
  })

  
})