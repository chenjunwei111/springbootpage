package com.cjw.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedHashMap;

/**
* Description  动态SQL类
* @param
* @Author junwei
* @Date 10:51 2019/5/16
**/
public class DiySql {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
    * Description 查
    * @Author junwei
    * @Date 14:53 2019/5/16
    **/
    public String diySelect(String sql) {
        return sql;
    }

    /**
    * Description 改
    * @Author junwei
    * @Date 14:53 2019/5/16
    **/
    public String diyUpdate(String sql){
        return sql;
    }

    /**
    * Description 插
    * @Author junwei
    * @Date 14:53 2019/5/16
    **/
    public String diyInsert(String sql){
        return sql;
    }

    /**
    * Description 删除
    * @Author junwei
    * @Date 14:54 2019/5/16
    **/
    public String diyDelete(String sql){
        return sql;
    }

    /**
    * Description 自定义存储过程
     * @param paramMap 参数 LinkedHashMap<String,Object>
     * @param proName 调用的存储过程名称
    * @Author junwei
    * @Date 14:54 2019/5/16
    **/
    public String diyPRO(LinkedHashMap<String,String> paramMap, String proName){
        String proSql=" call "+proName+"(";
        for(String key : paramMap.keySet()){
            String value = paramMap.get(key);
            proSql+="'"+value+"',";
        }
        proSql=proSql.substring(0,proSql.length()-1);
        proSql+=")";
        logger.info("存储过程调用："+proSql);
        return proSql;
    }

}
