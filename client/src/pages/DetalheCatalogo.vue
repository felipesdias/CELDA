<template>
  <q-page class="column" padding>
    <q-card class="self-center full-width q-mb-md" style="max-width: 1000px;">
      <q-collapsible opened>
        <template slot="header">
          <q-item-main label="Disciplinas" />
          <q-item-side right>
            <q-btn round color="secondary"
                   size="xs"
                   icon="fa fa-plus"
                   @click.stop="$refs.tabelaDisciplina.abrirModalCriar()"/>
          </q-item-side>
        </template>
        <table-disciplinas ref="tabelaDisciplina" v-model="catalogo.disciplinas" 
                           v-if="catalogo.disciplinas"/>
      </q-collapsible>
    </q-card>

    <q-card class="self-center full-width" style="max-width: 1000px;">
      <q-collapsible opened>
        <template slot="header">
          <q-item-main label="Tipos Atividades" />
          <q-item-side right>
            <q-btn round color="secondary"
                   size="xs"
                   icon="fa fa-plus"
                   @click.stop="$refs.tabelaTiposAtividades.abrirModalCriar()"/>
          </q-item-side>
        </template>
        <table-tipos-atividade ref="tabelaTiposAtividades" v-model="catalogo.tiposAtividades" 
                               v-if="catalogo.tiposAtividades"/>
      </q-collapsible>
    </q-card>
  </q-page>
</template>

<script>
import TableDisciplinas from 'components/TabelaDisciplinas';
import TableTiposAtividade from 'components/TabelaTiposAtividade';

export default {
    name: 'DetalheCatalogo',
    components: { TableDisciplinas, TableTiposAtividade },
    data() {
        return {
            catalogo: {}
        }
    },
    created() {
        this.$axios.get(`catalogo/${this.$route.params.catalogoId}`).then(response => {
            this.catalogo = response;
            this.catalogo.tiposAtividades.sort((a, b) => a.ordem - b.ordem);
            this.catalogo.disciplinas.sort((a, b) => a.creditos - b.creditos);
        });
    },
}
</script>

<style>
</style>
