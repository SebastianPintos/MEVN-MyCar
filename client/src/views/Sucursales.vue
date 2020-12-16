<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table :expanded.sync="expanded" show-expand single-select v-model="selected" show-select :headers="headers" :items="sucursales" :search="search" item-key="_id" sort-by="Name" class="elevation-1">
            <template v-slot:item.WorkShop="{ item }">
                {{ formatTaller(item.WorkShop)}}
            </template>

            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">

                    <v-chip-group>
                        <v-chip color="success" small v-for="empleado in item.Employee" :key="empleado._id">DNI: {{empleado.DNI}}</v-chip>
                    </v-chip-group>
                </td>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div v-if="validateUsers('Gerente','Administrador')">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>

                        <v-dialog v-model="dialog" max-width="800px" persistent>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="formTitle='Nueva Sucursal'" color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="reglaNombre" v-model="editedItem.Name" label="Nombre"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-select v-model="editedItem.Country" :items="paises" item-text="name" label="País" @change="(value) => changeState(value)" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-select v-model="editedItem.Province" v-if="editedItem.Country=='Argentina'" :items="provincias" label="Provincia" @change=" prov => localidades = getLocalidades(prov)" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12" v-if="editedItem.Country!='Argentina'">
                                                    <v-text-field v-model="editedItem.ProvinceNL" :items="provincias" label="Provincia" @change=" prov => localidades = getLocalidades(prov)" :rules="requerido"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-select v-model="editedItem.City" v-if="editedItem.Country=='Argentina'" :items="localidades" label="Localidad" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedItem.CityNL" v-if="editedItem.Country!='Argentina'" label="Localidad" :rules="requerido"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="5" md="6">
                                                    <v-text-field v-model="editedItem.Street" label="Calle" :rules="requerido"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="5" md="6">
                                                    <v-text-field prefix="N°: " v-model="editedItem.Number" label="Numeración" :rules="requerido"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="3">
                                                    <v-text-field v-model="prefijo" readonly label="Prefijo"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="8" md="9">
                                                    <v-text-field type="number" :rules="reglaTelefono" v-model="num" label="Número"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="reglaPrincipioEmail" v-model="principioEmail" label="example"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="5" md="6">
                                                    <v-text-field :rules="reglaFinEmail" prefix="@" v-model="finEmail" label="hotmail.com"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="12">
                                                    <h4>Días y Horarios</h4>
                                                </v-col>
                                                <v-row>

                                                    <!--Horarios Lunes-->
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuOLunes" :disabled="!abreLunes" v-model="openLunes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeOLunes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeOLunes" label="Apertura Lunes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker :allowed-minutes="allowedStep" min="7:00" max="20:00" v-if="openLunes" v-model="timeOLunes" full-width @click:minute="$refs.menuOLunes.save(timeOLunes)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCLunes" :disabled="!abreLunes" v-model="closeLunes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCLunes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCLunes" label="Cierre Lunes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker :allowed-minutes="allowedStep" min="7:00" max="20:00" v-if="closeLunes" v-model="timeCLunes" full-width @click:minute="$refs.menuCLunes.save(timeCLunes)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreLunes = !abreLunes; timeOLunes=null; timeCLunes=null">
                                                            <v-icon color="error" v-if="abreLunes==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                                <!--Horarios Martes-->
                                                <v-row>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuOMartes" :disabled="!abreMartes" v-model="openMartes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeOMartes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeOMartes" label="Apertura Martes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="openMartes" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeOMartes" full-width @click:minute="$refs.menuOMartes.save(timeOMartes)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCMartes" :disabled="!abreMartes" v-model="closeMartes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCMartes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCMartes" label="Cierre Martes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="closeMartes" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeCMartes" full-width @click:minute="$refs.menuCMartes.save(timeCMartes)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreMartes = !abreMartes; timeOMartes=null; timeCMartes=null">
                                                            <v-icon color="error" v-if="abreMartes==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <!--Horarios Miércoles-->
                                                <v-row>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuOMiercoles" :disabled="!abreMiercoles" v-model="openMiercoles" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeOMiercoles" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeOMiercoles" label="Apertura Miércoles" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="openMiercoles" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeOMiercoles" full-width @click:minute="$refs.menuOMiercoles.save(timeOMiercoles)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCMiercoles" :disabled="!abreMiercoles" v-model="closeMiercoles" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCMiercoles" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCMiercoles" label="Cierre Miércoles" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="closeMiercoles" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeCMiercoles" full-width @click:minute="$refs.menuCMiercoles.save(timeCMiercoles)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreMiercoles = !abreMiercoles; timeCMiercoles=null; timeOMiercoles=null">
                                                            <v-icon color="error" v-if="abreMiercoles==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <!--Horarios Jueves-->
                                                <v-row>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuOJueves" :disabled="!abreJueves" v-model="openJueves" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeOJueves" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeOJueves" label="Apertura Jueves" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="openJueves" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeOJueves" full-width @click:minute="$refs.menuOJueves.save(timeOJueves)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCJueves" :disabled="!abreJueves" v-model="closeJueves" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCJueves" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCJueves" label="Cierre Jueves" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="closeJueves" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeCJueves" full-width @click:minute="$refs.menuCJueves.save(timeCJueves)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreJueves = !abreJueves; timeOJueves=null;timeCJueves=null">
                                                            <v-icon color="error" v-if="abreJueves==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <!--Horarios Viernes-->
                                                <v-row>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuOViernes" :disabled="!abreViernes" v-model="openViernes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeOViernes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeOViernes" label="Apertura Viernes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="openViernes" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeOViernes" full-width @click:minute="$refs.menuOViernes.save(timeOViernes)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCViernes" :disabled="!abreViernes" v-model="closeViernes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCViernes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCViernes" label="Cierre Viernes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="closeViernes" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeCViernes" full-width @click:minute="$refs.menuCViernes.save(timeCViernes)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreViernes = !abreViernes; timeOViernes=null; timeCViernes=null">
                                                            <v-icon color="error" v-if="abreViernes==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <!--Horarios Sábado-->
                                                <v-row>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuOSabado" :disabled="!abreSabado" v-model="openSabado" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeOSabado" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeOSabado" label="Apertura Sábado" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="openSabado" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeOSabado" full-width @click:minute="$refs.menuOSabado.save(timeOSabado)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCSabado" :disabled="!abreSabado" v-model="closeSabado" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCSabado" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCSabado" label="Cierre Sábado" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="closeSabado" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeCSabado" full-width @click:minute="$refs.menuCSabado.save(timeCSabado)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreSabado = !abreSabado; timeOSabado=null; timeCSabado=null">
                                                            <v-icon color="error" v-if="abreSabado==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <!--Horario Domingo-->
                                                <v-row>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuODomingo" :disabled="!abreDomingo" v-model="openDomingo" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeODomingo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeODomingo" label="Apertura Domingo" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="openDomingo" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeODomingo" full-width @click:minute="$refs.menuODomingo.save(timeODomingo)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="5">
                                                        <v-menu ref="menuCDomingo" :disabled="!abreDomingo" v-model="closeDomingo" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCDomingo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field v-model="timeCDomingo" label="Cierre Domingo" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                            </template>
                                                            <v-time-picker v-if="closeDomingo" :allowed-minutes="allowedStep" min="7:00" max="20:00" v-model="timeCDomingo" full-width @click:minute="$refs.menuCDomingo.save(timeCDomingo)"></v-time-picker>
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="12" sm="5" md="2">
                                                        <v-btn class="mb-2" @click="abreDomingo = !abreDomingo; timeODomingo=null; timeCDomingo=null">
                                                            <v-icon color="error" v-if="abreDomingo==false">mdi-blinds</v-icon>
                                                            <v-icon color="success" v-else>mdi-blinds-open</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>

                                                <v-col cols="12" sm="6" md="12">
                                                    <v-select v-model="editedItem.employee" label="Empleados" multiple chips deletable-chips :items="empleados" item-text="DNI" item-value="_id" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-radio-group mandatory class="text-align: left" v-model="editedItem.taller" row :rules="requerido">
                                                    <h3>Taller: </h3>
                                                    <v-radio class="mb-1" label="Sí" :value="true"></v-radio>
                                                    <v-radio class="mb-1" label="No" :value="false"></v-radio>
                                                </v-radio-group>
                                            </v-row>

                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn class="info" text @click="reset">
                                            <v-icon>mdi-cancel</v-icon>
                                        </v-btn>
                                        <v-btn class="info" text @click="save">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                            <v-card>
                                <v-card-title>Confirmación</v-card-title>
                                <v-card-text>
                                    <h3>¿Estás seguro de que deseas eliminar esta sucursal?</h3>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn class="info" text @click="dialogDelete=false">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info" text @click="deleteItemConfirm">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>

                </v-toolbar>
            </template>

        </v-data-table>
        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn class="info" v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-check</v-icon>
                </v-btn>

            </template>
        </v-snackbar>
    </div>
</v-img>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"

export default {
    data: () => ({
        expanded: [],
        editedIndex: -1,
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,

        editedItem: {
            Name: '',
            openLunes: "",
            closeLunes: "",
            openMartes: "",
            closeMartes: "",
            openMiercoles: "",
            closeMiercoles: "",
            openJueves: "",
            closeJueves: "",
            openViernes: "",
            closeViernes: "",
            openSabado: "",
            closeSabado: "",
            openDomingo: "",
            closeDomingo: "",
            employee: [],
            Province: "",
            ProvinceNL: "",
            Country: "",
            Street: "",
            Number: "",
            City: "",
            CityNL: "",
            taller: false,
        },

        defaultItem: {
            Name: '',
            openLunes: "",
            closeLunes: "",
            openMartes: "",
            closeMartes: "",
            openMiercoles: "",
            closeMiercoles: "",
            openJueves: "",
            closeJueves: "",
            openViernes: "",
            closeViernes: "",
            openSabado: "",
            closeSabado: "",
            openDomingo: "",
            closeDomingo: "",
            employee: [],
            Province: "",
            ProvinceNL: "",
            Country: "",
            Street: "",
            Number: "",
            City: "",
            CityNL: "",
            taller: false,
        },
        headers: [{
                text: 'Nombre',
                value: 'Name',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Taller',
                value: 'WorkShop',
            },
            {
                text: 'Teléfono',
                value: 'Phone'
            },
            {
                text: 'Email',
                value: 'Email'
            },
            {
                text: 'País',
                value: 'Address.Country'
            },
            {
                text: 'Provincia',
                value: 'Address.Province'
            },
            {
                text: 'Ciudad',
                value: 'Address.City'
            },
            {
                text: 'Calle',
                value: 'Address.Street'
            },
            {
                text: 'Numeración',
                value: 'Address.Number'
            },

        ],

        sucursales: [],
        empleados: [],
        paises: [],
        provincias: [],
        localidades: [],
        codigosPaises: [],
        prefijo: '',
        num: '',
        principioEmail: '',
        finEmail: '',
        abreLunes: false,
        abreMartes: false,
        abreMiercoles: false,
        abreJueves: false,
        abreViernes: false,
        abreSabado: false,
        abreDomingo: false,
        timeOLunes: null,
        timeCLunes: null,
        timeOMartes: null,
        timeCMartes: null,
        timeOMiercoles: null,
        timeCMiercoles: null,
        timeOJueves: null,
        timeCJueves: null,
        timeOViernes: null,
        timeCViernes: null,
        timeOSabado: null,
        timeCSabado: null,
        timeODomingo: null,
        timeCDomingo: null,
        openLunes: false,
        closeLunes: false,
        openMartes: false,
        closeMartes: false,
        openMiercoles: false,
        closeMiercoles: false,
        openJueves: false,
        closeJueves: false,
        openViernes: false,
        closeViernes: false,
        openSabado: false,
        closeSabado: false,
        openDomingo: false,
        closeDomingo: false,
        reglaNombre: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 50 || 'Máximo 50 caracteres',
            value => {
                const pattern = /^[A-Z ÑÁÉÍÓÚ]{1}[a-z ñáéíóú]{1,15}(\s{1}[A-Z ÑÁÉÍÓÚ]{1}[a-z náéíóú]{1,15}){0,}$/
                return pattern.test(value) || 'Nombre inválido'
            },
        ],
        requerido: [
            value => !!value || 'Requerido.',
        ],
        reglaTelefono: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 12 || 'Máximo 12 caracteres',
            value => (value || '').length >= 8 || 'Mínimo 8 caracteres',
            value => {
                const pattern = /^\d{8,12}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],

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

        reglaNacionalidad: [
            value => !!value || 'Requerido.',
        ],
        attrs: '',
        on: '',
        motivos: '',
        formTitle: '',
    }),

    created() {
        this.iniciar();
    },

    methods: {
        iniciar() {
            this.getsucursales();
            this.getPaises();
            this.getProvincias();
            this.getEmpleados();
        },
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        getProvincias() {
            axios.get('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre')
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
        async getPaises() {
            await axios.get('https://restcountries.eu/rest/v2/all')
                .then(res => {
                    this.paises = res.data;
                });

        },
        getsucursales() {
            axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(s => s.Status === "ACTIVE")
                });
        },

        async getEmpleados() {
            await axios.get(urlAPI + 'employee')
                .then(res => {
                    this.empleados = res.data.employee.filter(s => s.Status === "ACTIVE")
                });
        },

        obtenerPrefijo(value) {
            let prefijo = "";
            for (let i = 0; i < this.paises.length; i++) {
                if (this.paises[i] && this.paises[i].name == value) {
                    prefijo = this.paises[i].callingCodes;
                }
            }
            return prefijo;
        },

        changeState(value) {
            this.prefijo = this.obtenerPrefijo(value);
        },

        haySeleccionado() {
            return this.selected.length > 0;
        },

        mensajeNoSelecciono() {
            if (!this.haySeleccionado()) {
                this.snackbar = true
                this.mensaje = "No ha seleccionado ningun elemento!"
                return true;
            }
            return false;
        },

        parsearAHora(time) {
            if (time != null && time != -1) {
                var min = time % 60;
                var hs = (time - min) / 60;
                min = String(min).length == 1 ? "0" + min : min;
                hs = String(hs).length == 1 ? "0" + hs : hs;
                return "" + hs + ":" + min;
            }
            return "";
        },

        editItem(item) {
            if (!this.mensajeNoSelecciono()) {
                if (this.selected.length > 1) {
                    this.snackbar = true
                    this.mensaje = "Sólo puede editar un elemento a la vez!"
                    return;
                }
                this.editedIndex = this.sucursales.indexOf(item);
                this.editedItem.Name = item.Name;
                this.editedItem.Street = item.Address.Street;
                this.editedItem.Country = item.Address.Country;

                this.separarEmail(this.sucursales[this.editedIndex]);
                this.separarTel(this.sucursales[this.editedIndex]);
                if (this.editedItem.Country != "Argentina") {
                    this.editedItem.ProvinceNL = item.Address.Province;
                    this.editedItem.CityNL = item.Address.City;
                } else {
                    this.editedItem.Province = item.Address.Province;
                    this.editedItem.City = item.Address.City;
                    try {
                        this.localidades = this.getLocalidades(this.editedItem.Province);
                    } catch (err) {
                        console.log(err);
                    }
                }
                this.editedItem.Number = item.Address.Number;
                this.editedItem.employee = item.Employee;
                this.editedItem.taller = item.WorkShop;

                this.timeOLunes = item.Hours.Monday.Open;
                this.timeCLunes = item.Hours.Monday.Close;
                this.timeOMartes = item.Hours.Tuesday.Open;
                this.timeCMartes = item.Hours.Tuesday.Close;
                this.timeOMiercoles = item.Hours.Wednesday.Open;
                this.timeCMiercoles = item.Hours.Wednesday.Close;
                this.timeOJueves = item.Hours.Thrusday.Open;
                this.timeCJueves = item.Hours.Thrusday.Close;
                this.timeOViernes = item.Hours.Friday.Open;
                this.timeCViernes = item.Hours.Friday.Close;
                this.timeOSabado = item.Hours.Saturday.Open;
                this.timeCSabado = item.Hours.Saturday.Close;
                this.timeODomingo = item.Hours.Sunday.Open;
                this.timeCDomingo = item.Hours.Sunday.Close;

                this.timeOLunes = this.parsearAHora(this.timeOLunes);
                this.timeCLunes = this.parsearAHora(this.timeCLunes);
                this.timeOMartes = this.parsearAHora(this.timeOMartes);
                this.timeCMartes = this.parsearAHora(this.timeCMartes);
                this.timeOMiercoles = this.parsearAHora(this.timeOMiercoles);
                this.timeCMiercoles = this.parsearAHora(this.timeCMiercoles);
                this.timeOJueves = this.parsearAHora(this.timeOJueves);
                this.timeCJueves = this.parsearAHora(this.timeCJueves);
                this.timeOViernes = this.parsearAHora(this.timeOViernes);
                this.timeCViernes = this.parsearAHora(this.timeCViernes);
                this.timeOSabado = this.parsearAHora(this.timeOSabado);
                this.timeCSabado = this.parsearAHora(this.timeCSabado);
                this.timeODomingo = this.parsearAHora(this.timeODomingo);
                this.timeCDomingo = this.parsearAHora(this.timeCDomingo);

                this.formTitle = "Editar editedIteme";
                this.dialog = true;

            }
        },

        deleteItem() {
            this.dialogDelete = true;
        },

        async deleteItemConfirm() {
            await axios.delete(urlAPI + 'branchOffice/' + this.selected[0]._id + '/delete').then(res => {
                if (res != null) {
                    this.reset();
                }
            });
            let empleados = [];
            this.selected[0].Employee.forEach(e => {
                empleados.push(e._id);
            })
            let item = {
                Employee: empleados,
                Sucursal: null
            };
            this.asignarSucursal(item);
            this.sucursales.splice(this.sucursales.indexOf(this.selected[0]), 1);
            this.dialogDelete = false;
        },

        reset() {
            if (this.dialog) {
                this.$refs.form.resetValidation();
            }
            this.dialog = false;
            this.selected = [];
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.timeOLunes = null;
            this.timeCLunes = null;
            this.timeOMartes = null;
            this.timeCMartes = null;
            this.timeOMiercoles = null;
            this.timeCMiercoles = null;
            this.timeOJueves = null;
            this.timeCJueves = null;
            this.timeOViernes = null;
            this.timeCViernes = null;
            this.timeOSabado = null;
            this.timeCSabado = null;
            this.timeODomingo = null;
            this.timeCDomingo = null;
            this.abreLunes = false;
            this.abreMartes = false;
            this.abreMiercoles = false;
            this.abreJueves = false;
            this.abreViernes = false;
            this.abreSabado = false;
            this.abreDomingo = false;
            this.num = "";
            this.prefijo = "";
            this.principioEmail = "";
            this.finEmail = "";
        },

        validate() {
            return this.$refs.form.validate()
        },

        getJSONSucursal(selected, status) {
            return {
                "branchOffice": {
                    "Name": selected.Name,
                    "Phone": selected.Phone,
                    "Email": selected.Email,
                    "Status": status,
                    "Address": {
                        "Country": selected.Country,
                        "City": selected.City,
                        "Province": selected.Province,
                        "Street": selected.Street,
                        "Number": selected.Number
                    },
                    "Employee": selected.employee,
                    "WorkShop": selected.taller,
                    "Hours": {
                        "Monday": {
                            "Open": selected.openLunes,
                            "Close": selected.closeLunes
                        },
                        "Tuesday": {
                            "Open": selected.openMartes,
                            "Close": selected.closeMartes
                        },
                        "Wednesday": {
                            "Open": selected.openMiercoles,
                            "Close": selected.closeMiercoles
                        },
                        "Thrusday": {
                            "Open": selected.openJueves,
                            "Close": selected.closeJueves
                        },
                        "Friday": {
                            "Open": selected.openViernes,
                            "Close": selected.closeViernes
                        },
                        "Saturday": {
                            "Open": selected.openSabado,
                            "Close": selected.closeSabado
                        },
                        "Sunday": {
                            "Open": selected.openDomingo,
                            "Close": selected.closeDomingo
                        }
                    }
                }
            };
        },
        post(url, data) {
            axios.post(url, data, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    if (res != null) {
                        this.reset();
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        },

        transformarAMinutos(tiempo) {
            if (tiempo != null) {
                tiempo = tiempo.split(":");
                return parseInt(tiempo[0] * 60) + parseInt(tiempo[1]);
            } else {
                return -1;
            }
        },

        save() {
            if (this.validate() && this.editedItem.taller != null) {
                let Province = "";
                let City = "";
                if (this.editedItem.Country == "Argentina") {
                    Province = this.editedItem.Province;
                    City = this.editedItem.City;
                } else {
                    Province = this.editedItem.ProvinceNL;
                    City = this.editedItem.CityNL;
                }
                this.editedItem.Province = Province;
                this.editedItem.City = City;
                let mensajes = ["La hora de apertura no puede ser mayor a la hora de cierre!", "Las horas de apertura y cierre son obligatorias!"];
                let mensaje = "";
                if ((this.timeOLunes != null && this.timeCLunes != null && this.timeOLunes > this.timeCLunes) ||
                    (this.timeOMartes != null && this.timeCMartes != null && this.timeOMartes > this.timeCMartes) ||
                    (this.timeOMiercoles != null && this.timeCMiercoles != null && this.timeOMiercoles > this.timeCMiercoles) ||
                    (this.timeOJueves != null && this.timeCJueves != null && this.timeOJueves > this.timeCJueves) ||
                    (this.timeOViernes != null && this.timeCViernes != null && this.timeOViernes > this.timeCViernes) ||
                    (this.timeOSabado != null && this.timeCSabado != null && this.timeOSabado > this.timeCSabado) ||
                    (this.timeODomingo != null && this.timeCDomingo != null && this.timeODomingo > this.timeCDomingo)) {
                    mensaje = mensajes[0];
                }
                if (((this.timeOLunes == null || this.timeCLunes == null) && this.abreLunes) ||
                    ((this.timeOMartes == null || this.timeCMartes == null) && this.abreMartes) ||
                    ((this.timeOMiercoles == null || this.timeCMiercoles == null) && this.abreMiercoles) ||
                    ((this.timeOJueves == null || this.timeCJueves == null) && this.abreJueves) ||
                    ((this.timeOViernes == null || this.timeCViernes == null) && this.abreViernes) ||
                    ((this.timeOSabado == null || this.timeCSabado == null) && this.abreSabado) ||
                    ((this.timeODomingo == null || this.timeCDomingo == null) && this.abreDomingo)) {
                    mensaje = mensajes[1];
                }
                if (mensaje != "") {
                    this.mensaje = mensaje;
                    this.snackbar = true;
                    return;
                }
                this.editedItem.Email = this.principioEmail + "@" + this.finEmail;
                this.editedItem.Phone = this.prefijo + "-" + this.num;
                this.editedItem.openLunes = this.transformarAMinutos(this.timeOLunes);
                this.editedItem.openMartes = this.transformarAMinutos(this.timeOMartes);
                this.editedItem.openMiercoles = this.transformarAMinutos(this.timeOMiercoles);
                this.editedItem.openJueves = this.transformarAMinutos(this.timeOJueves);
                this.editedItem.openViernes = this.transformarAMinutos(this.timeOViernes);
                this.editedItem.openSabado = this.transformarAMinutos(this.timeOSabado);
                this.editedItem.openDomingo = this.transformarAMinutos(this.timeODomingo);

                this.editedItem.closeLunes = this.transformarAMinutos(this.timeCLunes);
                this.editedItem.closeMartes = this.transformarAMinutos(this.timeCMartes);
                this.editedItem.closeMiercoles = this.transformarAMinutos(this.timeCMiercoles);
                this.editedItem.closeJueves = this.transformarAMinutos(this.timeCJueves);
                this.editedItem.closeViernes = this.transformarAMinutos(this.timeCViernes);
                this.editedItem.closeSabado = this.transformarAMinutos(this.timeCSabado);
                this.editedItem.closeDomingo = this.transformarAMinutos(this.timeCDomingo);
                let item = {
                    Name: this.editedItem.Name,
                    Phone: this.prefijo + "-" + this.num,
                    Email: this.principioEmail + "@" + this.finEmail,
                    WorkShop: this.editedItem.taller,
                    Employee: this.editedItem.employee,
                    Address: {
                        Number: this.editedItem.Number,
                        Street: this.editedItem.Street,
                        City: this.editedItem.City,
                        Province: this.editedItem.Province,
                        Country: this.editedItem.Country,
                    }
                };
                //Nuevo
                if (this.selected[0] == null) {
                    let jsonSucursal = this.getJSONSucursal(this.editedItem, "ACTIVE");
                    axios.post(urlAPI + 'branchOffice/add', jsonSucursal).then(res => {
                        if (res != null) {
                            this.asignarSucursal({
                                Sucursal: res.data.branchOffice._id,
                                Employee: this.editedItem.employee
                            });
                            this.sucursales.push(item);
                            this.reset();
                        }
                    });
                }
                //Editar
                else {
                    Object.assign(this.sucursales[this.editedIndex], item);
                    this.asignarSucursal({
                        Sucursal: item._id,
                        Employee: this.editedItem.employee
                    });
                    let jsonSucursal = this.getJSONSucursal(this.editedItem, "ACTIVE");
                    axios.post(urlAPI + 'branchOffice/' + this.selected[0]._id + "/update", jsonSucursal).then(res => {
                        if (res != null) {
                            this.reset();
                        }
                    });
                }
            }
        },

        asignarSucursal(item) {
            item.Employee.forEach(e => {
                axios.post(urlAPI + 'employee/' + e + '/asignarSucursal', {
                    "sucursal": item.Sucursal
                });
            })
        },

        formatTaller(value) {
            return value == true ? "Sí" : "No";
        },

        separarTel(value) {
            try {
                this.prefijo = value.Phone.split("-")[0]
                this.num = value.Phone.split("-")[1]
            } catch (e) {
                return
            }
        },
        separarEmail(value) {
            try {
                this.principioEmail = value.Email.split("@")[0]
                this.finEmail = value.Email.split("@")[1]

            } catch (e) {
                return
            }
        },
        allowedStep: m => m % 30 === 0,

    },
};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.mb-4 {
    width: 12%;
    margin-left: -10%;
}

p {
    text-align: center;
    font-size: 4%;
}
</style>
