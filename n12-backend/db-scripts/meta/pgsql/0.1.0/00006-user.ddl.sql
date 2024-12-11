-- author: brad.wu
-- tags: n12-init

create table t_user
(
    user_id          bigint      not null
        constraint t_user__pk primary key,
    user_name        varchar(64) not null,
    display_name     varchar(64),
    first_name       varchar(64),
    middle_name      varchar(64),
    last_name        varchar(64),
    email            varchar(64),
    mobile           varchar(16),
    enabled          bool        not null default true,
    tenant_id        bigint,
    organ_id         bigint,
    dept_id          bigint,
    job_title_id     bigint,
    version          integer     not null default 1,
    created_at       timestamp   not null default now(),
    created_by       bigint,
    last_modified_at timestamp   not null default now(),
    last_modified_by bigint
);

comment on table t_user is 'Users, must be affiliated with at least a tenant, organization, or department';
comment on column t_user.user_id is 'Sequence id';
comment on column t_user.enabled is 'Job title sharing is enabled or not';
comment on column t_user.user_name is 'User name, login account.';
comment on column t_user.display_name is 'Display name, could be empty';
comment on column t_user.tenant_id is 'Tenant id of this user, could be null when multiple tenant is disabled';

create index t_user__name on t_user (user_name);
create index t_user__tenant on t_user (tenant_id);
create unique index t_user__name__tenant on t_user (user_name, tenant_id);
create index t_user__email on t_user (email);
create index t_user__mobile on t_user (mobile);
