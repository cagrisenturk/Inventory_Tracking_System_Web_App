
<template>
  <!-- eslint-disable-line -->  <Dropdown v-model="modelValue" :options="selectOptions" :optionLabel="settings.value" :optionValue="settings.key"  @change="updateValue" :filter="true" @filter="filterData"  />
</template>


<script>

    import axios from "axios";

    export default {
        props: {
            modelValue: Number,
            settings: Object,
            
        },
        data() {
            return {
                filterChanhed:false,
                selectOptions: [ ]
            }
        },
        created() {
            console.log(this.modelValue)

            this.InputInit();
        },
        watch: {
            modelValue(n,o) {
                console.log(n)
                console.log(o)
                this.InputInit();
            },
            'settings.filter':function(n,o){
                console.log(n)
                console.log(o)
                this.filterChanhed=true
                this.InputInit(); 
            }

        },
        methods: {
            InputInit() {
                if (this.filterChanhed==true ||this.selectOptions.find(s => s[this.settings.key] == this.modelValue) == null) {
                    var filter = "";
                    if (this.filterChanhed==false && this.modelValue) {
                        filter =   this.settings.key + " eq " + this.modelValue
                    }
  
                   this.filterChanhed=false

                    this.get(filter);
                }
            },
            updateValue(event) {
                console.log(event)
                this.$emit('update:modelValue', event.value);
            },
            filterData(event) {
                console.log(event);
                var filter = "contains(" + this.settings.value + ",'" + event.value + "')"
               
                this.get(filter);
            },

            get(filter) {
                 if(this.settings.filter){
                    filter=filter==""?this.settings.filter:filter+" and "+this.settings.filter;
                }

                filter=(filter==""?"":"&$filter= "+filter);

                return axios.get(this.settings.url + "?top=10&$orderby=" + this.settings.value + " asc&$select=" + this.settings.key + "," + this.settings.value + "" + filter).then((response) => {
                    console.log(response.data);
                    this.selectOptions = response.data.value;
                    return response.data;
                });
            }
        }
    }
</script>