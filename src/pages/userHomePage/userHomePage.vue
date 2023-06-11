<template>
  <Toast />
  <div class="grid">
    <div class="col-12 xl:col-6">
        <div class="card" > 
      <div>
        <qrcode-stream @init="onInit" @decode="onDecode" ></qrcode-stream>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";
import axios from "axios";
export default {
  components: {
    QrcodeStream,
  },
  methods: {
    getInventory(){
      axios.post(this.decodedString,this.InventoryGetAndPutRequest).then( (response) => {
        console.log(response);
        this.$toast.add({
            severity: "success",
            summary: "Gönderim Başarılı",
            detail: response.data,
            life: 6000,
          });
                    return;
                });
    },
    async onInit(promise) {
      // show loading indicator

      try {
        const { capabilities } = await promise;
        console.log(capabilities);

      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "user denied camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "no suitable camera device installed";
          // no suitable camera device installed
        } else if (error.name === "NotSupportedError") {
          this.error = "page is not served over HTTPS (or localhost)";
          // page is not served over HTTPS (or localhost)
        } else if (error.name === "NotReadableError") {
          this.error = "maybe camera is already in use";
          // maybe camera is already in use
        } else if (error.name === "OverconstrainedError") {
          this.error =
            "did you requested the front camera although there is none?";
          // did you requested the front camera although there is none?
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "browser seems to be lacking features";
          // browser seems to be lacking features
        }
      } finally {
        // hide loading indicator
      }
    },
    onDecode(decodedString) {
      this.decodedString=decodedString;
    },
  },
  data() {
    return {
      error: "",
      decodedString:"",
      InventoryGetAndPutRequest:{id:localStorage.userId}
    };
  },
  watch: {
    decodedString() {
                this.getInventory();
            },
        },
  beforeUnmount() {},
};
</script>
