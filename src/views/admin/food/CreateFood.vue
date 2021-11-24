<template>
    <div>
        <div class="pb-4 align-content-end">
            <v-btn color="primary" @click="openModal">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Modal :open="showModal" :loading="loading" title="Novo Alimento" @close="closeModal" @save="saveFood">
            <v-card flat slot="body">
                <v-form v-model="validData" ref="formData" lazy-validation>
                    <v-text-field v-model="food.name" label="Nome" autofocus :rules="[validations.length]" required />
                    <v-text-field v-model="food.servingSize.value" label="Porção" :rules="[validations.number]"
                                  required />
                    <v-combobox v-model="food.servingSize.unit" :items="unitMeasures" label="Unidade da porção"
                                :rules="[validations.unit]" required />
                    <v-text-field v-model="food.calories" label="Calorias" :rules="[validations.number]" required />
                </v-form>
                <v-form v-model="validNutritionFact" ref="formNutritionFact" lazy-validation>
                    <v-card-title class="label-nutrient">Nutrientes:</v-card-title>
                    <div class="d-flex flex-wrap">
                        <v-chip class="mb-2 mr-2" v-for="item in food.nutritionFacts" :key="item.nutrient.name" close
                                close-icon="mdi-close" @click:close="removeNutritionFact(item.nutrient)">
                            <span>
                                {{ nutrientType[item.nutrient.type] }} - {{ item.nutrient.name }} - {{ item.amount.value
                                }} {{ item.amount.unit }}
                            </span>
                        </v-chip>
                    </div>
                    <v-combobox v-model="nutritionFact.nutrient" label="Selecione o nutriente" required
                                :items="getNutrients" :rules="[validations.object]" item-text="name" />
                    <v-text-field v-model="nutritionFact.amount.value" label="Porção" :rules="[validations.number]"
                                  required />
                    <v-combobox v-model="nutritionFact.amount.unit" :items="unitMeasures" label="Unidade da porção"
                                :rules="[validations.unit]" required />
                    <v-row class="pt-2" align="center" justify="space-around">
                        <v-btn @click="addNutritionFact" :disabled="!validNutritionFact">Adicionar Nutriente</v-btn>
                    </v-row>
                </v-form>
            </v-card>
        </Modal>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"
import Modal from "@/components/Modal"

export default {
    name: "CreateFood",
    components: {
        Modal
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data: () => ({
        nutritionFact: {
            nutrient: null,
            amount: {
                unit: "",
                value: ""
            }
        },
        food: {
            name: "",
            calories: "",
            servingSize: {
                unit: "",
                value: ""
            },
            nutritionFacts: []
        },
        loading: false,
        showModal: false,
        unitMeasures: ["mg", "g", "kg"],
        nutrientType: {
            CARBOHYDRATE: "Carboidrato",
            PROTEIN: "Proteína",
            FAT: "Gordura",
            VITAMIN: "Vitamina",
            MINERALS: "Mineral"
        },
        validData: true,
        validNutritionFact: true,
        validations: {
            length: val => (val || "").length > 0 || "Este campo está inválido",
            number: val => !!val && !!Number(val) || "Este campo está inválido",
            unit: val => !!["mg", "g", "kg"].includes(val) || "Este campo está inválido",
            object: val => (!!val && Object.keys(val).length > 0) || "Este campo está inválido"
        }
    }),
    async mounted() {
        await this.findAllNutrients()
    },
    computed: {
        ...mapGetters("nutrient", ["getNutrients"])
    },
    methods: {
        ...mapActions("nutrient", ["findAllNutrients"]),
        ...mapActions("food", ["findAllFoods", "createFood", "updateFood"]),
        ...mapMutations("error", ["setSuccess"]),
        async saveFood() {
            if (this.validData && this.validNutritionFact) {
                this.loading = true
                this.food.nutritionFacts.forEach(nutritionFact => {
                    nutritionFact.nutrient = nutritionFact.nutrient._id
                })
                if (this.food._id) {
                    await this.update()
                } else {
                    await this.create()
                }
                this.loading = false
            }
        },
        async create() {
            const created = await this.createFood(this.food)
            if (created) {
                await this.findAllFoods()
                this.closeModal()
                this.setSuccess({ message: "Alimento cadastrado com sucesso." })
            }
        },
        async update() {
            const updated = await this.updateFood(this.food)
            if (updated) {
                await this.findAllFoods()
                this.closeModal()
                this.setSuccess({ message: "Alimento atualziado com sucesso." })
            }
        },
        addNutritionFact() {
            let nutri = JSON.parse(JSON.stringify(this.nutritionFact))
            this.food.nutritionFacts.push(nutri)
            this.$refs.formNutritionFact.reset()
            this.nutritionFact = {
                nutrient: null,
                amount: {
                    unit: "",
                    value: ""
                }
            }
        },
        removeNutritionFact(nutri) {
            this.food.nutritionFacts.splice(this.food.nutritionFacts.indexOf(nutri), 1)
        },
        openModal() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.clearModalData()
            this.$refs.formData.reset()
            this.$refs.formNutritionFact.reset()
        },
        clearModalData() {
            this.food = {
                name: "",
                calories: "",
                servingSize: {
                    unit: "",
                    value: ""
                },
                nutritionFacts: []
            }
        }
    },
    watch: {
        data() {
            if (this.data) {
                this.food = { ...this.data }
                this.openModal()
            }
        }
    }
}
</script>
<style lang="sass">
.label-nutrient
    margin-left: -18px
</style>