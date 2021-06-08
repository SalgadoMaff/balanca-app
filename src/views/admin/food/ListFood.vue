<template>
    <v-container class="pt-10">
        <div class="pb-4 align-content-end">
            <v-btn color="primary" @click="openModal">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Table :items="foods" :headers="headers"/>
        <Modal :open="showModal" :loading="loading" title="Novo Alimento" @close="closeModal" @save="saveFood">
            <div slot="body">
                <v-text-field v-model="food.name" label="Nome" autofocus :rule="validations.name" required/>
                <v-text-field v-model="food.calPerGram" label="Caloria por grama" :rule="validations.calPerGram" type="number" required/>
            </div>
        </Modal>
    </v-container>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex"
import Table from "@/components/Table"
import Modal from "@/components/Modal"
export default {
    name: "ListFood",
    components: {
        Table,
        Modal
    },
    data: () => ({
        loading: false,
        showModal: false,
        food: {
            name: "",
            calPerGram: ""
        },
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
        ],
        validations: {
            name: [val => (val || '').length > 0 || 'Este campo é obrigatório'],
            calPerGram: [val => !!val || 'Este campo é obrigatório']
        }
    }),
    computed: {
        ...mapGetters("food", ["getFoods"])
    },
    async mounted() {
        await this.findFoods()
    },
    methods: {
        ...mapActions("food", ["findAllFoods", "createFood"]),
        ...mapMutations("error", ["setSuccess"]),
        async findFoods() {
            await this.findAllFoods()
            this.foods = this.getFoods
        },
        async saveFood() {
            this.loading = true
            const created = await this.createFood(this.food)
            if (created) {
                await this.findFoods()
                this.closeModal()
                this.setSuccess({ message: "Alimento cadastrado com sucesso." })
            }
            this.loading = false
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
                calPerGram: ""
            }
        }
    }
}
</script>

<style scoped>

</style>