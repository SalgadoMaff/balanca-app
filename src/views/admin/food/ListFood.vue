<template>
    <Table :items="foods" :headers="headers" @edit="editFood"/>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"
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
                text: 'Calorias',
                align: 'start',
                sortable: false,
                value: 'calories'
            },
            {
                text: 'Ações',
                align: 'center',
                sortable: false,
                width: '10%',
                value: 'actions'
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
        ...mapActions("food", ["findAllFoods", "updateFood"]),
        ...mapMutations("error", ["setSuccess"]),
        async findFoods() {
            await this.findAllFoods()
            this.foods = this.getFoods
        },
        async editFood(food) {
            this.$emit('edit', food)
        }
    },
    watch: {
        getFoods() {
            this.foods = this.getFoods
        }
    }
}
</script>