<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table single-select v-model="selected" show-select :headers="headers" :items="sucursales" :search="search" item-key="_id" sort-by="Name" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-dialog v-model="dialog" max-width="800px">
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
                                                <v-select v-model="editedItem.city" v-if="editedItem.Country=='Argentina'" :items="localidades" label="Localidad" :rules="requerido"></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="12">
                                                <v-text-field v-model="editedItem.cityNL" v-if="editedItem.Country!='Argentina'" label="Localidad" :rules="requerido"></v-text-field>
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
                                                <v-text-field :rules="reglaTelefono" v-model="num" label="Número"></v-text-field>
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
                                                        <v-time-picker v-if="openLunes" v-model="timeOLunes" full-width @click:minute="$refs.menuOLunes.save(timeOLunes)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCLunes" :disabled="!abreLunes" v-model="closeLunes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCLunes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCLunes" label="Cierre Lunes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeLunes" v-model="timeCLunes" full-width @click:minute="$refs.menuCLunes.save(timeCLunes)"></v-time-picker>
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
                                                        <v-time-picker v-if="openMartes" v-model="timeOMartes" full-width @click:minute="$refs.menuOMartes.save(timeOMartes)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCMartes" :disabled="!abreMartes" v-model="closeMartes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCMartes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCMartes" label="Cierre Martes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeMartes" v-model="timeCMartes" full-width @click:minute="$refs.menuCMartes.save(timeCMartes)"></v-time-picker>
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
                                                        <v-time-picker v-if="openMiercoles" v-model="timeOMiercoles" full-width @click:minute="$refs.menuOMiercoles.save(timeOMiercoles)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCMiercoles" :disabled="!abreMiercoles" v-model="closeMiercoles" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCMiercoles" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCMiercoles" label="Cierre Miércoles" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeMiercoles" v-model="timeCMiercoles" full-width @click:minute="$refs.menuCMiercoles.save(timeCMiercoles)"></v-time-picker>
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
                                                        <v-time-picker v-if="openJueves" v-model="timeOJueves" full-width @click:minute="$refs.menuOJueves.save(timeOJueves)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCJueves" :disabled="!abreJueves" v-model="closeJueves" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCJueves" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCJueves" label="Cierre Jueves" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeJueves" v-model="timeCJueves" full-width @click:minute="$refs.menuCJueves.save(timeCJueves)"></v-time-picker>
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
                                                        <v-time-picker v-if="openViernes" v-model="timeOViernes" full-width @click:minute="$refs.menuOViernes.save(timeOViernes)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCViernes" :disabled="!abreViernes" v-model="closeViernes" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCViernes" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCViernes" label="Cierre Viernes" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeViernes" v-model="timeCViernes" full-width @click:minute="$refs.menuCViernes.save(timeCViernes)"></v-time-picker>
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
                                                        <v-time-picker v-if="openSabado" v-model="timeOSabado" full-width @click:minute="$refs.menuOSabado.save(timeOSabado)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCSabado" :disabled="!abreSabado" v-model="closeSabado" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCSabado" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCSabado" label="Cierre Sábado" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeSabado" v-model="timeCSabado" full-width @click:minute="$refs.menuCSabado.save(timeCSabado)"></v-time-picker>
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
                                                        <v-time-picker v-if="openDomingo" v-model="timeODomingo" full-width @click:minute="$refs.menuODomingo.save(timeODomingo)"></v-time-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="5">
                                                    <v-menu ref="menuCDomingo" :disabled="!abreDomingo" v-model="closeDomingo" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeCDomingo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field v-model="timeCDomingo" label="Cierre Domingo" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-time-picker v-if="closeDomingo" v-model="timeCDomingo" full-width @click:minute="$refs.menuCDomingo.save(timeCDomingo)"></v-time-picker>
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
                                            
                                            <v-radio-group class="text-align: left" v-model="editedItem.taller" row :rules="requerido">
                                                <h3>Taller: </h3>
                                                <v-radio class="mb-1" label="Sí"  value="true" ></v-radio>
                                                <v-radio class="mb-1" label="No"  value="false"></v-radio>
                                            </v-radio-group>
                                        </v-row>

                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn class="info" text @click="close">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info" text @click="save">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-col cols="12" sm="12" md="12">
                                <p class="headline">Ingrese los Motivos: </p>
                                <v-textarea class="headline" v-model="motivos" label="Motivos" required></v-textarea>
                            </v-col>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="info" text @click="closeDelete">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                                <v-btn class="info" text @click="deleteItemConfirm">
                                    <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

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

export default {
    data: () => ({
        editedIndex: -1,
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,

        editedItem: {
            Name:'',
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
            city: "",
            cityNL: "",
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
            city: "",
            cityNL: "",
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

    watch: {
        dialog(val) {
            val || this.reiniciar()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

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
        async getsucursales() {
            await axios.get('http://localhost:8081/branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(s => s.Status === "ACTIVE")
                });
        },

        async getEmpleados() {
            await axios.get('http://localhost:8081/employee')
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
            this.obtenerPrefijo(value);
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

        editItem(item) {
            if (!this.mensajeNoSelecciono()) {
                if (this.selected.length > 1) {
                    this.snackbar = true
                    this.mensaje = "Sólo puede editar un elemento a la vez!"
                    return;
                }
                this.editedIndex = this.sucursales.indexOf(item);

                this.formTitle = "Editar editedIteme";
                this.dialog = true;
            }
        },

        deleteItem() {
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            for (let i = 0; i < this.selected.length; i++) {
                this.editar("INACTIVE", this.selected[i]);
                this.sucursales.splice(this.sucursales.indexOf(this.selected[i]), 1);
            }
            this.closeDelete()
        },

        reset() {
            this.selected = [];
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        close() {
            this.dialog = false
            this.reset()
        },

        closeDelete() {
            this.dialogDelete = false
            this.reset()
        },

        validate() {
            return this.$refs.form.validate()
        },

        getJSONSucursal(selected, status) {
            let Province="";
            let city="";
            if(selected.Country=="Argentina"){
                Province = this.editedItem.Province;
                city = this.editedItem.city;
            }
            else{
                Province = this.editedItem.ProvinceNL;
                city = this.editedItem.cityNL;
            }
            return {
                "branchOffice": {
                    "Name": selected.Name,
                    "Phone": selected.Phone,
                    "Email": selected.Email,
                    "Status": status,
                    "Address": {
                        "Country": selected.Country,
                        "City": city,
                        "Province": Province,
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
                })
                .catch(err => {
                    console.log(err)
                });
        },

        transformarAMinutos(tiempo) {
            if (tiempo != "-1") {
                tiempo = tiempo.split(":");
                return parseInt(tiempo[0] * 60) + parseInt(tiempo[1]);
            } else {
                return -1;
            }
        },

        save() {
            if(this.validate() && this.editedItem.taller!=null){
            let timeOLunes = this.timeOLunes == null ? "-1" : this.timeOLunes;
            let timeCLunes = this.timeCLunes == null ? "-1" : this.timeCLunes;
            let timeOMartes = this.timeOMartes == null ? "-1" : this.timeOMartes;
            let timeCMartes = this.timeCMartes == null ? "-1" : this.timeCMartes;
            let timeOMiercoles = this.timeOMiercoles == null ? "-1" : this.timeOMiercoles;
            let timeCMiercoles = this.timeCMiercoles == null ? "-1" : this.timeCMiercoles;
            let timeOJueves = this.timeOJueves == null ? "-1" : this.timeOJueves;
            let timeCJueves = this.timeCJueves == null ? "-1" : this.timeCJueves;
            let timeOViernes = this.timeOViernes == null ? "-1" : this.timeOViernes;
            let timeCViernes = this.timeCViernes == null ? "-1" : this.timeCViernes;
            let timeOSabado = this.timeOSabado == null ? "-1" : this.timeOSabado;
            let timeCSabado = this.timeCSabado == null ? "-1" : this.timeCSabado;
            let timeODomingo = this.timeODomingo == null ? "-1" : this.timeODomingo;
            let timeCDomingo = this.timeCDomingo == null ? "-1" : this.timeCDomingo;
            let mensajes = ["La hora de apertura no puede ser mayor a la hora de cierre!", "Las horas de apertura y cierre son obligatorias!"];
            let mensaje = "";
            if ((timeOLunes != "-1" && timeCLunes != "-1" && timeOLunes > timeCLunes) ||
                (timeOMartes != "-1" && timeCMartes != "-1" && timeOMartes > timeCMartes) ||
                (timeOMiercoles != "-1" && timeCMiercoles != "-1" && timeOMiercoles > timeCMiercoles) ||
                (timeOJueves != "-1" && timeCJueves != "-1" && timeOJueves > timeCJueves) ||
                (timeOViernes != "-1" && timeCViernes != "-1" && timeOViernes > timeCViernes) ||
                (timeOSabado != "-1" && timeCSabado != "-1" && timeOSabado > timeCSabado) ||
                (timeODomingo != "-1" && timeCDomingo != "-1" && timeODomingo > timeCDomingo)) {
                mensaje = mensajes[0];
            }
            if (((timeOLunes == "-1" || timeCLunes == "-1") && this.abreLunes) ||
                ((timeOMartes == "-1" || timeCMartes == "-1") && this.abreMartes) ||
                ((timeOMiercoles == "-1" || timeCMiercoles == "-1") && this.abreMiercoles) ||
                ((timeOJueves == "-1" || timeCJueves == "-1") && this.abreJueves) ||
                ((timeOViernes == "-1" || timeCViernes == "-1") && this.abreViernes) ||
                ((timeOSabado == "-1" || timeCSabado == "-1") && this.abreSabado) ||
                ((timeODomingo == "-1" || timeCDomingo == "-1") && this.abreDomingo)) {
                mensaje = mensajes[1];
            }
            if (mensaje != "") {
                this.mensaje = mensaje;
                this.snackbar = true;
                return;
            }

            this.editedItem.openLunes = this.transformarAMinutos(timeOLunes);
            this.editedItem.openMartes = this.transformarAMinutos(timeOMartes);
            this.editedItem.openMiercoles = this.transformarAMinutos(timeOMiercoles);
            this.editedItem.openJueves = this.transformarAMinutos(timeOJueves);
            this.editedItem.openViernes = this.transformarAMinutos(timeOViernes);
            this.editedItem.openSabado = this.transformarAMinutos(timeOSabado);
            this.editedItem.openDomingo = this.transformarAMinutos(timeODomingo);

            //editedIteme Nuevo
            if (this.selected[0] == null) {
                this.editedItem.Email = this.principioEmail + "@" + this.finEmail;
                this.editedItem.Phone = this.num;
                let jsonSucursal = this.getJSONSucursal(this.editedItem,"ACTIVE");
                this.post('http://localhost:8081/branchOffice/add', JSON.stringify(jsonSucursal));
                this.sucursales.push(this.editedItem);
                this.reiniciar();
            }
            //Editar editedIteme
            else {
                this.editedItem.Email = this.principioEmail + "@" + this.finEmail;
                this.editedItem.Phone = this.num;
                Object.assign(this.sucursales[this.editedIndex], this.editedItem);
                let jsonSucursal = this.getJSONSucursal(this.editedItem,"ACTIVE");
                this.post('http://localhost:8081/branchOffice/' + this.editedItem._id + "/update", JSON.stringify(jsonSucursal));
                this.reiniciar();
            }
            }
        },

        editar(estado, selected) {
            selected.Status = estado;
            let jsonSucursal = this.getJSONSucursal(this.editedItem,"INACTIVE");
            this.post('http://localhost:8081/editedItem/' + selected._id + '/update', JSON.stringify(jsonSucursal));
        },

        reiniciar() {
            this.close();
            this.selected = [];
            this.editedItem = this.defaultItem;
            this.prefijo = '';
            this.num = '';
            this.principioEmail = '';
            this.finEmail = '';
            this.$refs.form.resetValidation();
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

p,
.motivos {
    text-align: center;
    font-size: 4%;
}
</style>
