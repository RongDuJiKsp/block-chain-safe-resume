package com.xtu.leotan.safecv.check.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serial;
import java.io.Serializable;

import lombok.Data;

/**
 * @TableName KeyKeeper
 */
@TableName(value = "KeyKeeper")
@Data
public class Keykeeper implements Serializable {
    /**
     *
     */
    @TableId(value = "userName")
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

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}