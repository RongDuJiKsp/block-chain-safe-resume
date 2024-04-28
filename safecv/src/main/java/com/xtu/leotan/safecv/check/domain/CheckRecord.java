package com.xtu.leotan.safecv.check.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 审核记录表
 *
 * @TableName check_record
 */
@TableName(value = "check_record")
@Data
@Schema(name = "CheckRecord对象", description = "审核记录表")
public class CheckRecord implements Serializable {
    /**
     * 审核id
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(name = "id", description = "审核id")
    private Integer id;

    /**
     * 简历所有人
     */
    @TableField(value = "resume_username")
    @Schema(name = "resumeUsername", description = "简历所有人")
    private String resumeUsername;

    /**
     * 审核是否通过
     */
    @TableField(value = "is_approve")
    @Schema(name = "isApprove", description = "审核是否通过")
    private Boolean isApprove;

    /**
     * 审核不通过原因
     */
    @TableField(value = "reason")
    @Schema(name = "reason", description = "审核不通过原因")
    private String reason;

    /**
     * 审核人
     */
    @TableField(value = "check_username")
    @Schema(name = "checkUsername", description = "审核人")
    private String checkUsername;

    /**
     * 审核时间
     */
    @TableField(value = "check_time")
    @Schema(name = "checkTime", description = "审核时间")
    private Date checkTime;

    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}