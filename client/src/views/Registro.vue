<template>
<div class="registro">
    <v-card>
        <v-form ref="form">
            <v-card-text>
                <h2 class="text-center">Datos del Domicilio:</h2>
                <v-select v-model="editedItem.address.Country" :items="paises" item-text="name" label="Nacionalidad" @change="(value) => changeState(value)"></v-select>
                <v-select v-model="editedItem.address.Province" v-if="editedItem.address.Country=='Argentina'" :items="provincias" label="Provincia" @change=" prov => localidades = getLocalidades(prov)" :rules="requerido"></v-select>
                <v-text-field v-if="editedItem.address.Country!='Argentina'" v-model="editedItem.address.ProvinceNL"  label="Provincia" :rules="requerido"></v-text-field>
                <v-select v-model="editedItem.address.City" v-if="editedItem.address.Country=='Argentina'"  :items="localidades" label="Ciudad" :rules="requerido"></v-select>
                <v-text-field v-model="editedItem.address.CityNL" v-if="editedItem.address.Country!='Argentina'" label="Localidad" :rules="requerido"></v-text-field>

                <v-row>
                    <v-col cols="12" sm="5" md="6">
                        <v-text-field v-model="editedItem.address.Street" label="Calle" :rules="requerido"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5" md="6">
                        <v-text-field type="Number" prefix="N°: " v-model="editedItem.address.Number" label="Numeración" :rules="requerido"></v-text-field>
                    </v-col>
                </v-row>
                <h2 class="text-center">Datos Personales:</h2>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field :rules="reglaNombre" hide-details="auto" v-model="editedItem.name" label="Nombre"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field :rules="reglaNombre" v-model="editedItem.lastName" label="Apellido"></v-text-field>
                    </v-col>
                </v-row>
                <v-text-field type="Number" :rules="reglaID" v-model="editedItem.dni" label="ID"></v-text-field>
                <h2 class="text-center">Datos del Usuario</h2>
                <v-select label="Rol" :rules="requerido" :items="roles" v-model="editedItem.hierarchy"></v-select>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field :rules="reglaPrincipioEmail" v-model="editedItem.principioEmail" label="example"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5" md="6">
                        <v-text-field :rules="reglaFinEmail" prefix="@" v-model="editedItem.finEmail" label="hotmail.com"></v-text-field>
                    </v-col>
                </v-row>
                <v-text-field :rules="requerido" v-model="editedItem.user" label="Usuario"></v-text-field>
                <v-text-field v-model="editedItem.password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Contraseña" counter @click:append="show1 = !show1"></v-text-field>

            </v-card-text>
            <v-card-actions>
                <v-btn block class="success" @click="registrar">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</div>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"
export default {
    data() {
        return {
            roles: ["Gerente", "Administrador", "Administrativo", "Supervisor", "Supervisor Taller", "Vendedor"],
            editedItem: {
                user: "",
                password: "",
                name: "",
                lastName: "",
                dni: "",
                principioEmail: "",
                finEmail: "",
                hierarchy: "",
                address: {
                    Country: "Argentina",
                    Province: "",
                    Street: "",
                    Number: "",
                    City: "",
                    CityNL: "",
                    ProvinceNL:""
                }
            },
            error: "",
            paises: [],
            provincias: [],
            localidades: [],
            show1: false,
            show2: true,
            show3: false,
            show4: false,
            requerido: [
                value => !!value || 'Requerido.',
            ],
            rules: {
                required: (value) => !!value || "Required.",
                min: (v) => v.length >= 8 || "Min 8 characters",
                emailMatch: () => `The email and password you entered don't match`,
            },
            reglaID: [value => !!value || 'Requerido.'],

            reglaPrincipioEmail: [
                value => !!value || 'Requerido.',
                value => (value || '').length <= 20 || 'Máximo 20 caracteres',
                value => (value || '').length >= 3 || 'Mínimo 3 caracteres',
                value => {
                    const pattern = /^[a-z A-Z 0-9 -_.]{3,}$/
                    return pattern.test(value) || 'Email inválido'
                },
            ],

            reglaFinEmail: [
                value => !!value || 'Requerido.',
                value => (value || '').length <= 20 || 'Máximo 20 caracteres',
                value => {
                    const pattern = /^[a-z]{1,}(.[a-z]{1,}){1,}$/
                    return pattern.test(value) || 'Email inválido'
                },
            ],

            reglaNombre: [
                value => !!value || 'Requerido.',
                value => (value || '').length <= 50 || 'Máximo 50 caracteres',
                value => {
                    const pattern = /^[A-Z ÑÁÉÍÓÚ]{1}[a-z ñáéíóú]{1,15}(\s{1}[A-Z ÑÁÉÍÓÚ]{1}[a-z náéíóú]{1,15}){0,}$/
                    return pattern.test(value) || 'Nombre inválido'
                },
            ],
            info: "",
        };
    },
    mounted() {
        axios
            .get("https://jsonplaceholder.typicode.com/todos/1")
            .then(response => (this.info = response.data));
    },
    created() {
        this.getPaises();
        this.getProvincias();
    },
    methods: {
        getPaises() {
            axios.get('https://restcountries.eu/rest/v2/all')
                .then(res => {
                    this.paises = res.data;
                });

        },
        async getProvincias() {
            await axios.get('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre')
                .then(res => {
                    this.provincias = res.data.provincias;
                    this.provincias.forEach(prov =>
                        this.provincias.push(prov.nombre));
                    this.provincias.sort();
                });
        },

        getLocalidades(nombre) {
            axios.get('https://apis.datos.gob.ar/georef/api/localidades?provincia=' + nombre + '&campos=nombre&max=5000')
                .then(res => {
                    this.localidades = res.data.localidades;
                    this.localidades.forEach(localidad =>
                        this.localidades.push(localidad.nombre));
                    this.localidades.sort();
                });
        },

        changeState(value) {
            let datos = this.obtenerDatosPorNacion(value);
            this.prefijo = datos[0]
            this.poblacion = datos[1]
            let cantidad = JSON.stringify(this.poblacion).length;
         
            this.reglaID = [value => !!value || 'Requerido.',
                value => (value || '').length <= cantidad || 'Máximo ' + cantidad + ' caracteres',
                value => {
                    const pattern = /^0$/
                    return !pattern.test(value) || 'El primer elemento no puede ser 0!'
                },
                value => {
                    const pattern = /^[0-9]{1,}$/
                    return pattern.test(value) || 'Sólo se permiten números!'
                },
            ]
        },

        obtenerDatosPorNacion(value) {
            let datos = ['', ''];
            for (let i = 0; i < this.paises.length; i++) {
                if (this.paises[i] && this.paises[i].name == value) {
                    datos[0] = this.paises[i].callingCodes;
                    datos[1] = this.paises[i].population;
                }
            }
            return datos;
        },

        registrar() {
            if (this.$refs.form.validate()) {
                let deArgentina = this.editedItem.address.Country =="Argentina";
                let province = deArgentina? this.editedItem.address.Province : this.editedItem.address.ProvinceNL;
                let city = deArgentina? this.editedItem.address.City : this.editedItem.address.CityNL;
               
                let address = {
                            "Country": this.editedItem.address.Country,
                            "City": city,
                            "Street": this.editedItem.address.Street,
                            "Number": this.editedItem.address.Number,
                            "Province": province,
                        
                    };
                let employee = {
                    "employee": {
                        "User": this.editedItem.user,
                        "Password": this.editedItem.password,
                        "Name": this.editedItem.name,
                        "LastName": this.editedItem.lastName,
                        "DNI": this.editedItem.dni,
                        "Email": this.editedItem.principioEmail + "@" + this.editedItem.finEmail,
                        "Status": 'ACTIVE',
                        "Hierarchy": this.editedItem.hierarchy,
                        "StartDate": new Date(),
                        "Address": address
                    }
                };
                axios.post(urlAPI + "signup", employee).then(res => {
                    if (res != null) {
                        location.href = "/login";
                    }
                });

            }
        },
    },
};
</script>

<style></style>
