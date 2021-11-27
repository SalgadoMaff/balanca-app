<template>
    <Table :items="nutrients" :headers="headers" />
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"
import Table from "@/components/Table"

export default {
    name: "ListNutrient",
    components: {
        Table
    },
    data: () => ({
        nutrients: [],
        nutrientType: {
            CARBOHYDRATE: "Carboidrato",
            PROTEIN: "Proteína",
            FAT: "Gordura",
            VITAMIN: "Vitamina",
            MINERALS: "Mineral"
        },
        headers: [
            {
                text: "Nome",
                align: "start",
                sortable: true,
                value: "name"
            },
            {
                text: "Tipo",
                align: "start",
                sortable: false,
                value: "typeShow"
            }
        ]
    }),
    computed: {
        ...mapGetters("nutrient", ["getNutrients"])
    },
    async mounted() {
        await this.findFoods()
    },
    methods: {
        ...mapActions("nutrient", ["findAllNutrients"]),
        ...mapMutations("error", ["setSuccess"]),
        async findFoods() {
            await this.findAllNutrients()
            this.nutrients = this.getNutrients
            this.nutrients.forEach(nutrient => {
                nutrient.typeShow = this.nutrientType[nutrient.type]
            })
        }
    },
    watch: {
        getNutrients() {
            this.nutrients = this.getNutrients
            this.nutrients.forEach(nutrient => {
                nutrient.typeShow = this.nutrientType[nutrient.type]
            })
        }
    }
}
</script>