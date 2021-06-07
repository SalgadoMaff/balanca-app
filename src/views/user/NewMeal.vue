<template>
    <v-container>
        <v-card>
            <v-card-title>Nova Refeição</v-card-title>

            <v-card-text class="text-primary">
                <v-col cols="12">
                    <v-row class="mb-2 align-center">
                        <v-autocomplete :items="foods" v-model="food.foodId" item-text="name" item-value="_id"
                                        label="Informe o alimento" no-data-text="Sem alimento" />

                        <v-text-field v-model="food.quantity" type="number" label="Informe a quantidade" />

                        <v-btn @click="addFoodToMeal" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>

                    <v-row class="mb-2">
                        <v-chip class="mr-2" v-for="item in meal" :key="item._id" close close-icon="mdi-close">
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

                <v-btn class="primary" @click="saveMeal" :loading="loading" :disabled="loading">
                    <v-icon>mdi-content-save</v-icon>
                    <span>Salvar</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"

export default {
    name: "NewMeal",
    data() {
        return {
            foods: [],
            food: {
                foodId: "",
                quantity: ""
            },
            meal: [],
            loading: false
        }
    },
    computed: {
        ...mapGetters("food", ["getFoods"]),
        ...mapGetters("user", ["getUser"])
    },
    async mounted() {
        await this.findFoods()
    },
    methods: {
        ...mapActions("food", ["findAllFoods"]),
        ...mapActions("meal", ["createMeal"]),
        ...mapMutations("error", ["setError", "setSuccess"]),
        async findFoods() {
            await this.findAllFoods()
            this.foods = this.getFoods
        },
        addFoodToMeal() {
            const valid = this.validateFood()
            if (valid) {
                const food = this.foods.find((f) => f._id == this.food.foodId)
                this.meal.push({
                    foodId: this.food.foodId,
                    quantity: this.food.quantity,
                    name: food.name
                })
                this.clearInput()
            }
        },
        async saveMeal() {
            this.loading = true
            const valid = this.validateMeal()
            if (valid) {
                const created = await this.createMeal({
                    userId: this.getUser._id,
                    meal: this.meal
                })

                if (created) {
                    this.setSuccess({ message: "Refeição criada com sucesso!" })
                    this.clearAll()
                }
            }
            this.loading = false
        },
        validateFood() {
            if (!this.food.foodId) {
                this.setError({ message: "Selecione o alimento!" })
                return false
            }
            if (!this.food.quantity) {
                this.setError({ message: "Informe a quantidade!" })
                return false
            }
            return true
        },
        validateMeal() {
            if (this.meal.length < 1) {
                this.setError({ message: "Adicione ao menos um alimento!" })
                return false
            }
            return true
        },
        clearAll() {
            this.clearInput()
            this.clearMeal()
        },
        clearInput() {
            this.food.foodId = ""
            this.food.quantity = ""
        },
        clearMeal() {
            this.meal = []
        }
    }
}
</script>
