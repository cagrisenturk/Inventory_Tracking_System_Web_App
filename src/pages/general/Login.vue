<template>
  <Toast />
  <!-- <Dialog
    header="Emailinizi Girin"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    :modal="true"
  >
    <InputText
      id="email2"
      v-model="email"
      type="text"
      class="w-full mt-3"
      placeholder="Email"
      style="padding: 1rem"
      :disabled="isDisabled"
    />
    <template #footer>
      <Button
        label="Hayır"
        icon="pi pi-times"
        @click="displayModal = false"
        class="p-button-text"
      />
      <Button label="Evet" icon="pi pi-check" @click="sendMail()" autofocus />
    </template>
  </Dialog> -->

  <div
    class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <img :src="'images/MyIcon.png'" style="width: 351px; height: 180px" />
      </div>

      <div
        class="col-12 xl:col-6"
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color),
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="h-full w-full m-0 py-7 px-4"
          style="
            border-radius: 53px;
            background: linear-gradient(
              180deg,
              var(--surface-50) 38.9%,
              var(--surface-0)
            );
          "
        >
          <div class="w-full md:w-10 mx-auto">
            <label for="email1" class="block text-900 text-xl font-medium mb-1"
              >Email</label
            >
            <InputText
              id="email1"
              v-model="userLoginRequest.email"
              type="text"
              :class="[isInvalid ? 'p-invalid' : '', 'w-full']"
              placeholder="Email"
              style="padding: 1rem"
              :disabled="isDisabled"
            />
            <small v-if="isInvalid" id="email-help" class="p-error"
              >Email veya şifre yanlış</small
            >

            <label
              for="password1"
              class="block text-900 font-medium text-xl mt-4 mb-1"
              >Şifre</label
            >
            <InputText
              id="password1"
              v-model="userLoginRequest.password"
              type="password"
              :class="[isInvalid ? 'p-invalid' : '', 'w-full']"
              placeholder="Şifre"
              style="padding: 1rem"
              @keyup.enter="login"
              :disabled="isDisabled"
            />
            <small v-if="isInvalid" id="password-help" class="p-error"
              >Email veya şifre yanlış</small
            >

            <div class="flex align-items-center justify-content-between mb-5">
              <div class="flex align-items-center mt-4">
                <Checkbox
                  id="rememberme1"
                  v-model="checked"
                  :binary="true"
                  class="mr-2"
                  :disabled="isDisabled"
                />
                <label for="rememberme1"> Beni Hatırla </label>
              </div>

              <!-- <Button
                class="font-medium no-underline ml-2 text-right cursor-pointer"
                @click="displayModal = true"
                style="
                  color: var(--primary-color);
                  border: none;
                  background-color: transparent;
                "
                :disabled="isDisabled"
                >Şifremi Unuttum
              </Button> -->
            </div>

            <Button
              @click="login"
              :label="labelButton"
              :disabled="isDisabled"
              class="w-full p-3 text-xl"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import UserService from "../../service/setup/UserService";
export default {
  data() {
    return {
      checked: false,
      labelButton: "Giriş Yap",
      isDisabled: false,
      displayModal: false,
      isInvalid: false,
      userLoginRequest: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    logoColor() {
      if (this.$appState.darkTheme) return "white";
      return "dark";
    },
  },
  methods: {
    login() {
      this.labelButton = "Giriş Yapılıyor...";
      this.isDisabled = true;
      //VueCookies.set("usercode", 1,  60*60*2);
      //this.$router.go("/");
      this.UserService.login(this.userLoginRequest).then((response) => {
        debugger;
        if (response.data != null) {
          this.isInvalid = false;
          VueCookies.set(
            "usercode",
            response.Data,
            this.checked ? "30d" : 60 * 60 * 2
          );
          this.$toast.add({
            severity: "success",
            summary: "Giriş Başarılı",
            life: 3000,
          });
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("userType",response.data.userType);
          this.$router.go("/");
          this.labelButton = "Giriş Yap";
          this.isDisabled = false;
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Şifre veya Mail hatalı",
            life: 3000,
          });
          this.labelButton = "Giriş Yap";
          this.isDisabled = false;
          this.isInvalid = true;
        }
      });
    },
    sendMail() {
      this.displayModal = false;
      this.UserService.sendMail(this.email).then((response) => {
        if (response.Data === null) {
          this.$toast.add({
            severity: "error",
            summary: "Error Message",
            detail: "Error Message",
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "success",
            summary: "Gönderim Başarılı",
            detail: "Şifreniz mail adresinize gönderildi",
            life: 3000,
          });
        }
      });
    },
  },

  created() {
    this.UserService = new UserService();
  },
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
