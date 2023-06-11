<template>
  <Card>
    <template #title>
      <span v-if="UserId != 0">Kullanıcı Düzenle</span>
      <span v-if="UserId == 0">Yeni Kullanıcı Oluştur</span>
      <Button
        icon="pi pi-times"
        type="button"
        class="p-button-text red"
        style="float: right; display: inline-block"
        v-on:click="$emit('close')"
      ></Button>
      <Button
        v-if="user.Id != 0"
        icon="pi pi-trash"
        type="button"
        class="p-button-text red"
        style="float: right; display: inline-block"
        v-on:click="deleteUser(user.Id)"
      ></Button>
      <Button
        icon="pi pi-check"
        type="button"
        class="p-button-text"
        style="float: right; display: inline-block"
        v-on:click="saveUser()"
      ></Button>
    </template>

    <template #content>
      <br />
      <div class="p-fluid grid">
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <InputText id="user" type="text" v-model="user.fullName" />
            <label for="user_name">Adı-Soyadı</label>
          </span>
        </div>

        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <InputText id="user_Email" type="email" v-model="user.email" />
            <label for="user_Email">Eposta Adresi</label>
          </span>
        </div>
        <div class="field col-12 md:col-6" v-if="UserId == 0">
          <span class="p-float-label">
            <InputText
              id="user_Password"
              type="email"
              v-model="user.Password"
            />
            <label for="user_Password">Şifre</label>
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="js">
import UserService from '../../../service/setup/UserService';

export default {
  data() {
    return {
      user: {Id:0},
    };
  },
  props: ['UserId'],
  emits: ['refresh', 'close'],
  created() {
    this.getUser();
  },
  watch: {
    UserId() {
    this.getUser();
    }
  },
  methods: {
    getUser() {
      if (this.UserId == 0) {
        this.user = { Id:0};
        return;
      }
      new UserService().getUser(this.UserId).then((data) => {
        this.user = data.data;
        console.log(this.user);
      })
    },
    saveUser() {
      if(this.user.Id==0){
      new UserService().saveUser(this.user).then((response) => {
        if (response=="Kayıt Başarılı") {
          this.$toast.add({ severity: 'success', summary: 'Başarılı', detail: response.Message, life: 3000 });
        } else {
          this.$toast.add({ severity: 'error', summary: 'Hata!', detail: response, life: 3000 });
          return;
        }
        console.log(response);
        console.log(response.Data);
        this.user = response.Data;
        this.$emit('refresh');
        this.$emit('close');
      })
    }
    else{
                new UserService().updateUser(this.user).then((response) => {
                    if (response) {
                        this.$toast.add({ severity: 'success', summary: 'Başarılı', detail: response.Message, life: 3000 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Hata!', detail: response.Message, life: 3000 });
                        return;
                    }
                    this.$emit('refresh');
                     this.$emit('close');
                })
              }
    },
    deleteUser(id) {
      var isOk = confirm("Silmek istediğinize emin misiniz?");
      if (!isOk) {
        return;
      }
      new UserService().deleteUser(id).then((response) => {
      if (response.Status) {
        this.$toast.add({ severity: 'success', summary: 'Başarılı', detail: response.Message, life: 3000 });
      } else {
        this.$toast.add({ severity: 'error', summary: 'Hata!', detail: response.Message, life: 3000 });
        return;
      }
      this.$emit('refresh');
      this.$emit('close');
      });
    }
  }
}
</script>
