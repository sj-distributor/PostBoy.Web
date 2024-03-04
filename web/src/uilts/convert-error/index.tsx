export const convertRoleErrorText = (err: Error) => {
  return err.message.includes(
    "PostBoy.Core.Middlewares.Authorization.ForbiddenAccessException"
  )
    ? "没有此功能权限"
    : err.message;
};
