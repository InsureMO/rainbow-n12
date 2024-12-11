-- author: brad.wu
-- tags: n12-init

create table t_job_title_share_to
(
    share_to_id       bigint    not null
        constraint t_job_title_share_to__pk primary key,
    from_job_title_id bigint    not null,
    to_job_title_id   bigint    not null,
    enabled           bool      not null default true,
    version           integer   not null default 1,
    created_at        timestamp not null default now(),
    created_by        bigint,
    last_modified_at  timestamp not null default now(),
    last_modified_by  bigint
);

comment on table t_job_title_share_to is 'Job title sharing';
comment on column t_job_title_share_to.share_to_id is 'Sequence id';
comment on column t_job_title_share_to.enabled is 'Job title sharing is enabled or not';
comment on column t_job_title_share_to.from_job_title_id is 'Job title which provide sharing';
comment on column t_job_title_share_to.to_job_title_id is 'Job title which consume sharing';

create index t_job_title_share_to__from on t_job_title_share_to (from_job_title_id);
create index t_job_title_share_to__to on t_job_title_share_to (to_job_title_id);
