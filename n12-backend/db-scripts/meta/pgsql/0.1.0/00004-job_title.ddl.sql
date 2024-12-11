-- author: brad.wu
-- tags: n12-init

create table t_job_title
(
    job_title_id     bigint       not null
        constraint t_job_title__pk primary key,
    name             varchar(128) not null,
    enabled          bool         not null default true,
    description      varchar(256),
    tenant_id        bigint,
    organ_id         bigint,
    dept_id          bigint,
    version          integer      not null default 1,
    created_at       timestamp    not null default now(),
    created_by       bigint,
    last_modified_at timestamp    not null default now(),
    last_modified_by bigint
);

comment on table t_job_title is 'Job titles, must be affiliated with at least a tenant, organization, or department';
comment on column t_job_title.job_title_id is 'Sequence id';
comment on column t_job_title.name is 'Job title name';
comment on column t_job_title.enabled is 'Job title is enabled or not';
comment on column t_job_title.description is 'Short description of job title';
comment on column t_job_title.tenant_id is 'Tenant id of this job title, could be null when multiple tenant is disabled';
comment on column t_job_title.organ_id is 'Organization id of this job title';
comment on column t_job_title.dept_id is 'Department id of this job title';

create index t_job_title__tenant on t_job_title (tenant_id);
create index t_job_title__organ on t_job_title (organ_id);
create index t_job_title__dept on t_job_title (dept_id);
