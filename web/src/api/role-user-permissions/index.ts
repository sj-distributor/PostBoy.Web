import { StaffFoundationHierarchyDataRequest } from "../../dtos/role-user-permissions";
import { Get } from "../http-client";

export const GetFoundationTreeList = async () => {
  return await Get<StaffFoundationHierarchyDataRequest>(
    "/api/Foundation/department/staff/hierarchy/tree"
  );
};
