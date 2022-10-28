# 异常处理

lia-nest已经对大多数的网络请求异常做了全局处理，当我们发现请求有误时，如果希望返回一个错误状态码，不再需要去操作response对象，只需要抛出一个HttpException异常即可，并且前端已经对大多数状态码进行处理
```java
if(router.getPath() == null || router.getPath().equals("")){
    throw new HttpException(400,"缺少参数path");
}
```

:::tip 提示
你可以修改lia-system模块下的com.lia.system.exception.GlobalException全局异常处理器来修改异常的处理逻辑
:::