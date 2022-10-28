# Redis

lia-nest允许但是不推荐自己去获取RedisTemplate来操作redis，推荐使用com.lia.system.redis.Redis类来获取RedisTemplate连接


```java
if(oldUUID != null){
    Redis.getRedisTemplateByDb(RedisDb.USERTOKEN).delete(oldUUID);
}
```

当前只配置了1个redis数据库用于存放用户身份token，如果需要使用另外15个redis数据库，请在com.lia.system.redis.RedisDb枚举类中配置，然后通过Redis.getRedisTemplateByDb(RedisDb)获取
```java
package com.lia.system.redis;

public enum RedisDb {

    USERTOKEN(1, "存放用户身份验证token"),
    TEST(2,"测试");

    private final int dbIndex;
    private final String remark;

    private RedisDb(int dbIndex, String remark){
        this.dbIndex = dbIndex;
        this.remark = remark;
    }

    public int dbIndex(){
        return this.dbIndex;
    }

    public String remark(){
        return this.remark;
    }
}

```