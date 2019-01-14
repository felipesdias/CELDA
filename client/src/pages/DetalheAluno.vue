<template>
  <q-page padding class="column">
    <div class="column items-center self-center full-width" style="max-width: 1000px">
      <table-aluno-disciplina v-if="aluno.id" v-model="aluno" 
                              class="q-mb-lg"/>
      <table-aluno-atividade v-if="aluno.id" v-model="aluno" />
    </div>
  </q-page>
</template>

<script>
import TableAlunoDisciplina from 'components/TabelaAlunoDisciplina';
import TableAlunoAtividade from 'components/TabelaAlunoAtividade';

export default {
    name: 'DetalheAluno',
    components: { TableAlunoAtividade, TableAlunoDisciplina },
    data() {
        return {
            aluno: {}
        }
    },
    created() {
        this.$axios.get(`aluno/${this.$route.params.alunoId}`).then(response => {
            this.aluno = response;
        }).catch(() => {

        });
    },
    methods: {

    }
}
</script>

<style>
</style>
