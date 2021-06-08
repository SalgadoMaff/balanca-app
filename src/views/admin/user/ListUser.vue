<template>
    <Table :items="users" :headers="headers"/>
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
            await this.findAllUsers()
            this.users = this.getUsers
        }
    },
    watch: {
        getUsers() {
            this.users = this.getUsers
        }
    }
}
</script>