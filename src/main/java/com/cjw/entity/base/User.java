package com.cjw.entity.base;

import org.apache.ibatis.type.Alias;

/**
 * @author cjw
 * @Description
 * @project springboot_learn
 * @package com.cjw.entity
 * @email 397600342@qq.com
 * @date 2018/6/22
 */
@Alias("user")
public class User {

    private int id;
    private String user_name;
    private String user_password;

    public User(String user_name, String user_password) {
        this.user_name = user_name;
        this.user_password = user_password;
    }

    public User(int id, String user_name, String user_password) {
        this.id = id;
        this.user_name = user_name;
        this.user_password = user_password;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_password() {
        return user_password;
    }

    public void setUser_password(String user_password) {
        this.user_password = user_password;
    }
}
