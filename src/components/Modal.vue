<template>
    <v-dialog v-model="open" persistent max-width="500">
        <v-card>
            <v-card-title>
                <span>{{title}}</span>
                <v-spacer/>
                <v-btn icon small @click="emitCloseEvent">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider/>
            
            <v-card-text>
                <v-container>
                    <slot name="body"/>
                </v-container>
            </v-card-text>

            <v-divider/>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="primary" text @click="emitSaveEvent" :loading="loading" :disabled="loading">Salvar</v-btn>
                <v-spacer/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "Modal",
    props: {
        open: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        emitCloseEvent() {
            this.$emit('close')
        },
        emitSaveEvent() {
            this.$emit('save')
        }
    }
}
</script>