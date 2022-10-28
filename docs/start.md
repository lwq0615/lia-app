# 快速开始

:::tip 系统需求
* JDK 1.8
* MySql 8.0
* Maven 3.5
:::


#### 服务端
1. 前往Github下载页面下载<a href="https://github.com/lwq0615/lia-nest">lia-nest</a>
2. 在Idea中打开，修改maven与jdk等相关配置
3. 修改lia-system模块中的application.yml配置文件配置数据源等信息
4. 确保redis服务开启
5. 运行lia-system模块中的NestApplication.main方法
6. 服务端启动成功
```
(♥◠‿◠)ﾉﾞ  启动成功   ლ(´ڡ`ლ)ﾞ
```


#### 客户端
1. 前往Github下载页面下载<a href="https://github.com/lwq0615/lia-app">lia-app</a>
2. 在VsCode中打开，终端运行yarn start
3. 客户端启动成功


#### application.yml配置文件
```yml
server:
  #端口号
  port: 8080
  servlet:
    # 应用的访问路径
    context-path: /
  error:
    path: /error
spring:
  # redis配置
  redis:
    host: localhost
    port: 6379
    password:
    # 可选数据库,默认数据库为第一个
    dbs: 1,0,2,3
    # RedisTemplate使用的数据库，不推荐使用RedisTemplate来操作redis
    database: 0
  servlet:
    #不限制上传文件大小
    multipart:
      max-file-size: -1
      max-request-size: -1
  #数据库配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/lia
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
    # 连接池配置
    druid:
      # 初始连接数
      initial-size: 5
      # 最小连接池数量
      min-idle: 10
      # 最大连接池数量
      max-active: 20
      #配置获取连接等待超时的时间
      max-wait: 60000
      #配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
      time-between-eviction-runs-millis: 60000
      # 配置一个连接在池中最小生存的时间，单位是毫秒
      min-evictable-idle-time-millis: 30000
      # 配置一个连接在池中最大生存的时间，单位是毫秒
      max-evictable-idle-time-millis: 900000
      # 配置检测连接是否有效
      validation-query: SELECT 1 FROM DUAL
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      #3.基础监控配置
      web-stat-filter:
        enabled: true
      stat-view-servlet:
        enabled: true
        # 设置白名单，不填则允许所有访问
        allow:
        url-pattern: /druid/*
        #设置监控页面的登录名和密码
        login-username: root
        login-password: 123456
      filter:
        stat:
          enabled: true
          # 慢SQL记录
          log-slow-sql: true
          slow-sql-millis: 1000
          merge-sql: true
        wall:
          config:
            multi-statement-allow: true


# MyBatis plus配置
mybatis-plus:
  # 搜索指定包别名
  type-aliases-package: com.lia.**.modules
  # 配置mapper的扫描，找到所有的mapper.xml映射文件
  mapper-locations: classpath*:mapper/**/*Mapper.xml
  # 打印sql语句到控制台
#  configuration:
#    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl


# PageHelper分页插件
pagehelper:
  helperDialect: mysql
  supportMethodsArguments: true
  params: count=countSql

# token配置
token:
  # 令牌自定义标识
  header: Authorization
  # 令牌密钥
  signature: liweiqiang
  # 令牌有效期（单位分钟，设置0则不会过期）
  expireTime: 0

# 上传设置
upload:
  # 上传文件的保存位置
  basePath: public
```