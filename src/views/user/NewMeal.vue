<template>
    <v-container>
        <v-card>
            <v-card-title>Nova Refeição</v-card-title>

            <v-card-text class="text-primary d-flex align-center justify-center flex-wrap">
                <v-col cols="12">
                    <v-btn
                        :disabled="!!deviceCache"
                        block
                        class="green my-2 white--text"
                        @click="connect">
                        Conectar com a balança
                    </v-btn>
                    <v-btn
                        :disabled="!deviceCache"
                        block
                        class="red my-2 white--text"
                        @click="disconnect">
                        Desconectar
                    </v-btn>
                    <v-btn
                        :disabled="!deviceCache"
                        block
                        class="blue my-2 white--text"
                        @click="calibrate">
                        Calibrar
                    </v-btn>
                </v-col>
                <v-col cols="12" class="mb-2">
                    <v-row>
                        <v-autocomplete :items="foods" v-model="food.foodId" item-text="name"
                                        item-value="_id" label="Informe o alimento" no-data-text="Sem alimento" />
                    </v-row>

                    <v-row class="d-flex justify-center align-center">
                        <h3> Peso total: </h3>
                        <v-chip class="chip"  depressed color="primary"><span> {{ totalWeight }} kg</span></v-chip>
                        <v-btn class="button" @click="addMeasurement" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>

                    <v-row>
                        <v-chip class="mr-2 mb-2" v-for="item in mealView" :key="item._id">
                            <span>{{ item.name }} - {{ item.quantity.value }} {{ item.quantity.unit }}</span>
                        </v-chip>
                    </v-row>
                </v-col>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn @click="clearAll">
                    <v-icon>mdi-cancel</v-icon>
                    <span>Limpar</span>
                </v-btn>

                <v-btn class="primary" @click="saveMeal" :loading="loading" :disabled="loading">
                    <v-icon>mdi-content-save</v-icon>
                    <span>Salvar</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"

export default {
    name: "NewMeal",
    data: () => {
        return {
            foods: [],
            food: {
                foodId: "",
                calories:"",
                quantity: {
                    unit: "kg",
                    value: ""
                },
                ProportionalNutritionFacts:[],
                ProportionalCal:"",
                servingSize:{},
                nutritionFacts:[]
            },
            substitute: {
                name: "",
                foodId: "",
                quantity: {}
            },
            newWeight: 0.0,
            totalWeight: 0.0,
            weightList: [],
            meal: [],
            mealView: [],
            logs: ["teste"],
            deviceCache: null,
            gattCharacteristic: null,
            readBuffer: "",
            chat: "",
            serial: "",
            loading: false
        }
    },
    computed: {
        ...mapGetters("food", ["getFoods"]),
        ...mapGetters("user", ["getUser"])
    },
    async mounted() {
        await this.findFoods()
    },
    methods: {
        ...mapActions("food", ["findAllFoods"]),
        ...mapActions("meal", ["createMeal"]),
        ...mapMutations("error", ["setError", "setSuccess"]),
        async findFoods() {
            await this.findAllFoods()
            this.foods = this.getFoods
        },
        manageFood(){
            for (let i = 0; i < this.foods.length; i++){
                if(this.food.foodId==this.foods[i]._id){
                    this.food.servingSize=this.foods[i].servingSize
                    this.food.calories=this.foods[i].calories
                    this.food.nutritionFacts=this.foods[i].nutritionFacts
                    break
                }
            }
            let firstUnit,secondUnit
            let quantityValue=this.food.quantity.value
            let servingSizeValue=this.food.servingSize.value
            if(this.food.servingSize.unit=="mg"){
                firstUnit=0.001
                this.food.ProportionalCal=(quantityValue*1000*parseFloat(this.food.calories))/(parseFloat(servingSizeValue)*firstUnit)
            }
            if(this.food.servingSize.unit=="g"){
                firstUnit=1
                this.food.ProportionalCal=(quantityValue*1000*parseFloat(this.food.calories))/(parseFloat(servingSizeValue))
            }
            if(this.food.servingSize.unit=="kg"){
                firstUnit=1000
                this.food.ProportionalCal=(quantityValue*parseFloat(this.food.calories))/(parseFloat(servingSizeValue))
            }
            this.food.ProportionalCal=parseFloat(this.food.ProportionalCal.toFixed(3))
            this.food.nutritionFacts.forEach(element =>{ 
                let insert={
                    nutrient:{},
                    amount:{
                        unit:"",
                        value:"",
                    }
                }
                if(element.amount.unit=="mg"){
                    secondUnit=0.001
                }
                else if(element.amount.unit=="g"){
                    secondUnit=1
                }
                else if(element.amount.unit=="kg"){
                    secondUnit=1000
                }
                insert.nutrient=element.nutrient.name   
                insert.amount.value=(quantityValue*1000*secondUnit*parseFloat(element.amount.value))/(parseFloat(servingSizeValue)*firstUnit)
                if(insert.amount.value<1 && insert.amount.value>0){
                    insert.amount.value=insert.amount.value*1000
                    insert.amount.unit="mg"
                    if(insert.amount.value<1 && insert.amount.value>0){
                        insert.amount.value=insert.amount.value*1000
                        insert.amount.unit="µg"
                        if(insert.amount.value<1 && insert.amount.value>0){
                            insert.amount.value=insert.amount.value*1000
                            insert.amount.unit="ng"
                            if(insert.amount.value<1 && insert.amount.value>0){
                                insert.amount.value=insert.amount.value*1000
                                insert.amount.unit="pg"
                            }
                        }
                    }     
                }
                else if(insert.amount.value>0 && insert.amount.value<1000){
                    insert.amount.unit="g"
                }
                else if(insert.amount.value>1000){
                    insert.amount.unit="kg"
                    insert.amount.value=insert.amount.value/1000
                }
                insert.amount.value=parseFloat(insert.amount.value.toFixed(3))
                this.food.ProportionalNutritionFacts.push(insert)
            })
            delete this.food.calories
            delete this.food.servingSize
            delete this.food.nutritionFacts
        },
        addFoodToMeal() {
            if (this.validateFood()) {
                if (this.validateWeight()) {
                    this.food.quantity.value = this.newWeight
                    if (this.meal.length > 0 &&
                        this.meal.some(element => element.foodId === this.food.foodId)) {
                        for (let i = 0; i < this.meal.length; i++) {
                            if (this.meal[i].foodId == this.food.foodId) {
                                this.meal[i].quantity.value = parseFloat((this.meal[i].quantity.value+parseFloat(this.food.quantity.value.toFixed(3))).toFixed(3))
                                this.mealView[i].quantity.value = this.meal[i].quantity.value
                                this.weightList[i] = this.meal[i].quantity.value
                                this.weightList.pop()
                                this.food.quantity=this.meal[i].quantity
                                this.manageFood()
                                this.meal[i]=this.food
                                break
                            }
                        }
                    } else {
                        this.manageFood()
                        this.meal.push(this.food)
                        let obj = this.foods.find(element => element._id === this.food.foodId)
                        this.substitute.name = obj.name
                        this.substitute.foodId = this.food.foodId
                        this.substitute.quantity = this.food.quantity
                        this.mealView.push(this.substitute)
                    }
                    this.clearInput()
                }
            }
        },
        async saveMeal() {
            this.loading = true
            if (this.validateMeal()) {
                const created = await this.createMeal(this.meal)

                if (created) {
                    this.setSuccess({ message: "Refeição criada com sucesso!" })
                    this.clearAll()
                }
            }
            this.loading = false
        },
        validateFood() {
            if (!this.food.foodId || this.food.foodId=="") {
                this.setError({ message: "Selecione o alimento!" })

                return false
            }
            return true
        },
        validateWeight() {
            if (this.newWeight == 0) {
                if (this.weightList.length == 1) {
                    this.totalWeight = 0
                }
                this.weightList.pop(this.weightList.length)

                this.setError({ message: "Coloque algum alimento na balança!" })
                return false
            } else if (this.newWeight < 0) {
                if (this.weightList.length == 1) {
                    this.totalWeight = 0
                    this.weightList.pop()
                } else {
                    this.totalWeight = 0
                    this.weightList.forEach(element => {
                        if (element > 0) {
                            this.totalWeight = this.totalWeight + element
                        }
                    })
                    this.weightList.pop()
                }
                this.setError({ message: "Calibre a balança" })
                return false
            }
            return true
        },
        validateMeal() {
            if (this.meal.length < 1) {
                this.setError({ message: "Adicione ao menos um alimento!" })
                return false
            }
            return true
        },
        clearAll() {
            this.clearInput()
            this.clearMeal()
        },
        clearInput() {
            this.newWeight = 0
            this.food = {
                foodId: "",
                calories:"",
                quantity: {
                    unit: "kg",
                    value: ""
                },
                ProportionalNutritionFacts:[],
                ProportionalCal:"",
                servingSize:{},
                nutritionFacts:[]
            },
            this.substitute = {
                name: "",
                foodId: "",
                quantity: {}
            }
            this.newWeight = 0
        },
        clearMeal() {
            while (this.weightList.length > 0) {
                this.weightList.pop()
            }
            this.totalWeight = 0
            this.meal = []
            this.mealView = []
        },
        //Bluetooth
        connect() {
            return (this.deviceCache
                    ? Promise.resolve(this.deviceCache)
                    : this.requestBluetoothDevice()

            )
                .then(device => this.connectDeviceAndCacheCharacteristic(device))
                .then(characteristic => this.startNotifications(characteristic))
                .catch(error => this.log(error))
        },
        requestBluetoothDevice() {
            this.log("Requesting bluetooth device...")
            return navigator.bluetooth
                .requestDevice({
                    filters: [{ services: [0xffe0] }, { name: "Balança" }]
                })
                .then(device => {
                    this.log("\"" + device.name + "\" bluetooth device selected")
                    this.deviceCache = device
                    // Added line
                    this.deviceCache.addEventListener(
                        "gattserverdisconnected",
                        this.handleDisconnection
                    )
                    return this.deviceCache
                })
        },
        handleDisconnection(event) {
            let device = event.target
            this.log(
                "\"" +
                device.name +
                "\" bluetooth device disconnected, trying to reconnect..."
            )
            this.connectDeviceAndCacheCharacteristic(device)
                .then(characteristic => this.startNotifications(characteristic))
                .catch(error => this.log(error))
        },
        // Connect to the device specified, get service and characteristic
        connectDeviceAndCacheCharacteristic(device) {

            if (device.gatt.connected && this.gattCharacteristic) {
                return Promise.resolve(this.gattCharacteristic)
            }
            this.log("Connecting to GATT server...")
            return device.gatt
                .connect()
                .then(server => {
                    this.log("GATT server connected, getting service...")
                    return server.getPrimaryService(0xffe0)
                })
                .then(service => {
                    this.log("Service found, getting characteristic...")
                    return service.getCharacteristic(0xffe1)
                })
                .then(characteristic => {
                    this.log("Characteristic found")
                    this.gattCharacteristic = characteristic
                    return this.gattCharacteristic
                })
        },
        // Enable the characteristic changes notification
        startNotifications(characteristic) {
            this.log("Starting notifications...")
            return characteristic.startNotifications().then(() => {
                this.log("Notifications started")
                // Added line
                characteristic.addEventListener(
                    "characteristicvaluechanged",
                    this.handleCharacteristicValueChanged
                )
            })
        },
        // Output to terminal
        log(data, type) {
            if (type == "in") {
                this.logs.unshift(`IN: ${data}`)
            } else if (type == "out") this.logs.unshift(`OUT: ${data}`)
            else this.logs.unshift(data)
            console.log(this.logs[0])
        },
        // Disconnect
        disconnect() {
            if (this.deviceCache) {
                this.log(
                    "Disconnecting from \"" +
                    this.deviceCache.name +
                    "\" bluetooth device..."
                )
                this.deviceCache.removeEventListener(
                    "gattserverdisconnected",
                    this.handleDisconnection
                )
                if (this.deviceCache.gatt.connected) {
                    this.deviceCache.gatt.disconnect()
                    this.log(
                        "\"" + this.deviceCache.name + "\" bluetooth device disconnected"
                    )
                } else {
                    this.log(
                        "\"" +
                        this.deviceCache.name +
                        "\" bluetooth device is already disconnected"
                    )
                }
            }
            // Added condition
            if (this.gattCharacteristic) {
                this.gattCharacteristic.removeEventListener(
                    "characteristicvaluechanged",
                    this.handleCharacteristicValueChanged
                )
                this.gattCharacteristic = null
            }
            this.clearInput()
            this.deviceCache = null
        },
        // Data receiving
        handleCharacteristicValueChanged(event) {
            let value = new TextDecoder().decode(event.target.value)
            for (let c of value) {
                if (c === "\n") {
                    let data = this.readBuffer.trim()
                    this.readBuffer = ""
                    if (data) {
                        this.totalWeight = parseFloat(parseFloat(data).toFixed(3))
                        //this.log(value, "in")
                    }
                } else {
                    this.readBuffer += c
                }
            }
        },
        calibrate() {
            this.chat = "c"
            this.send()
        },
        addMeasurement() {
            this.newWeight = this.totalWeight
            if (this.weightList.length > 0) {
                this.weightList.forEach(element => {
                    this.newWeight = this.newWeight - element
                })
            }
            this.newWeight = parseFloat(parseFloat(this.newWeight).toFixed(3))
            this.weightList.push(this.newWeight)
            this.addFoodToMeal()

        },
        send() {
            let data = String(this.chat)
            if (!data || !this.gattCharacteristic) {
                return
            }
            data += "\n"
            this.writeToCharacteristic(this.gattCharacteristic, data)
            //this.log(data, "out")
            this.chat = ""
        },
        writeToCharacteristic(characteristic, data) {
            characteristic.writeValueWithResponse(new TextEncoder().encode(data))
        }
    }
}
</script>

<style lang="sass">
.chip
    margin-left: 6px
    width: 100px
    display: flex
    justify-content: center
.button
    margin-left: 6px
    background-color: #e5e2e2 !important
</style>