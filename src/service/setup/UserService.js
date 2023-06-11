import axios from "axios";
import odata from "../odata/OdataService";

export default class UserService {
  get(filter) {
    var urlparams = new odata().createOdataQuery(filter);
    return axios.get("v1/OUsers?" + urlparams).then((response) => {
      console.log(response.data);
      return response.data;
    });
  }

  getUser(id) {
    return axios.get("api/User/GetUserById?userId=" + id).then((response) => {
      return response.data;
    });
  }

  updateUser(user) {
    return axios.post("api/User/Update" , user).then((response) => {
      return response.data;
    });
  }

  getUserByCode(code) {
    return axios.get("api/user/getbyusercode/" + code).then((response) => {
      return response.data;
    });
  }
  login(request) {
    return axios.post("api/login/login", request).then((response) => {
      return response.data;
    });
  }
  sendMail(email) {
    return axios.get("api/user/sendmail/" + email).then((response) => {
      return response.data;
    });
  }
  saveUser(model) {
    return axios.post("api/User/Register", model).then((response) => {
      return response.data;
    });
  }

  deleteUser(id) {
    return axios.post("api/User/DeleteUser?userId=" + id).then((response) => {
      return response.data;
    });
  }
}
