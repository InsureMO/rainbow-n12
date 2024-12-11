-- author: brad.wu
-- tags: n12-init

create table t_user_work_in
(
    work_in_id       bigint    not null
        constraint t_user_work_in__pk primary key,
    user_id          bigint    not null,
    enabled          bool      not null default true,
    tenant_id        bigint,
    organ_id         bigint,
    dept_id          bigint,
    job_title_id     bigint,
    version          integer   not null default 1,
    created_at       timestamp not null default now(),
    created_by       bigint,
    last_modified_at timestamp not null default now(),
    last_modified_by bigint
);

comment on table t_user_work_in is 'User works in';
comment on column t_user_work_in.work_in_id is 'Sequence id';
comment on column t_user_work_in.enabled is 'Job title sharing is enabled or not';
comment on column t_user_work_in.tenant_id is 'Tenant id of this user, could be null when multiple tenant is disabled';

create index t_user_work_in__user on t_user_work_in (user_id);
create index t_user_work_in__tenant on t_user_work_in (tenant_id);
create index t_user_work_in__organ on t_user_work_in (organ_id);
create index t_user_work_in__dept on t_user_work_in (dept_id);
create index t_user_work_in__job_title on t_user_work_in (job_title_id);
