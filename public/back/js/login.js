$(function(){
  $("#form").bootstrapValidator({
    //配置校验图标
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },


    //配置字段
    fields:{
      username:{
        //配置校验规则
        validators:{
          //非空
          notEmpty:{
            message:"用户名不能为空"
          },
          //长度校验
          stringLength:{
            min:2,
            max:6,
            message:"用户名长度为 2-6 位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是 6-12 位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
  })

  // 2.登录功能
  // 表单校验插件会在提交表单时进行校验
  // (1)校验成功,默认会提交表单,会发生页面跳转,我们需要注册表单校验成功事件,阻止默认的提交
  // 通过ajax发送请求  (success.form.bv)
  // (2)校验失败,不做处理
  $("#form").on("success.form.bv",function(e){
    e.preventDefault()
    console.log(111);
    // 发送ajax请求
    $.ajax({
      url:"/employee/employeeLogin",
      type:"post",
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          //说明用户密码正确
          // 跳转到首页
          location.href = "index.html";
        }
        if(info.error === 1000){
          // 用户名不存在
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
        if(info.error === 1001){
          //密码错误
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })
  })



  // 3.重置功能
  // 调用插件的方法  $("#form").data("bootstrapValidator").resetForm();
  // true/false   true为全部内容重置  false重置校验状态
    $("[type = 'reset']").on("click",function(){
      //重置表单内容
      $("#form").data("bootstrapValidator").resetForm();
    })
})