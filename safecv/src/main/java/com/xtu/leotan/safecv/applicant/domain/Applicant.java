package com.xtu.leotan.safecv.applicant.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName Applicant
 */
@TableName(value ="Applicant")
@Data
public class Applicant implements Serializable {
    /**
     * 
     */
    @TableField(value = "userName")
    private String username;

    /**
     * 
     */
    @TableField(value = "password")
    private String password;

    /**
     * 
     */
    @TableField(value = "address")
    private String address;

    /**
     * 
     */
    @TableField(value = "publicKeys")
    private String publickeys;

    /**
     * 
     */
    @TableField(value = "P")
    private String p;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}