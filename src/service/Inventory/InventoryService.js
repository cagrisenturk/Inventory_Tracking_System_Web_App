import axios from "axios";
import odata from "../odata/OdataService";
export default class Inventory {
  get(filter) {
    var urlparams = new odata().createOdataQuery(filter);
    return axios.get("v1/OInventories?" + urlparams).then((response) => {
      console.log(response.data);
      return response.data;
    });
  }

  getById(id) {
    return axios("api/Inventory/GetInventoryById?inventoryId="+id).then(
      (response) => {
        console.log(response);
        return response.data;
      }
    );
  }

  deleteInventory(id) {
    return axios
    .post("api/Inventory/DeleteInventory?inventoryId="+id, )
    .then((response) => {
      console.log(response);
      return response;
    });
  }

  updateInventory(inventory) {
    return axios
    .post("api/Inventory/UpdateInventory", inventory)
    .then((response) => {
      console.log(response);
      return response;
    });
  }

  addInventory(inventory) {
    return axios
    .post("api/Inventory/AddInventory", inventory)
    .then((response) => {
      console.log(response);
      return response;
    });
  }
  
  getMinTime() {
    return axios("api/InventoryUseTime/GetInventoryMaxTotalTime").then(
      (response) => {
        console.log(response);
        return response.data;
      }
    );
  }
}