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
                            <span>{{ item.name }} - {{ item.quantity }}</span>
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
                    unit: "",
                    value: "kg"
                }
            },
            newWeight:0.0,
            totalWeight: 0.0,
            weightList:[],
            meal: [],
            logs: ["teste"],
            comunicated:false,
            deviceCache: null,
            characteristicCache: null,
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
            if (this.validateFood()) {
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
            this.newWeight=0.0
            this.totalWeight=0.0
            this.weightList=[]
        },
        clearInput() {
            this.food = {
                foodId: "",
                quantity: {
                    unit: "",
                    value: "kg"
                }
            }
            this.newWeight=0.0
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
                    console.log(this.deviceCache)
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

            if (device.gatt && device.gatt.connected && this.characteristicCache) {
                return Promise.resolve(this.characteristicCache)
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
                    this.characteristicCache = characteristic
                    return this.characteristicCache
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
            if (type == "in") this.logs.unshift(`IN: ${data}`)
            else if (type == "out") this.logs.unshift(`OUT: ${data}`)
            else this.logs.unshift(data)
            console.log(this.logs[0])
        },
        // Disconnect
        disconnect() {
            this.clearAll()
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
            if (this.characteristicCache) {
                this.characteristicCache.removeEventListener(
                    "characteristicvaluechanged",
                    this.handleCharacteristicValueChanged
                )
                this.characteristicCache = null
            }
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
                            this.totalWeight=parseFloat(data)
                            this.totalWeight=this.totalWeight.toFixed(3)
                            if(this.weightList.length==0){
                                this.weightList.push(this.totalWeight)
                                this.newWeight=this.totalWeight
                            }else{
                                this.newWeight=this.totalWeight
                                this.weightList.forEach(element => {
                                    this.newWeight=this.newWeight-element
                                });
                                this.newWeight=this.newWeight.toFixed(3)
                                this.weightList.push(this.newWeight)
                            }
                            this.addFoodToMeal()    
                        
                        
                        this.log(value, "in")

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
            if (!data || !this.characteristicCache) {
                return
            }
            data += "\n"
            if (data.length > 20) {
                let chunks = data.match(/(.|[\r\n]){1,20}/g)
                this.writeToCharacteristic(this.characteristicCache, chunks[0])
                for (let i = 1; i < chunks.length; i++) {
                    setTimeout(() => {
                        this.writeToCharacteristic(this.characteristicCache, chunks[i])
                    }, i * 100)
                }
            } else {
                this.writeToCharacteristic(this.characteristicCache, data)
            }
            this.log(data, "out")
            this.chat = ""
        },
        writeToCharacteristic(characteristic, data) {
            characteristic.writeValue(new TextEncoder().encode(data))
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