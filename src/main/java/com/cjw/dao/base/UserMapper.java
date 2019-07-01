package com.cjw.dao.base;

import com.cjw.entity.base.User;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;


/**
 * @author cjw
 * @Description
 * @project springboot_learn
 * @package com.cjw.dao
 * @email 397600342@qq.com
 * @date 2018/6/22
 */
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM USER")
    Page<User> getUserList();
}
