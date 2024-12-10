-- author: brad.wu
-- tags: n12-init

create type e_tenant_type as enum ('service-provider', 'tenant', 'subordinate', 'derived');
create table t_tenant
(
    tenant_id                      bigint        not null
        constraint t_tenant__pk primary key,
    code                           varchar(64)   not null,
    name                           varchar(128)  not null,
    enabled                        bool          not null default true,
    description                    varchar(256),
    type                           e_tenant_type not null,
    parent_tenant_id               bigint,
    ancestor_tenant_ids            varchar(256),
    share_data_to_parent           bool          not null default false,
    origin_tenant_id               bigint,
    origin_tenant_ids              varchar(256),
    share_data_to_origin           bool          not null default false,
    share_data_to_service_provider bool          not null default true,
    allow_subordinate              bool          not null default false,
    allow_derived                  bool          not null default false
);

comment on table t_tenant is 'All tenants';
comment on column t_tenant.tenant_id is 'Sequence id';
comment on column t_tenant.code is 'Tenant code';
comment on column t_tenant.name is 'Tenant name';
comment on column t_tenant.enabled is 'Tenant is enabled or not';
comment on column t_tenant.description is 'Short description of tenant';
comment on column t_tenant.type is 'Tenant type, should be one of service-provider, tenant, subordinate, derived';
comment on column t_tenant.parent_tenant_id is 'Parent tenant id, available only when this tenant is subordinate';
comment on column t_tenant.ancestor_tenant_ids is 'Ancestor tenant ids, from root to parent, joined by ","';
comment on column t_tenant.share_data_to_parent is 'Data sharing to parent or not';
comment on column t_tenant.origin_tenant_id is 'Origin tenant id, available only when this tenant is derived';
comment on column t_tenant.origin_tenant_ids is 'Origin tenant ids, from root to origin, joined by ","';
comment on column t_tenant.share_data_to_origin is 'Data sharing to origin or not';
comment on column t_tenant.share_data_to_service_provider is 'Data sharing to service provider or not';
comment on column t_tenant.allow_subordinate is 'Allow subordinate or not';
comment on column t_tenant.allow_derived is 'Allow derived or not';

create unique index t_tenant__code on t_tenant (code);

