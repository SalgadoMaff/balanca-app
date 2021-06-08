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
                <v-text-field v-model="food.calPerGram" label="Caloria por grama" :rule="validations.calPerGram" type="number" required/>
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
    data: () => ({
        loading: false,
        showModal: false,
        food: {
            name: "",
            calPerGram: ""
        },
        validations: {
            name: [val => (val || '').length > 0 || 'Este campo é obrigatório'],
            calPerGram: [val => !!val || 'Este campo é obrigatório']
        }
    }),
    methods: {
        ...mapActions("food", ["findAllFoods", "createFood"]),
        ...mapMutations("error", ["setSuccess"]),
        async saveFood() {
            this.loading = true
            const created = await this.createFood(this.food)
            if (created) {
                await this.findAllFoods()
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