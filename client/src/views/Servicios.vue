<template>
<div>
    <v-tabs background-color="#2764c4" tile dark grow>
        <v-tab>Lista de Servicios</v-tab>
    </v-tabs>

    <template>
        <v-speed-dial v-model="fab" :top="top" :right="right" :direction="direction" :open-on-hover="hover" :transition="transition">
            <template v-slot:activator>
                <v-flex class="text-right">
                    <v-btn v-model="fab" color="warning" dark fab>
                        <v-icon v-if="fab">
                            mdi-close
                        </v-icon>
                        <v-icon v-else>
                            mdi-cart-outline
                        </v-icon>
                    </v-btn>
                </v-flex>
            </template>
            <v-col class="text-right" style="margin-left: 20px; margin-top: -20px; margin-bottom: -20px" >
                <v-btn fab dark small color="green">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-col>
              <v-col class="text-right" style="margin-left: 20px;">
                <v-btn fab dark small color="error">
                    <v-icon>mdi-cart-off </v-icon>
                </v-btn>
            </v-col>
        </v-speed-dial>

    </template>
</div>
</template>

<script>
export default {
    data: () => ({
        direction: 'bottom',
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        top: true,
        right: true,
        bottom: true,
        left: false,
        transition: 'slide-y-reverse-transition',
    }),
};
</script>
<style>
.btnOpcion{
    margin-top: 0.1;
    margin-bottom: 0.1;
        padding-top: 0.1;
   padding-bottom: 0.1;
}
</style>