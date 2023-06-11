<template>
  <Card>
    <template #title>
      <span v-if="inventoryId != 0">Envanter Düzenle</span>
      <span v-if="inventoryId == 0">Yeni Envanter Oluştur</span>
      <Button
        icon="pi pi-times"
        type="button"
        class="p-button-text red"
        style="float: right; display: inline-block"
        v-on:click="$emit('close')"
      ></Button>
      <Button
        v-if="inventoryId != 0"
        icon="pi pi-trash"
        type="button"
        class="p-button-text red"
        style="float: right; display: inline-block"
        v-on:click="deleteMeasurementPoint()"
      ></Button>
      <Button
        icon="pi pi-check"
        type="button"
        class="p-button-text"
        style="float: right; display: inline-block"
        v-on:click="saveMeasurementPoint()"
      ></Button>
    </template>
    <template #content>
      <br />
      <div class="p-fluid grid">
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <InputText id="Name" type="text" v-model="inventory.name" />
            <label for="Name">Adı</label>
          </span>
        </div>
        <div class="field col-12 md:col-6" v-if="inventoryId!=0">
          <span class="p-float-label"> </span>
        </div>
        <div class="field col-12 md:col-6" v-if="inventoryId!=0">
          <span class="p-float-label">
            <img id="getImage" src="" />
          </span>
        </div>
        <div class="field col-12 md:col-6" v-if="inventoryId!=0">
          <span class="p-float-label">
            <img id="putImage" src="" style="margin-left: 2rem" />
          </span>
        </div>
        <div class="field col-12 md:col-6" v-if="inventoryId!=0">
          <h5 style="margin-left: 3rem">Alma QR Kodu</h5>
        </div>
        <div class="field col-12 md:col-6" v-if="inventoryId!=0">
          <h5 style="margin-left: 5rem">Bırakma QR Kodu</h5>
        </div>
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
        "
        v-if="inventoryId!=0"
      >
        <Button
          icon="pi pi-download"
          type="button"
          class="p-button-text green"
          label="QR Kodları İndir"
          v-on:click="downloadQRCode()"
        ></Button>
      </div>
    </template>
  </Card>
</template>

<script lang="js">
    import InventoryService from "../../../service/Inventory/InventoryService";
    import { FilterMatchMode } from "primevue/api";
    export default {
        data() {
            return {
                inventory: { Id: 0 },
                UnitNames: [],
                measurementDeviceId: 0,
                measurementTypeValue :null,
                filters: {
                   Id: { value:0 , matchMode: FilterMatchMode.EQUALS },
                    },
                 lazyParams: {},
            };
        },
        props: ['inventoryId'],
        emits: ['refresh', 'close'],
        created() {
              this.lazyParams = {
              first: 0,
              rows: 100,
              sortField: null,
              sortOrder: null,
              filters: this.filters,
              select: null,
          };
            this.getMeasurementPoint();

        },
        watch: {
          inventoryId() {
                this.getMeasurementPoint();
            },
        },
        methods: {
          downloadQRCode(){
            const imgGet = new Image();
            imgGet.src = document.getElementById("getImage").src;
            const get = document.createElement("a");
            get.href = document.getElementById("getImage").src;
            get.download = "AlmaQRKodu"+this.inventory.name+".png";
            get.click();
            const imgput = new Image();
            imgput.src = document.getElementById("putImage").src;
            const put = document.createElement("a");
            put.href = document.getElementById("putImage").src;
            put.download = "BırakmaQRKodu"+this.inventory.name+".png";
            put.click();
          },
            getMeasurementPoint() {
                if (this.inventoryId == 0) {
                    this.inventory = { id: 0 };
                    return;
                }
                new InventoryService().getById(this.inventoryId).then((data) => {
                    console.log(data);
                    debugger;
                    this.inventory = data.data;
                    var getBase64 = "data:image/png;base64,"+data.data.getQrCode;
                    document.getElementById("getImage").src = getBase64;
                    var putBase64 = "data:image/png;base64,"+data.data.putQrCode;
                    document.getElementById("putImage").src = putBase64;
                    console.log(this.inventory);
                })
            },

            saveMeasurementPoint() {
                console.log(this.inventory);
                if(this.inventory.id==0){
                new InventoryService().addInventory(this.inventory).then((response) => {
                    console.log(response);
                    if (response.data=="Kayıt Başarılı") {
                        this.$toast.add({ severity: 'success', summary: 'Başarılı', detail: response.data, life: 3000 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Hata!', detail: response.data, life: 3000 });
                        return;
                    }
                    this.measurementPoint = response.Data;
                    this.$emit('refresh');
                     this.$emit('close');
                })
              }
              else{
                new InventoryService().updateInventory(this.inventory).then((response) => {

                    if (response.data.status) {
                        this.$toast.add({ severity: 'success', summary: 'Başarılı', detail: response.Message, life: 3000 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Hata!', detail: response.Message, life: 3000 });
                        return;
                    }
                    this.measurementPoint = response.Data;
                    this.$emit('refresh');
                     this.$emit('close');
                })
              }
            },
            deleteMeasurementPoint() {
                var isOk = confirm("Silmek istediğinize emin misiniz?");
                if (!isOk) {
                    return;
                }
                new InventoryService().deleteInventory(this.inventoryId).then((response) => {
                    if (response) {
                        this.$toast.add({ severity: 'success', summary: 'Başarılı', detail: response.Message, life: 3000 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Hata!', detail: response.Message, life: 3000 });
                        return;
                    }
                    this.$emit('refresh')
                    this.$emit('close')
                });
            },

        },
}
</script>
