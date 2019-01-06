<template>
  <q-layout view="hHh LpR fff" class="cg-bg-main">
    <!-- Header Layout -->
    <q-layout-header>
      <q-toolbar 
        class="row q-pa-none cg-bg-top-menu" 
        reveal>
        <div class="row fit">
          <!-- Clock and logo left -->
          <div class="row">
            <img 
              style="padding: 17.5px 10px; box-sizing: content-box;"
              src="statics/logo_vale_img.png" 
              width="30" 
              height="26"
            >
            <div class="q-ml-sm relogio row items-center cg-color-text-clock">
              {{ horaAtual }}
            </div>

          </div>

          <kpis/>

          <div class="col"/>
          <!-- Top menu -->
          <div class="row">
            <header-menu/>
            <div class="q-mx-md"/>
            <notifications />
            <profile-context />
          </div>
        </div>

      </q-toolbar>
    </q-layout-header>

    <!-- Footer layout -->
    <q-layout-footer>
      <q-toolbar>
        <q-toolbar-title class="text-center">
          Accenture @2018
          <span slot="subtitle">GCO</span>
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
}
</script>

<style>
</style>
