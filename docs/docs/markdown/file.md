# 文件系统

lia-nest已经创建好了一个文件系统，请根据com.lia.system.modules.file.SysFileService类内的方法获取文件传输流来上传或者下载文件

#### 示例

* 上传文件
```java
@Autowired
private SysFileService sysFileService;

 /**
* 更换用户头像
* @param file
* @return
*/
public SysFile updateHeadImg(MultipartFile file) {
    SysUser user = new SysUser();
    user.setUserId(LoginUser.getLoginUserId());
    user = this.findSysUser(user).get(0);
    // 保存新的头像
    SysFile image = sysFileService.uploadFile(file, "image");
    // 如果是更换头像，则删除原来的头像数据
    if (user.getHeadImg() != null) {
        //删除数据库内的头像数据
        sysFileService.deleteFiles(ArrayUtils.asList(user.getHeadImg()));
    }
    //保存新的头像到数据库
    user.setHeadImg(image.getFileId());
    this.saveUser(user);
    return image;
}
```

* 下载文件
```java
@Autowired
private SysFileService sysFileService;

/**
* 加载文件
* @param fileId 资源fileId
*/
@GetMapping("/getFile")
public void getFile(HttpServletResponse response, Long fileId){
    sysFileService.getFileByPath(response, fileId);
}
```