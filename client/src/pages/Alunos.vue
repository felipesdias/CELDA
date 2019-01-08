<template>
  <q-page padding class="column">
    <q-card class="row self-center q-pt-md justify-center q-mb-md" style="max-width: 1000px; width: 100%;">
      <q-input v-model="buscaAluno" class="celda-input"
               hide-underline float-label="Busca"
               style="width: 100%; max-width: 400px;"/>
    </q-card>
    <div class="row justify-center gutter-md self-center" style="max-width: 1000px">
      <div v-for="aluno in alunos" :key="aluno.id">
        <q-card class="q-pa-sm box-aluno cursor-pointer" @click.native="detalhesAluno(aluno)">
          <div class="column">
            <div class="celda-box-avatar self-center">
              <img class="celda-avatar" :src="randomAvatar()">
            </div>
            <div>
              {{ aluno.nome }}
            </div>
            <div>
              {{ aluno.matricula }}
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
    name: 'Alunos',
    data() {
        return {
            todosAlunos: [],
            buscaAluno: ''
        }
    },
    created() {
        this.$axios.get('aluno').then(response => {
            this.todosAlunos = response;
        });
    },
    computed: {
        alunos() {
            return this.todosAlunos.filter(aluno => aluno.nome.indexOf(this.buscaAluno) + aluno.matricula.indexOf(this.buscaAluno) > -2).slice(0, 30);
        }
    },
    methods: {
        randomAvatar() {
            return `https://api.adorable.io/avatars/285/${Math.random().toString(36).substring(7)}.png`;
        },
        detalhesAluno(aluno) {
            this.$router.push({ name: 'detalheAluno', params: { alunoId: aluno.id }});
        }
    }
}
</script>

<style scoped>
.box-aluno:hover {
    box-shadow: 0 0 8px 0px #c3a63b;
}

.celda-box-avatar {
    padding-bottom: 10px;
}

.celda-avatar {
    width: 150px;
}
</style>
