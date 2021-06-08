<template>
    <div>
        <v-data-table :headers="headers" :items="items" item-key="name" :no-data-text="noDataText"
                      class="elevation-2">
            <template v-slot:item.actions="{ item }">
                <v-btn small icon @click="$emit('delete', item)">
                    <v-icon small>mdi-delete</v-icon>
                </v-btn>
            </template>
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