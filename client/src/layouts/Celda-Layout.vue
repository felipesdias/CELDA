<template>
  <q-layout view="hHh LpR fff">
    <!-- Header Layout -->
    <q-layout-header>
      <q-toolbar 
        class="row" 
        reveal>
        <q-toolbar-title class="text-center">
          CELDA - UFV
        </q-toolbar-title>
        <div class="row icones-header">
          <q-btn v-if="$can('adm,aux')"
                 flat color="white" 
                 label="Alunos" class="q-mr-md"
                 icon="fa fa-users" @click="$router.push({ name: 'alunos' })"/>
          <q-btn v-if="$can('adm')"
                 flat color="white" 
                 label="Catálogos" class="q-mr-md"
                 icon="fa fa-clipboard-list" @click="$router.push({ name: 'catalogos' })"/>
          <q-btn flat color="white" 
                 label="Sair"
                 icon="fa fa-sign-out-alt" @click="sair"/>
        </div>

      </q-toolbar>
    </q-layout-header>

    <!-- Footer layout -->
    <q-layout-footer>
      <q-toolbar>
        <q-toolbar-title class="text-center">
          CELDA - Controle e Lançamento de Atividades
          <span slot="subtitle"> {{ msgFooter }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-footer>

    <q-page-container class="fit overflow-hidden">
      <!-- This is where pages get injected -->
      <transition name="component-fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
    name: 'CeldaLayout',
    data() {
        return {
            msgFooter: 'Developed by Felipe de Souza Dias <felipe.s.dias@outlook.com>',
            busca: ''
        }
    },
    methods: {
        sair() {
            this.$q.sessionStorage.clear();
            this.$router.push({ name: 'login' });
        }
    }
}
</script>

<style scoped>
.icones-header {
    position: absolute;
    right: 12px;
}
</style>
