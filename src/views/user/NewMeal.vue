<template>
    <v-container>
        <v-card>
            <v-card-title>Nova Refeição</v-card-title>

            <v-card-text class="text-primary d-flex align-center justify-center flex-wrap">
                <v-col cols="12">
                    <v-btn
                        :disabled="deviceCache"
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
                        <v-chip class="chip" depressed color="primary"><span>{{ totalWeight }} kg</span></v-chip>
                        <v-btn class="button" @click="addMeasurement" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>

                    <v-row>
                        <v-chip class="mr-2 mb-2" v-for="item in meal" :key="item._id">
                            <span>{{ item.foodId }} - {{ item.quantity.value }} {{ item.quantity.unit }}</span>
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
                quantity: {
                    unit: "kg",
                    value: ""
                }
            },
            newWeight:0.0,
            totalWeight: 0.0,
            weightList:[],
            meal: [],
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
        addFoodToMeal() {
            if (this.validateWeight()&&this.validateFood()) {
                this.food.quantity.value = this.newWeight
                this.meal.push(this.food)
                this.clearInput()
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
            if (!this.food.foodId) {
                this.setError({ message: "Selecione o alimento!" })
                return false
            }
            return true
        },
        validateWeight(){
            console.log(this.weightList)
            console.log(this.weightList.length)
            if(this.newWeight==0){
                if(this.weightList.length==1){
                    this.totalWeight=0
                }
                this.weightList.pop(this.weightList.length)
                
                this.setError({message: "Coloque algum alimento na balança!"})
                return false
            }else if(this.newWeight<0){
                if(this.weightList.length==1){
                    this.totalWeight=0
                    this.weightList.pop()
                }else{
                    this.totalWeight=0
                    this.weightList.forEach(element=>{
                        if(element>0){
                            this.totalWeight=this.totalWeight+element
                        }
                    })
                    this.weightList.pop()
                }
                this.setError({message: "Calibre a balança"})
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
            this.newWeight=0
            this.totalWeight=0
            while(this.weightList.length>0){
                this.weightList.pop()
            }
            this.clearInput()
            this.clearMeal()
        },
        clearInput() {
            this.food = {
                foodId: "",
                quantity: {
                    unit: "",
                    value: "kg"
                }
            }
            this.newWeight=0
        },
        clearMeal() {
            this.meal = []
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
            if (type == "in"){
                this.logs.unshift(`IN: ${data}`)
            }else if (type == "out") this.logs.unshift(`OUT: ${data}`)
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
            this.clearAll()
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
                        // this.receive(data);
                            this.totalWeight=parseFloat(parseFloat(data).toFixed(3))
                            this.newWeight=this.totalWeight
                            if(this.weightList.length>0){
                                this.weightList.forEach(element => {
                                    this.newWeight=this.newWeight-element
                                });
                            }   
                                this.newWeight=parseFloat(parseFloat(this.newWeight).toFixed(3))
                                this.weightList.push(this.newWeight)
                                this.log(value, "in")
                                this.addFoodToMeal()    
                            
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
            this.chat = "p"
            this.send()

        },
        send() {
            let data = String(this.chat)
            if (!data || !this.gattCharacteristic) {
                return
            }
            data += "\n"
            this.writeToCharacteristic(this.gattCharacteristic, data)
            this.log(data, "out")
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
    width: 100px
    display: flex
    justify-content: center

.button
    margin-left: 6px
    background-color: #e5e2e2 !important
</style>