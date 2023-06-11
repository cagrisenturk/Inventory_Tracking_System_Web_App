<template>
  <Toast />
  <div
    class="grid"
    style="display: flex; justify-content: center; align-items: center"
  >
    <Card class="mr-2 md:w-5 sm:w-full">
      <template #title>
        <div
          class="mt-5"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img
            src="images/avatar/profileicon.jpg"
            alt="image"
            style="height: 200px"
          />
        </div>
      </template>
      <template #content>
        <table id="Datas">
          <tr>
            <td>Adı ve Soyadı</td>
            <td style="font-weight: bold">{{ user.fullName }}</td>
          </tr>
          <hr />
          <tr>
            <td>Eposta Adresi</td>
            <td style="font-weight: bold">{{ user.email }}</td>
          </tr>
          <hr />
        </table>
        <div></div>
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
          "
        >
          <Button
            v-if="!passwordUpdate"
            icon="pi pi-password"
            type="button"
            class="p-button-text green"
            label="Şifre Güncelle"
            v-on:click="UpdateOpen()"
          ></Button>
          <div v-if="passwordUpdate">
            <span class="p-float-label">
              <InputText
                id="user_Password"
                type="email"
                v-model="user.Password"
              />
              <label for="user_Password">Yeni Şifre</label>
              
            </span>
            <Button
            style="margin-left: 4rem;"
            icon="pi pi-check"
            type="button"
            class="p-button-text green"
            label="Onayla"
            v-on:click="UpdatePassword()"
          ></Button>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import UserService from "../../service/setup/UserService";
export default {
  data() {
    return {
      user: {},
      passwordUpdate: false,
    };
  },
  methods: {
    UpdatePassword(){
      new UserService().updateUser(this.user).then((data) => {
        this.$toast.add({
            severity: "success",
            summary: "Güncelleme Başarılı",
            life: 3000,
          });
        console.log(data);
      });
    },
    UpdateOpen() {
      this.passwordUpdate = !this.passwordUpdate;
    },
    loadData() {
      new UserService().getUser(localStorage.userId).then((data) => {
        this.user = data.data;
      });
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
img {
  border-radius: 50%;
  border: 1px solid rgb(143, 147, 201);
  padding: 5px;
}

img:hover {
  box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}

#Datas {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
}

#Datas h1 {
  font-size: 50px;
}

#Datas td {
  font-size: 15px;
  padding-right: 10px;
}
</style>
