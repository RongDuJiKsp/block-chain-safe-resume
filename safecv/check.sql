# 审核表

use safe_resume;
drop table check_record;
# 审核记录
create table check_record
(
    id              int primary key auto_increment comment '审核id',
    resume_username varchar(255) not null comment '简历所有人',
    is_approve      bool         not null comment '审核是否通过',
    reason          varchar(1000) comment '审核不通过原因',
    check_username  varchar(255) comment '审核人',
    check_time      datetime default now() comment '审核时间',
    index idx_resume_check (resume_username, check_username)
) comment '审核记录表';