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
        console.log(info);
        var htmlStr = template("tmp2",info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  //获取选中下拉的值渲染给一级分类
  $('.dropdown-menu').on('click','a',function(){
    $(".first-cate").text($(this).text());
  })

  //通过插件上传图片,获取响应图片的地址
  $("#file-btn").fileupload({
    dataType:"json",
    done:function(e,data){
      var src = data.result.picAddr;
      $("#fileimg").attr("src",src);
    }
  })
})