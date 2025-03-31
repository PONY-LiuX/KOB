package com.kob.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kob.backend.pojo.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * @Project： backend
 * @author： PONY
 * @create： 2025-03-30-22:28
 * @describe：
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {


}
