     const baseUrl: string = "https://be-energy-consumption.herokuapp.com/"
  //  const baseUrl: string = "http://localhost:8080/"

export namespace ClientsService {
    export const DELETE_CLIENT_BY_ID = `${baseUrl}${"client/delete/"}`;
    export const ADD_CLIENT = `${baseUrl}${"client/insert/"}`;
    export const GET_ALL_CLIENTS = `${baseUrl}${"client/"}`;
    export const LOGIN_CLIENT = `${baseUrl}${"client/login"}`;
}

export namespace DevicesService {
  export const DELETE_DEVICE_BY_ID = `${baseUrl}${"device/delete/"}`;
  export const ADD_DEVICE = `${baseUrl}${"device/insert/"}`;
  export const GET_ALL_DEVICES = `${baseUrl}${"device/"}`;
  export const GET_DEVICES_BY_CLIENT_ID = `${baseUrl}${"device/GetDevicesByCliendId/"}`;
  export const SET_CLIENT_BY_DEVICE_ID = `${baseUrl}${"device/setClient/"}`;
  export const REMOVE_CLIENT_BY_DEVICE_ID = `${baseUrl}${"device/removeClient/"}`;
}

export namespace SensorsService {
  export const DELETE_SENSOR_BY_ID = `${baseUrl}${"sensor/delete/"}`;
  export const ADD_SENSOR = `${baseUrl}${"sensor/insert/"}`;
  export const GET_ALL_SENSORS = `${baseUrl}${"sensor/"}`;
}
