<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            class="elevation-2"
            :no-data-text="noDataText"
        >
        </v-data-table>
    </div>
</template>

<script>
export default {
    name: "Table",
    props: {
        items: {
            type: Array,
            default: () => ([])
        },
        headers: {
            type: Array,
            default: () => ([])
        },
        noDataText: {
            type: String,
            default: 'Dados não encontrados.'
        }
    },
    methods: {
    }
}
</script>

<style scoped>

</style>