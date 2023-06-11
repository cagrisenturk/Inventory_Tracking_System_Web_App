<template>
    <div class="post">
        <div v-if="loading" class="loading">
            Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationvue">https://aka.ms/jspsintegrationvue</a> for more details.
        </div>

        <div v-if="havaDurumuVerileri" class="content">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                        <th>Test</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="durum in havaDurumuVerileri" :key="durum.date">
                        <td>{{ durum.date }}</td>
                        <td>{{ durum.temperatureC }}</td>
                        <td>{{ durum.temperatureF }}</td>
                        <td>{{ durum.summary }}</td>
                        <td>{{ durum.test }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


        <input type="text" v-model="SayacAdi" />
        <input type="number" v-model="SayacTipi" />

        <button v-on:click="MarkayiApiyeGonder()"> Markayý Gönder </button>
    </div>
</template>

<script lang="js">
    import axios from 'axios'
    export default {
        data() {
            return {
                loading: false,
                //havaDurumuVerileri: null,
                SayacAdi: null,
                SayacTipi:1
            };
        },
        created() {
            // fetch the data when the view is created and the data is
            // already being observed
            this.fetchData();
        },
        watch: {
            // call again the method if the route changes
            '$route': 'fetchData'
        },
        methods: {
            fetchData() {
                this.havaDurumuVerileri = null;
                this.loading = true;
                axios.get('api/weatherforecast').then(json => {
                    console.log(json)
                    this.havaDurumuVerileri = json.data;
                    this.loading = false;
                    return;
                });
                console.log("test aga")

            },
            async MarkayiApiyeGonder() {
                console.log("test")
                let answer = await axios.post('api/sayacmarka', { name: this.SayacAdi, type: this.SayacTipi })
                console.log(answer)

                 
            }
        },
    }
</script>