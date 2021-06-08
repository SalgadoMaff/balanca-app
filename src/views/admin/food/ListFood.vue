<template>
    <Table :items="foods" :headers="headers" @delete="removeFood"/>
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
                text: 'Caloria por Grama',
                align: 'start',
                sortable: false,
                value: 'calPerGram'
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
        ...mapActions("food", ["findAllFoods", "deleteFood"]),
        ...mapMutations("error", ["setSuccess"]),
        async findFoods() {
            await this.findAllFoods()
            this.foods = this.getFoods
        },
        async removeFood(food) {
            const success = await this.deleteFood(food._id)
            if (success) {
                await this.findFoods()
                this.setSuccess({ message: `Alimento '${food.name}' excluído com sucesso.` })
            }
        }
    },
    watch: {
        getFoods() {
            this.foods = this.getFoods
        }
    }
}
</script>