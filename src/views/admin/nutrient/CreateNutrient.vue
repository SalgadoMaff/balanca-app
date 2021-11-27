<template>
    <div>
        <div class="pb-4 align-content-end">
            <v-btn color="primary" @click="openModal">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Modal :open="showModal" :loading="loading" title="Novo Nutriente" @close="closeModal" @save="saveNutrient">
            <v-card flat slot="body">
                <v-form v-model="validData" ref="formData" lazy-validation>
                    <v-text-field v-model="nutrient.name" label="Nome" autofocus :rules="[validations.length]"
                                  required />
                    <v-autocomplete v-model="nutrient.type" :items="nutrientType" item-text="name" item-value="type"
                                    label="Tipo" :rules="[validations.unit]" required />
                </v-form>
            </v-card>
        </Modal>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"
import Modal from "@/components/Modal"

export default {
    name: "CreateNutrient",
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
        nutrient: {
            name: "",
            type: ""
        },
        nutrientType: [
            {
                type: "CARBOHYDRATE",
                name: "Carboidrato"
            },
            {
                type: "PROTEIN",
                name: "Proteína"
            },
            {
                type: "FAT",
                name: "Gordura"
            },
            {
                type: "VITAMIN",
                name: "Vitamina"
            },
            {
                type: "MINERALS",
                name: "Mineral"
            }
        ],
        loading: false,
        showModal: false,
        validData: true,
        validations: {
            length: val => (val || "").length > 0 || "Este campo está inválido",
            type: val => !!["CARBOHYDRATE", "PROTEIN", "FAT", "VITAMIN", "MINERALS"].includes(val) || "Este campo está inválido"
        }
    }),
    computed: {
        ...mapGetters("nutrient", ["getNutrients"])
    },
    methods: {
        ...mapActions("nutrient", ["findAllNutrients", "createNutrient"]),
        ...mapMutations("error", ["setSuccess"]),
        async saveNutrient() {
            if (this.validData) {
                this.loading = true
                await this.create()
                this.loading = false
            }
        },
        async create() {
            const created = await this.createNutrient(this.nutrient)
            if (created) {
                await this.findAllNutrients()
                this.closeModal()
                this.setSuccess({ message: "Alimento cadastrado com sucesso." })
            }
        },
        openModal() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.clearModalData()
            this.$refs.formData.reset()
        },
        clearModalData() {
            this.nutrient = {
                name: "",
                type: ""
            }
        }
    },
    watch: {
        data() {
            if (this.data) {
                this.nutrient = { ...this.data }
                this.openModal()
            }
        }
    }
}
</script>