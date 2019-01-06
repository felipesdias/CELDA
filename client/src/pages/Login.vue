<template>
  <q-page padding>
    <div class="fixed-center">
      <q-card class="q-pa-xl">
        <img src="statics/zelda-login.jpg" style="max-width: 350px;"> 

        <div class="column">
          <q-input class="celda-input" float-label="Matrícula" 
                   hide-underline />
          <q-input class="celda-input" float-label="Senha" 
                   hide-underline />
          <q-btn> Entrar </q-btn>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
    name: 'Login',
}
</script>

<style>
</style>
