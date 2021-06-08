<template>
    <div>
        <div class="pb-4 align-content-end">
            <v-btn color="primary" @click="openModal">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Modal :open="showModal" :loading="loading" title="Novo Usuário" @close="closeModal" @save="saveUser">
            <div slot="body">
                <v-text-field v-model="user.name" label="Nome" autofocus required/>
                <v-text-field v-model="user.username" label="Nome de usuário" required/>
                <v-select v-model="user.role" label="Permissão" :items="roles" item-text="text" item-value="value"/>
                <v-text-field v-model="user.password" label="Senha" required/>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex"
import Modal from "@/components/Modal"
export default {
    name: "CreateUser",
    components: {
        Modal
    },
    data: () => ({
        loading: false,
        showModal: false,
        user: {
            name: "",
            username: "",
            role: "",
            password: ""
        },
        roles: [
            { 
                text: "Administrador",
                value: "ADMIN"
            },
            {
                text: "Usuário",
                value: "USER"
            }
        ]
    }),
    methods: {
        ...mapActions("user", ["findAllUsers", "createUser"]),
        ...mapMutations("error", ["setSuccess"]),
        async saveUser() {
            this.loading = true
            const created = await this.createUser(this.user)
            if (created) {
                await this.findAllUsers()
                this.closeModal()
                this.setSuccess({ message: "Usuário cadastrado com sucesso." })
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
            this.user = {
                name: "",
                username: "",
                role: "",
                password: ""
            }
        }
    }
}
</script>