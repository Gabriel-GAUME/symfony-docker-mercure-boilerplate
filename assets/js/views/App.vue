<template>
    <v-app v-if="isLayoutSecurity">
        <layout-security></layout-security>
    </v-app>
    <v-app v-else-if="isLayoutApp" id="content-app">
        <layout></layout>
    </v-app>
</template>

<script>

import Layout from "./Layout/Layout.vue";
import LayoutSecurity from "./Layout/LayoutSecurity";

export default {
    name: "app",
    components: {
        Layout,
        LayoutSecurity,
    },
    data() {
        return {
            appReady: false,
            unloggedRoutes: [
                'login',
                'register',
            ]
        };
    },

    async created() {
        this.appReady = true
        
    },

    computed: {
        isUnloggedRoute() {
            return (this.unloggedRoutes.indexOf(this.$route.name) >= 0)
        },
        isLayoutSecurity() {
            return this.appReady && this.isUnloggedRoute
        },
        isLayoutApp() {
            return this.appReady
        },
    }
};
</script>

<style scoped>
h2 {
    color: #42b983;
}
</style>
