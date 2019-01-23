<template>
  <q-page padding class="column">
    <div class="row justify-center self-center full-width" style="max-width: 1000px">
      <q-table
        class="full-width"
        title="Alunos"
        :data="alunos"
        :columns="columns"
        row-key="id"
        :loading="carregando"
        :pagination.sync="pagination"
      >
        <div slot="top-right" slot-scope="props" 
             class="row items-center">
          <q-checkbox v-model="finalizado" label="Finalizados" 
                      toggle-indeterminate class="q-mr-md q-pr-md" />
          <q-input v-model="buscaAluno" class="celda-input"
                   hide-underline float-label="Busca" 
          />
          <q-btn  
            size="xs"
            class="q-ml-md"
            round color="secondary"
            icon="fa fa-plus"
            @click="abrirModalCriar()"/>
        </div>
        <q-tr slot="body" slot-scope="props" 
              :props="props" class="linha-tabela"
              :class="{ finalizado: props.row.finalizado }"
        >
          <q-td key="avatar" :props="props" >
            <img class="celda-avatar" :src="randomAvatar()">
          </q-td>
          <q-td key="nome" :props="props" >{{ props.row.nome }}</q-td>
          <q-td key="matricula" :props="props" >{{ props.row.matricula }}</q-td>
          <q-td key="email" :props="props" >{{ props.row.email }}</q-td>
          <q-td key="old" :props="props">{{ props.row.old ? 'Sim' : 'Não' }}</q-td>
          <q-td key="created_at" :props="props" >{{ props.row.created_at | formatDate('DATE') }}</q-td>
          <q-td key="acoes" :props="props" >
            <q-btn 
              v-if="$can('adm')"
              size="xs" class="q-mr-sm"
              round
              :color="props.row.finalizado ? 'positive' : 'light'"
              icon="fa fa-check"
              :loading="props.row.loading"
              @click="finalizarAluno(props.row)"/>

            <q-btn size="xs"
                   round color="primary"
                   icon="fa fa-edit"
                   @click.native="detalhesAluno(props.row)"/>

          </q-td>
        </q-tr>
      </q-table>
    </div>

    

    <q-modal v-model="criar.modal" minimized>
      <q-card :style="{ minWidth: '500px' }">
        <q-card-title class="q-pr-lg">
          Criar Aluno
        </q-card-title>
        <q-card-separator />
        <q-card-main class="gutter-sm">
          <q-field :error="$v.aluno.nome.$error"
                   :error-label="$utils.errorMsg('Nome', $v.aluno.nome)">
            <q-input v-model="aluno.nome" 
                     type="textarea"
                     float-label="Nome" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.aluno.nome.$touch"
                     @keyup.enter="criarAluno"/>
          </q-field>

          <q-field :error="$v.aluno.matricula.$error"
                   :error-label="$utils.errorMsg('Matrícula', $v.aluno.matricula)">
            <q-input v-model="aluno.matricula" 
                     type="textarea"
                     float-label="Matrícula" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.aluno.matricula.$touch"
                     @keyup.enter="criarAluno"/>
          </q-field>

          <q-field :error="$v.aluno.email.$error"
                   :error-label="$utils.errorMsg('Email', $v.aluno.email)">
            <q-input v-model="aluno.email" 
                     type="textarea"
                     float-label="Email" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.aluno.email.$touch"
                     @keyup.enter="criarAluno"/>
          </q-field>

          <q-field :error="$v.aluno.catalogo_id.$error"
                   :error-label="$utils.errorMsg('Cátalogo', $v.aluno.catalogo_id)">
            <q-select
              class="celda-input"
              filter
              :display-value="catalogoNome"
              v-model="aluno.catalogo"
              :options="catalogos"
              autofocus-filter
              filter-placeholder="Busca"
              float-label="Catálogo"
            />
          </q-field>
         

        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="criar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Criar" @click="criarAluno" 
            color="primary" 
            :loading="criar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'Alunos',
    data() {
        return {
            catalogos: [],
            finalizado: null,
            criar: {
                modal: false,
                criando: false,
                nome_catalogo: null,
            },
            aluno: {
                nome: null,
                email: null,
                matricula: null,
                catalogo_id: null,
                catalogo: null
            },
            todosAlunos: [],
            buscaAluno: '',
            pagination: {
                sortBy: '',
                descending: true,
                rowsPerPage: 10
            },
            carregando: false,
            columns: [
                {
                    name: 'avatar',
                    label: 'Foto',
                    align: 'center',
                    field: 'avatar',
                    sortable: false
                },
                {
                    name: 'nome',
                    label: 'Nome',
                    align: 'left',
                    field: 'nome',
                    sortable: true
                },
                {
                    name: 'matricula',
                    label: 'Matrícula',
                    align: 'left',
                    field: 'matricula',
                    sortable: false
                },
                {
                    name: 'email',
                    label: 'Email',
                    align: 'left',
                    field: 'email',
                    sortable: false
                },
                {
                    name: 'old',
                    label: 'Old',
                    align: 'left',
                    field: 'old',
                    sortable: true
                },
                {
                    name: 'created_at',
                    label: 'Criado em',
                    align: 'left',
                    field: 'created_at',
                    sortable: true
                },
                {
                    name: 'acoes',
                    label: 'Ações',
                    align: 'center',
                    field: 'acoes',
                    sortable: true
                }
            ]
        }
    },
    validations: {
        aluno: {
            nome: {
                required
            },
            email: {
                required
            },
            matricula: {
                required
            },
            catalogo_id: {
                required
            },
        }
    },
    created() {
        this.carregando = true;
        this.$axios.get('aluno').then(response => {
            this.todosAlunos = response.map(item => {
                item.loading = false;
                return item;
            });
            this.carregando = false;
        }).catch(() => {
            this.carregando = false;
        });

        this.$axios.get('catalogo').then(response => {
            this.catalogos = response.map(item => ({
                label: item.nome,
                value: item
            }));
        });
    },
    computed: {
        alunos() {
            return this.todosAlunos.filter(aluno => (this.finalizado === null || !!aluno.finalizado === this.finalizado) && aluno.nome.indexOf(this.buscaAluno) + aluno.matricula.indexOf(this.buscaAluno) > -2).slice(0, 30);
        },
        catalogoNome() {
            return (this.aluno.catalogo || {}).nome;
        }
    },
    methods: {
        finalizarAluno(aluno) {
            aluno.loading = true;
            this.$axios.put(`aluno/${aluno.id}/finalizar`, { finalizado: !aluno.finalizado }).then(() => {
                aluno.finalizado = !aluno.finalizado;
                aluno.loading = false;
            }).catch(() => {
                aluno.loading = false;
            });
        },
        criarAluno() {
            this.criar.criando = true;
            this.aluno.catalogo_id = this.aluno.catalogo.id;

            this.$v.aluno.$touch();

            if (this.$v.aluno.$error) {
                this.$q.notify('Verifique os campos novamente!');
                return;
            }

            this.$axios.post('aluno', this.aluno).then(response => {
                this.todosAlunos.unshift(response);
                this.criar.criando = false;
                this.criar.modal = false;
            }).catch(() => {
                this.criar.criando = false;
            });
        },
        abrirModalCriar() {
            this.criar.modal = true;
            this.aluno.nome = null;
            this.aluno.email = null;
            this.aluno.matricula = null;
            this.aluno.catalogo_id = null;
            this.aluno.catalogo = null;
            this.$v.$reset();
        },
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
>>>.linha-tabela:hover {
    background: #791d1f1c;
}

.celda-avatar {
    max-width: 100%;
    max-height: 100%;
}

.finalizado {
    background: #e9ffe9;
}
</style>
