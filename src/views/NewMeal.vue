<template>
  <v-container>
    <v-card>
      <v-card-title>Nova Refeição</v-card-title>

      <v-card-title class="text-primary">
        <v-col cols="12">
          <v-row class="mb-2 align-center">
            <v-autocomplete :items="foods" v-model="foodId" item-text="name" item-value="_id" 
                            label="Informe o alimento" no-data-text="Sem alimento"/>

            <v-text-field v-model="quantity" type="number" label="Informe a quantidade"/>

            <v-btn @click="addFoodToMeal" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-row>

          <v-row class="mb-2">
            <v-chip class="mr-2" v-for="item in meal" :key="item._id" close close-icon="mdi-close">
              <span>{{item.name}} - {{item.quantity}}</span>
            </v-chip>
          </v-row>
        </v-col>
      </v-card-title>

      <v-card-actions class=justify-center>
        <v-btn @click="clearAll">
          <v-icon>mdi-cancel</v-icon>
          <span>Cancelar</span>
        </v-btn>

        <v-btn class="primary" @click="saveMeal">
          <v-icon>mdi-content-save</v-icon>
          <span>Salvar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "NewMeal",
  data() {
    return {
      foods: [
        {
          _id: "1",
          name: "Comida 1",
          calPerGram: 1000
        },
        {
          _id: "2",
          name: "Frango",
          calPerGram: 10000
        },
        {
          _id: "3",
          name: "Strogonoff",
          calPerGram: 908765
        }
      ],
      foodId: "",
      quantity: "",
      meal: []
    }
  },
  mounted() {
    // TODO find foods
  },
  methods: {
    addFoodToMeal() {
      const food = this.foods.find(f => f._id == this.foodId)
      this.meal.push({
        foodId: this.foodId,
        quantity: this.quantity,
        name: food.name
      })
      this.clearInput()
    },
    saveMeal() {
      // TODO
    },
    clearAll() {
      this.clearInput()
      this.clearMeal()
    },
    clearInput() {
      this.foodId = ""
      this.quantity = ""
    },
    clearMeal() {
      this.meal = []
    }
  }
};
</script>
