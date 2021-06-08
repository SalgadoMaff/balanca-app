<template>
    <Table :items="foods" :headers="headers"/>
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
            await this.findAllFoods()
            this.foods = this.getFoods
        }
    },
    watch: {
        getFoods() {
            this.foods = this.getFoods
        }
    }
}
</script>