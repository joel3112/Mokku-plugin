import { ILog, IMockResponseRaw, MethodEnum } from "../types/mock";

export const getMockFromLog = (log: ILog): IMockResponseRaw => ({
  active: true,
  method: (log.request?.method as MethodEnum) || MethodEnum.GET,
  id: undefined,
  createdOn: undefined,
  url: log.request?.url || "/some-url",
  status: log.response?.status || 200,
  response: log.response?.response || "",
  delay: 500,
  description: "",
  headers: log.request.headers,
});
