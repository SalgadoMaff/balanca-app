<template>
    <v-container class="pt-10">
        <div class="pb-4 align-content-end">
            <v-btn color="primary">
                <v-icon>mdi-plus</v-icon>
                <span>Novo</span>
            </v-btn>
        </div>
        <Table :items="users" :headers="headers"/>
    </v-container>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
import Table from "@/components/Table"
export default {
    name: "ListUser",
    components: {
        Table
    },
    data: () => ({
        loading: false,
        users: [],
        headers: [
            {
                text: 'Nome',
                align: 'start',
                sortable: true,
                value: 'name'
            },
            {
                text: 'Usuário',
                align: 'start',
                sortable: true,
                value: 'username'
            },
            {
                text: 'Tipo',
                align: 'start',
                sortable: false,
                value: 'role'
            }
        ]
    }),
    computed: {
        ...mapGetters("user", ["getUsers"])
    },
    async mounted() {
        await this.findUsers()
    },
    methods: {
        ...mapActions("user", ["findAllUsers"]),
        async findUsers() {
            this.loading = true
            await this.findAllUsers()
            this.users = this.getUsers
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>