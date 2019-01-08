<template>
  <q-layout view="hHh LpR fff">
    <!-- Header Layout -->
    <q-layout-header>
      <q-toolbar 
        class="row" 
        reveal>
        <q-toolbar-title class="text-center">
          CELDA
        </q-toolbar-title>
        <div class="row justify-end">
          <q-btn flat color="tertiary" 
                 icon="fa fa-users" @click="$router.push({ name: 'alunos' })"/>
          <q-btn flat color="tertiary" 
                 icon="fa fa-clipboard" @click="$router.push({ name: 'catalogos' })"/>
          <q-btn flat color="tertiary" 
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
            this.$router.push('login');
        }
    }
}
</script>

<style>
</style>
