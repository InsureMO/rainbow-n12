-- author: brad.wu
-- tags: n12-init

create table t_department
(
    dept_id           bigint       not null
        constraint t_department__pk primary key,
    name              varchar(128) not null,
    enabled           bool         not null default true,
    description       varchar(256),
    tenant_id         bigint,
    organ_id          bigint       not null,
    parent_dept_id    bigint,
    ancestor_dept_ids varchar(256),
    version           integer      not null default 1,
    created_at        timestamp    not null default now(),
    created_by        bigint,
    last_modified_at  timestamp    not null default now(),
    last_modified_by  bigint
);

comment on table t_department is 'Departments';
comment on column t_department.dept_id is 'Sequence id';
comment on column t_department.name is 'Department name';
comment on column t_department.enabled is 'Department is enabled or not';
comment on column t_department.description is 'Short description of department';
comment on column t_department.tenant_id is 'Tenant id of this department, could be null when multiple tenant is disabled';
comment on column t_department.organ_id is 'Organization id of this department';
comment on column t_department.parent_dept_id is 'Parent department id, available only when this department is subordinate';
comment on column t_department.ancestor_dept_ids is 'Ancestor department ids, from root to parent, joined by ","';

create index t_department__tenant on t_department (tenant_id);
create index t_department__organ on t_department (organ_id);
create index t_department__parent on t_department (parent_dept_id);
create index t_department__ancestors on t_department (ancestor_dept_ids);
