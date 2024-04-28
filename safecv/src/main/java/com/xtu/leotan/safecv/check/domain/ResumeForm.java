package com.xtu.leotan.safecv.check.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName resumeForm
 */
@TableName(value ="resumeForm")
@Data
public class ResumeForm implements Serializable {
    /**
     * 
     */
    @TableId(value = "userName")
    private String username;

    /**
     * 
     */
    @TableField(value = "address")
    private String address;

    /**
     * 
     */
    @TableField(value = "putTime")
    private Integer puttime;

    /**
     * 
     */
    @TableField(value = "downloadtimes")
    private Long downloadtimes;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}