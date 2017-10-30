class Resource(object):
    def __init__(self, id: int,
                 sys_resource_uid: str,
                 sys_resource_name: str,
                 sys_resource_level: str,
                 sys_resource_path: str,
                 sys_parent_uid: str,
                 createtime: str,
                 updatetime: str,
                 updateuid: str,
                 del_status,
                 icon: str):
        self.id = id
        self.sys_resource_uid = sys_resource_uid
        self.sys_resource_name = sys_resource_name
        self.sys_resource_level = sys_resource_level
        self.sys_resource_path = sys_resource_path
        self.sys_parent_uid = sys_parent_uid
        self.createtime = createtime
        self.updatetime = updatetime
        self.updateuid = updateuid
        self.del_status = del_status
        self.icon = icon
