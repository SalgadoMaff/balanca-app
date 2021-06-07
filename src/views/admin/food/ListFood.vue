<template>
    <v-container class="pt-10">
        <div class="pb-4 align-content-end">
            <v-btn color="primary">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Table :items="foods" :headers="headers"/>
    </v-container>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
import Table from "@/components/Table"
export default {
    name: "ListFood",
    components: {
        Table
    },
    data: () => ({
        loading: false,
        foods: [],
        headers: [
            {
                text: 'Nome',
                align: 'start',
                sortable: true,
                value: 'name'
            },
            {
                text: 'Caloria por Grama',
                align: 'start',
                sortable: false,
                value: 'calPerGram'
            }
        ]
    }),
    computed: {
        ...mapGetters("food", ["getFoods"])
    },
    async mounted() {
        await this.findFoods()
    },
    methods: {
        ...mapActions("food", ["findAllFoods"]),
        async findFoods() {
            this.loading = true
            await this.findAllFoods()
            this.foods = this.getFoods
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>