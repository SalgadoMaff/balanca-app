<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            class="elevation-2"
            :search="search"
            :custom-filter="filterOnlyCapsText"
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
        }
    },
    methods: {
        search() {},
        filterOnlyCapsText() {},
        calories() {}
    }
}
</script>

<style scoped>

</style>