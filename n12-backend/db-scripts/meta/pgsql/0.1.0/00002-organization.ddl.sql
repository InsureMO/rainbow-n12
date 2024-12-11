-- author: brad.wu
-- tags: n12-init

create table t_organization
(
    organ_id           bigint       not null
        constraint t_organization__pk primary key,
    name               varchar(128) not null,
    enabled            bool         not null default true,
    description        varchar(256),
    tenant_id          bigint,
    parent_organ_id    bigint,
    ancestor_organ_ids varchar(256),
    version            integer      not null default 1,
    created_at         timestamp    not null default now(),
    created_by         bigint,
    last_modified_at   timestamp    not null default now(),
    last_modified_by   bigint
);

comment on table t_organization is 'Organizations';
comment on column t_organization.organ_id is 'Sequence id';
comment on column t_organization.name is 'Organization name';
comment on column t_organization.enabled is 'Organization is enabled or not';
comment on column t_organization.description is 'Short description of organization';
comment on column t_organization.tenant_id is 'Tenant id of this organization, could be null when multiple tenant is disabled';
comment on column t_organization.parent_organ_id is 'Parent organization id, available only when this organization is subordinate';
comment on column t_organization.ancestor_organ_ids is 'Ancestor organization ids, from root to parent, joined by ","';

create index t_organization__tenant on t_organization (tenant_id);
create index t_organization__parent on t_organization (parent_organ_id);
create index t_organization__ancestors on t_organization (ancestor_organ_ids);
