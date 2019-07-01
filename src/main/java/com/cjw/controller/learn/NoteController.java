package com.cjw.controller.learn;


import com.cjw.dao.base.DiySqlMapper;
import com.cjw.dao.learn.NoteMapper;
import com.cjw.entity.learn.Note;
import com.cjw.serviceImpl.learn.NoteImpl;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * @author cjw
 * @Description
 * @project springboot_learn
 * @package com.cjw.controller
 * @email 397600342@qq.com
 * @date 2018/6/22
 */
@Controller
//@RestController
public class NoteController {

    @Autowired
    NoteMapper noteMapper;

    @Autowired
    DiySqlMapper diySqlMapper;

    @Autowired
    NoteImpl noteService;
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    //http://localhost:8888/getNoteList?pageNum=1&pageSize=2
    @RequestMapping("/getNoteList")
    @ResponseBody
    public Page<Note> getNoteList(Integer pageNum, Integer pageSize){
        PageHelper.startPage(pageNum, pageSize);
        Page<Note>  userList= noteMapper.getNoteList();
        System.out.println(userList);
        return userList;
    }


    //http://localhost:8888/getList?id=1
    @RequestMapping("/getList")
    @ResponseBody
    public List<Note> getList(String id){
        List<Note>  userList= noteService.getList(id);
        System.out.println(userList);
        return userList;
    }

    //http://localhost:8888/dySql
    @RequestMapping("/diySql")
    @ResponseBody
    public PageInfo<LinkedHashMap<String, Object>> diySql(String id){
        PageHelper.startPage(1, 2);
        List<LinkedHashMap<String, Object>> userList= noteMapper.diySql("select * from notes");
//        System.out.println(userList);
        logger.info("测试打印");
        PageInfo<LinkedHashMap<String, Object>> page =
                new PageInfo<>(userList);
        return page;
    }


    //http://localhost:8888/pro
    @RequestMapping("/pro")
    @ResponseBody
    public Object pro(){
        LinkedHashMap<String,String> map=new LinkedHashMap<>();
        map.put("date","2019-01-04");
        map.put("tableName","notes2");
        map.put("isDel","null");
        HashMap res=diySqlMapper.diyPRO(map,"PRO_PARTITION_DATE");
        return res;
    }

    //http://localhost:8888/goIndex
    @RequestMapping("/goIndex")
    public String goIndex(){
        return "index";
    }

    //http://localhost:8888/goIndex2
    @RequestMapping("/goIndex2")
    public String goIndex2(){
        return "index2";
    }
}
