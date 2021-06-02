<template>
    <v-container>
        <v-card>
            <v-card-title>Nova Refeição</v-card-title>

            <v-card-text class="text-primary">
                <v-col cols="12">
                    <v-row class="mb-2 align-center">
                        <v-autocomplete
                            :items="foods"
                            v-model="plate.foodId"
                            item-text="name"
                            item-value="_id"
                            label="Informe o alimento"
                            no-data-text="Sem alimento"
                        />

                        <v-text-field
                            v-model="plate.quantity"
                            type="number"
                            label="Informe a quantidade"
                        />

                        <v-btn @click="addFoodToMeal" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>

                    <v-row class="mb-2">
                        <v-chip
                            class="mr-2"
                            v-for="item in meal"
                            :key="item._id"
                            close
                            close-icon="mdi-close"
                        >
                            <span>{{ item.name }} - {{ item.quantity }}</span>
                        </v-chip>
                    </v-row>
                </v-col>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn @click="clearAll">
                    <v-icon>mdi-cancel</v-icon>
                    <span>Cancelar</span>
                </v-btn>

                <v-btn class="primary" @click="saveMeal">
                    <v-icon>mdi-content-save</v-icon>
                    <span>Salvar</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
export default {
    name: "NewMeal",
    data() {
        return {
            foods: [],
            plate: {
                foodId: "",
                quantity: "",
            },
            meal: []
        }
    },
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
        },
        addFoodToMeal() {
            const food = this.foods.find((f) => f._id == this.plate.foodId)
            this.meal.push({
                foodId: this.plate.foodId,
                quantity: this.plate.quantity,
                name: food.name
            })
            this.clearInput()
        },
        saveMeal() {
            // TODO
        },
        clearAll() {
            this.clearInput()
            this.clearMeal()
        },
        clearInput() {
            this.plate.foodId = ""
            this.plate.quantity = ""
        },
        clearMeal() {
            this.meal = []
        }
    }
}
</script>
