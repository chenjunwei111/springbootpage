package com.cjw.dao.learn;


import com.cjw.common.DiySql;
import com.cjw.entity.learn.Note;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.LinkedHashMap;
import java.util.List;


/**
 * @author cjw
 * @Description
 * @project springboot_learn
 * @package com.cjw.dao
 * @email 397600342@qq.com
 * @date 2018/6/22
 */
@Mapper
public interface NoteMapper {

    @Select("SELECT * FROM NOTES")
    Page<Note> getNoteList();

    @Select("SELECT * FROM NOTES where id=#{id}")
    List<Note> getList(String id);


    @SelectProvider(type = DiySql.class, method = "diySelect")
    List<LinkedHashMap<String, Object>> diySql(String sql);
}
