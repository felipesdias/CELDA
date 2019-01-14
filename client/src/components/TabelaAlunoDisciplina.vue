<template>
  <q-card class="column full-width q-pa-md">
    <div class="row full-width">
      <div class="column items-end">
        <div class="col-auto q-pb-md">
          <strong>Disciplina:</strong>
        </div>
        <div class="col-auto q-pb-md">
          <strong>Créditos:</strong>
        </div>
        <div class="col row q-pb-md">
          <div class="self-center">
            <strong>Matrículado:</strong>
          </div>
        </div>
      </div>
      <div v-for="disciplina in value.tiposDisciplinas" :key="disciplina.id" 
           class="column col full-width items-center ">
        <div class="q-pb-md">
          {{ disciplina.nome }}
        </div>
        <div class="q-pb-md">
          {{ disciplina.creditos }}
        </div>
        <div class="q-pb-md">
          <q-btn size="xs" 
                 round icon="fa fa-check" 
                 :color="isSelected(disciplina) ? 'positive' : 'light'"
                 @click="matricular(disciplina)"/>
        </div>
        <q-item-separator class="full-width q-pa-none"/>
      </div>
    </div>
    <q-item-separator class="full-width q-pa-none"/>
    <div class="row full-width q-pt-md">
      <div class="col column text-center">
        <q-select
          class="celda-input"
          filter
          :display-value="value.catalogo.nome"
          v-model="value.catalogo"
          :options="catalogos"
          @input="changeCatalogo"
          autofocus-filter
          filter-placeholder="Busca"
          float-label="Catálogo"
        />
      </div>
      <div class="col column text-center">
        <strong class="q-pb-sm">Horas Sujeridas</strong>
        {{ getHS }}
      </div>
      <div class="col column text-center">
        <strong class="q-pb-sm">Horas Planejadas</strong>
        {{ getHP }}
      </div>
      <div class="col column text-center">
        <strong class="q-pb-sm">Horas Confirmadas</strong>
        {{ getHC }}
      </div>
      <div class="col column text-center">
        <strong class="q-pb-sm">Horas Objetivo</strong>
        {{ getHO }}
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
    name: 'TabelaAlunoDisciplina',
    props: {
        value: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            catalogos: []
        }
    },
    created() {
        this.value.catalogo = this.value.catalogo || {}
        this.$axios.get('catalogo').then(response => {
            this.catalogos = response.map(item => ({
                label: item.nome,
                value: item
            }));
        });
    },
    computed: {
        getHS() {
            let soma = 0;
            this.value.atividades.forEach(item => {
                soma += item.carga_sugerida || 0;
            });
            return soma;
        },
        getHP() {
            let soma = 0;
            this.value.atividades.forEach(item => {
                soma += item.carga_planejada || 0;
            });
            return soma;
        },
        getHC() {
            let soma = 0;
            this.value.atividades.forEach(item => {
                if(item.confirmado)
                    soma += item.carga_confirmada || 0;
            });
            return soma;
        },
        getHO() {
            let soma = 0;
            this.value.disciplinas.forEach(item => {
                soma += item.creditos;
            });
            return soma;
        }
    },
    methods: {
        changeCatalogo(newCatalogo) {
            this.$axios.put(`aluno/${this.value.id}/catalogo`, { catalogo_id: newCatalogo.id }).then(response => {
                this.$emit('input', response);
            }).catch(() => {

            });
        },
        isSelected(disciplina) {
            return this.value.disciplinas.findIndex(item => item.id === disciplina.id) !== -1;
        },
        matricular(disciplina) {
            const index = this.value.disciplinas.findIndex(item => item.id === disciplina.id);

            if(index === -1) {
                this.value.disciplinas.push(disciplina);
            } else {
                this.value.disciplinas.splice(index, 1);
            }
        }
    }
}
</script>

<style>
</style>
