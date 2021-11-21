<template>
    <div>
        <div class="pb-4 align-content-end">
            <v-btn color="primary" @click="openModal">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Modal :open="showModal" :loading="loading" title="Novo Alimento" @close="closeModal" @save="saveFood">
            <div slot="body">
                <v-text-field v-model="food.name" label="Nome" autofocus :rule="validations.name" required/>
                <v-text-field v-model="food.servingSize.value" label="Porção"  :rule="validations.number" required/>
                <v-combobox v-model="food.servingSize.unit" :items="unit_measures" label="Unidade da porção" :rule="validations.unit" required/>
                <v-text-field v-model="food.calories" label="Calorias" :rule="validations.number" type="number" required/>
                <v-chip class="mr-2" v-for="item in food.nutritionFacts" :key="item.nutrient.name" close close-icon="mdi-close" @click:close="removeNutritionFact(item.nutrient)">
                    <span>{{ item.nutrient.name }} - {{item.nutrient.type}} - {{item.amount.value}} {{item.amount.unit}}</span>
                </v-chip>
                
                <v-combobox v-model="NutritionFact.nutrient.type" :items="nutrient_types" label="Selecione o tipo de nutriente" required/>
                <v-text-field v-model="NutritionFact.nutrient.name" label="Nome do nutriente" :rule="validations.name" required/>
                <v-text-field v-model="NutritionFact.amount.value" label="Porção" :rule="validations.number" type="number" required/>
                <v-combobox v-model="NutritionFact.amount.unit" :items="unit_measures" label="Unidade da porção" :rule="validations.unit" required/>
                <v-btn @click="addNutritionfact">
                    Adicionar Nutriente
                </v-btn>
            </div>  
        </Modal>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex"
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
        loading: false,
        showModal: false,
        NutritionFact:{
            nutrient:{
                name:"",
                type:"",
            },
            amount:{
                unit:"",
                value:""
            }
        },
        servingSize:{
            unit:"",
            value:""
        },
        unit_measures:['mg','g','kg'],
        nutrient_types:['Carbohidrato','Proteina','Gordura','Vitamina','Mineral'],
        food: {
            name: "",
            calories: "",
            servingSize:{},
            nutritionFacts:[]
        },
        validations: {
            name: [val => (val || '').length > 0 || 'Este campo é obrigatório'],
            number: [val => !!val || 'Este campo é obrigatório'],
            unit:[val =>(val == 'g'|| val== 'kg'|| val=='mg')||'Este campo é obrigatório']
        }
    }),
    methods: {
        ...mapActions("food", ["findAllFoods", "createFood", "updateFood"]),
        ...mapMutations("error", ["setSuccess"]),
        async saveFood() {
            this.loading = true
            this.food.nutritionFacts.forEach(element => {
                switch(element.nutrient.type){
                    case 'Carbohidrato':
                        element.nutrient.type='CARBOHYDRATE'
                        break
                    case 'Proteina':
                        element.nutrient.type='PROTEIN'
                        break
                    case 'Gordura':
                        element.nutrient.type='FAT'
                        break
                    case 'Vitamina':
                        element.nutrient.type='VITAMIN'
                        break
                    case 'Mineral':
                        element.nutrient.type='MINERALS'
                        break
                    default:
                        break
                }
            });
            if (this.food._id) {
                this.update()
            } else {
                this.create()
            }
            this.loading = false
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
        addNutritionfact(){
            let Nutri=JSON.parse(JSON.stringify(this.NutritionFact))
            this.food.nutritionFacts.push(Nutri)
            this.NutritionFact.nutrient.name=""
            this.NutritionFact.nutrient.type=""
            this.NutritionFact.amount.unit=""
            this.NutritionFact.amount.value=""   
        },
        removeNutritionFact(nutri){
            this.food.nutritionFacts.splice(this.food.nutritionFacts.indexOf(nutri),1)
        },
        openModal() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.clearModalData()
        },
        clearModalData() {
            this.food = {
                name: "",
                calories: "",
                servingSize:{
                    unit:"",
                    value:""
                },
                nutritionFacts:[]
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