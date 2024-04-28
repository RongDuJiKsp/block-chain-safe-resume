package com.xtu.leotan.safecv.check.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author Leo
 * @description 针对表【resumeForm】的数据库操作Mapper
 * @createDate 2024-04-28 14:42:34
 * @Entity generator.domain.Resumeform
 */
@Mapper
public interface ResumeFormMapper extends BaseMapper<ResumeForm> {

    @Select("select * from resumeForm where userName not in " +
            "(select resume_username from check_record where check_username = #{checkUsername})")
    List<ResumeForm> listUncheckResumeByCheckUsername(String checkUsername);
}
