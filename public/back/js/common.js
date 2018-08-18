//// 开启进度条
// NProgress.start();

// setTimeout(function() {
//  // 结束进度条
//  NProgress.done();
// }, 2000);

// 注册ajax全局事件
$(document).ajaxStart(function(){
  // 当第一个ajax请求发送的时候触发
  NProgress.start();
});

$(document).ajaxStop(function(){
  //所有的ajax请求完成的时候触发
  NProgress.done();
})


//登录拦截
//先判断是否为登录页,登录页不拦截
if(location.href.indexOf("login.html") === -1){

  $.ajax({
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function(info){
      if(info.success){
        //已登录,无需拦截
      }
      if(info.error === 400){
        // 未登录拦截
        location.href = "login.html";
      }
    }
  })
}







$(function(){
  // 1.分类伸缩功能
  $(".category").click(function(){
    $(".aside-nav .child").stop().slideToggle();
  })



  // 2.aside隐藏功能

  $(".lt-topbar .menu-icon").on("click",function(){
    $(".lt-aside").toggleClass("hiddenmenu");
    $(".right-main").toggleClass("hiddenmenu");
    $(".lt-topbar").toggleClass("hiddenmenu");
  })
  // 3.点击top退出按钮,展示模态框
  $(".logout-icon").on("click",function(){
    $("#modal-logout").modal("show");
  })

  // 4.点击模态框确定,发送ajax请求,退出
  $(".logout-btn").on("click",function(){
    $.ajax({
      url:"/employee/employeeLogout",
      dataType:"json",
      success:function(info){
        if(info.success){
          location.href = "login.html";
        }
      }
    })
  })
})


