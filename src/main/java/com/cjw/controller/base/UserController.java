package com.cjw.controller.base;


import com.cjw.dao.base.UserMapper;
import com.cjw.entity.base.User;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author cjw
 * @Description
 * @project
 * @package com.cjw.controller
 * @email
 * @date
 */
@RestController
public class UserController {

    @Autowired
    UserMapper userMapper;

    //http://localhost:8888/getUserList?pageNum=1&pageSize=2
    @RequestMapping("/getUserList")
    public Page<User> getUserList(Integer pageNum, Integer pageSize){
        PageHelper.startPage(pageNum, pageSize);
        Page<User> userList= userMapper.getUserList();
        return userList;
    }



}
