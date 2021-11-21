<template>
    <v-container>
        <v-card>
            <v-card-title>Nova Refeição</v-card-title>
            <v-btn
                :disabled="deviceCache"
                rounded
                block
                class="green my-2 white--text"
                @click="connect"
                ><v-spacer></v-spacer
                >Conectar com a balança<v-spacer></v-spacer
            ></v-btn>
            <v-btn
                :disabled="!deviceCache"
                rounded
                block
                class="green my-2 white--text"
                @click="disconnect"
                ><v-spacer></v-spacer
                >Desconectar da balança<v-spacer></v-spacer
            ></v-btn>
            <v-card-text class="text-primary">
                <v-col cols="12">
                    <v-row class="mb-2 align-center">
                        <v-autocomplete :items="foods" v-model="food.foodId" item-text="name" item-value="_id"
                                        label="Informe o alimento" no-data-text="Sem alimento" />

                        <v-text-field v-model="food.quantity" type="number" label="Informe a quantidade" />

                        <v-btn @click="addFoodToMeal" icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>

                    <v-row class="mb-2">
                        <v-chip class="mr-2" v-for="item in meal" :key="item._id" close close-icon="mdi-close">
                            <span>{{ item.name }} - {{ item.quantity }}</span>
                        </v-chip>
                    </v-row>
                </v-col>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn @click="clearAll">
                    <v-icon>mdi-cancel</v-icon>
                    <span>Cancelar</span>
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
    data:()=> {
        return {
            foods: [],
            food: {
                foodId: "",
                quantity: ""
            },
            meal: [],
            logs:["teste"],
            deviceCache:null,
            characteristicCache:null,
            readBuffer:"",
            chat:"",
            serial:"",
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
            const valid = this.validateFood()
            if (valid) {
                const food = this.foods.find((f) => f._id == this.food.foodId)
                this.meal.push({
                    foodId: this.food.foodId,
                    quantity: this.food.quantity,
                    name: food.name
                })
                this.clearInput()
            }
        },
        async saveMeal() {
            this.loading = true
            const valid = this.validateMeal()
            if (valid) {
                const created = await this.createMeal({
                    userId: this.getUser._id,
                    meal: this.meal
                })

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
            if (!this.food.quantity) {
                this.setError({ message: "Informe a quantidade!" })
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
            this.food.foodId = ""
            this.food.quantity = ""
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
            .catch(error => this.log(error));
        },
        requestBluetoothDevice() {
            this.log("Requesting bluetooth device...");
            return navigator.bluetooth
            .requestDevice({
            filters: [{ name: 'Balança Inteligente' }]
            })
            .then(device => {
              this.log('"' + device.name + '" bluetooth device selected');
              this.deviceCache = device;
              // Added line
              this.deviceCache.addEventListener(
              "gattserverdisconnected",
              this.handleDisconnection
            );
          return this.deviceCache;
        });
    },
    handleDisconnection(event) {
      let device = event.target;
      this.log(
        '"' +
          device.name +
          '" bluetooth device disconnected, trying to reconnect...'
      );
      this.connectDeviceAndCacheCharacteristic(device)
        .then(characteristic => this.startNotifications(characteristic))
        .catch(error => this.log(error));
    },
    // Connect to the device specified, get service and characteristic
    connectDeviceAndCacheCharacteristic(device) {
      
      if (device.gatt && device.gatt.connected && this.characteristicCache) {
        return Promise.resolve(this.characteristicCache);
      }
      this.log("Connecting to GATT server...");
      console.log(device)
      return device.gatt
        .connect()
        .then(server => {
          this.log("GATT server connected, getting service...");
          return server.getPrimaryService(0xffe0);
        })
        .then(service => {
          this.log("Service found, getting characteristic...");
          return service.getCharacteristic(0xffe1);
        })
        .then(characteristic => {
          this.log("Characteristic found");
          this.characteristicCache = characteristic;
          return this.characteristicCache;
        });
    },
    // Enable the characteristic changes notification
    startNotifications(characteristic) {
      this.log("Starting notifications...");
      return characteristic.startNotifications().then(() => {
        this.log("Notifications started");
        // Added line
        characteristic.addEventListener(
          "characteristicvaluechanged",
          this.handleCharacteristicValueChanged
        );
      });
    },
    // Output to terminal
    log(data, type) {
      if (type == "in") this.logs.unshift(`IN: ${data}`);
      else if (type == "out") this.logs.unshift(`OUT: ${data}`);
      else this.logs.unshift(data);
      console.log(this.logs[0])
    },
    // Disconnect
    disconnect() {
      if (this.deviceCache) {
        this.log(
          'Disconnecting from "' +
            this.deviceCache.name +
            '" bluetooth device...'
        );
        this.deviceCache.removeEventListener(
          "gattserverdisconnected",
          this.handleDisconnection
        );
        if (this.deviceCache.gatt.connected) {
          this.deviceCache.gatt.disconnect();
          this.log(
            '"' + this.deviceCache.name + '" bluetooth device disconnected'
          );
        } else {
          this.log(
            '"' +
              this.deviceCache.name +
              '" bluetooth device is already disconnected'
          );
        }
      }
      // Added condition
      if (this.characteristicCache) {
        this.characteristicCache.removeEventListener(
          "characteristicvaluechanged",
          this.handleCharacteristicValueChanged
        );
        this.characteristicCache = null;
      }
      this.deviceCache = null;
    },
    // Data receiving
    handleCharacteristicValueChanged(event) {
      let value = new TextDecoder().decode(event.target.value);
      for (let c of value) {
        if (c === "\n") {
          let data = this.readBuffer.trim();
          this.readBuffer = "";
          if (data) {
            // this.receive(data);
            this.log(value, "in");
          }
        } else {
          this.readBuffer += c;
        }
      }
    },
    send() {
      console.log(this.chat);
      let data = String(this.chat);
      if (!data || !this.characteristicCache) {
        return;
      }
      data += "\n";
      if (data.length > 20) {
        let chunks = data.match(/(.|[\r\n]){1,20}/g);
        this.writeToCharacteristic(this.characteristicCache, chunks[0]);
        for (let i = 1; i < chunks.length; i++) {
          setTimeout(() => {
            this.writeToCharacteristic(this.characteristicCache, chunks[i]);
          }, i * 100);
        }
      } else {
        this.writeToCharacteristic(this.characteristicCache, data);
      }
      this.log(data, "out");
      this.chat = "";
    },
    writeToCharacteristic(characteristic, data) {
      characteristic.writeValue(new TextEncoder().encode(data));
    }
    }
}
</script>
