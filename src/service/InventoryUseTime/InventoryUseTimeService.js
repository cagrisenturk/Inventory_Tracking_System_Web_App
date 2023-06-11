import axios from "axios";
import odata from "../odata/OdataService";
export default class InventoryUseTime {
  get(filter) {
    var urlparams = new odata().createOdataQuery(filter);
    return axios.get("v1/OInventoryUseTimes?" + urlparams).then((response) => {
      console.log(response.data);
      return response.data;
    });
  }

  getMaxTime() {
    return axios("api/InventoryUseTime/GetInventoryMaxTotalTime").then(
      (response) => {
        console.log(response);
        return response.data;
      }
    );
  }
  getDashboardInfo() {
    return axios("api/InventoryUseTime/GetDashboardInfo").then(
      (response) => {
        console.log(response);
        return response.data;
      }
    );
  }
  
  
  
  getMinTime() {
    return axios("api/InventoryUseTime/GetInventoryMinTotalTime").then(
      (response) => {
        console.log(response);
        return response.data;
      }
    );
  }
}