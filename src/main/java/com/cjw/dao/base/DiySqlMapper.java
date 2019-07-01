package com.cjw.dao.base;

import com.cjw.common.DiySql;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.mapping.StatementType;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

/**
* Description  diySqlMapper 持久层
* @param
* @param
* @Author junwei
* @Date 14:40 2019/5/16
**/
@Mapper
public interface DiySqlMapper {

    /**
    * Description  自定义查询SQL
    * @param sql 查询语句
    * @Author junwei
    * @Date 14:43 2019/5/16
    **/
    @SelectProvider(type = DiySql.class, method = "diySelect")
    List<LinkedHashMap<String, Object>> diySql(String sql);

    /**
    * Description 自定义update语句
    * @param sql update语句
    * @Author junwei
    * @Date 14:43 2019/5/16
    **/
    @UpdateProvider(type = DiySql.class, method = "diyUpdate")
    Integer diyUpdate(String sql);


    /**
    * Description 自定义Insert语句
    * @param sql insert语句
    * @Author junwei
    * @Date 14:44 2019/5/16
    **/
    @InsertProvider(type = DiySql.class, method = "diyInsert")
    Integer diyInsert(String sql);

    /**
    * Description 自定义delete语句
    * @param sql delete语句
    * @Author junwei
    * @Date 14:44 2019/5/16
    **/
    @DeleteProvider(type = DiySql.class, method = "diyDelete")
    Integer diyDelete(String sql);

    /**
    * Description 自定义存储过程
    * @param paramMap 参数 LinkedHashMap<String,Object>
    * @param proName 调用的存储过程名称
    * @Author junwei
    * @Date 14:51 2019/5/16
    **/
    @SelectProvider(type = DiySql.class,method = "diyPRO")
    @Options(statementType = StatementType.CALLABLE)
    HashMap diyPRO(LinkedHashMap<String,String> paramMap,String proName);
}
