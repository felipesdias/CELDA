<template>
  <div class="full-width">
    <q-table
      class="full-width no-shadow"
      :data="disciplinas"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
    >
      <q-tr slot="body" slot-scope="props" 
            :props="props" class="linha-tabela"
      >
        <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
        <q-td key="creditos" :props="props">{{ props.row.creditos }}</q-td>
        <q-td key="acoes" :props="props">
          <q-btn size="xs" class="q-mr-sm"
                 round color="primary"
                 icon="fa fa-edit"
                 @click="editarDisciplina(props.row)"/>
          <q-btn size="xs" 
                 round color="negative"
                 icon="fa fa-trash"
                 @click="abrirModalApagar(props.row)"/>
        </q-td>
      </q-tr>
    </q-table>

    <q-modal v-model="apagar.modal" minimized>
      <q-card >
        <q-card-title class="q-pr-lg">
          Apagar Disciplina
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          Todos os dados relacionados a esta disciplina serão perdidos. Deseja realmente apagar ?
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="apagar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Apagar" @click="apagarDisciplina" 
            color="primary" 
            :loading="apagar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="criar.modal" minimized>
      <q-card >
        <q-card-title class="q-pr-lg">
          {{ criar.criar ? 'Criar' : 'Editar' }} Disciplina
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <q-field :error="$v.item.nome.$error" class="q-mb-md"
                   :error-label="$utils.errorMsg('Nome', $v.item.nome)">
            <q-input v-model="item.nome" 
                     float-label="Nome" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.nome.$touch"
                     @keyup.enter="criarDisciplina"/>
          </q-field>

          <q-field :error="$v.item.creditos.$error"
                   :error-label="$utils.errorMsg('Créditos', $v.item.creditos)">
            <q-input v-model="item.creditos" 
                     type="number"
                     float-label="Créditos" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.creditos.$touch"
                     @keyup.enter="criarDisciplina"/>
          </q-field>
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="criar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            :label="criar.criar ? 'Criar' : 'Salvar'" @click="criarDisciplina" 
            color="primary" 
            :loading="criar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { cloneDeep } from 'lodash';

export default {
    name: 'TabelaDisciplinas',
    props: {
        value: {
            required: true,
            type: Array
        }
    },
    data () {
        return {
            disciplinas: this.value,
            apagar: {
                modal: false,
                loader: false,
                item: {},
            },
            criar: {
                modal: false,
                loader: false,
                criar: false
            },
            item: {
                nome: '',
                creditos: null
            },
            pagination: {
                sortBy: '',
                descending: true,
                rowsPerPage: 0
            },
            columns: [
                {
                    name: 'nome',
                    required: true,
                    label: 'Nome',
                    align: 'left',
                    field: 'nome',
                    sortable: true
                },
                {
                    name: 'creditos',
                    required: true,
                    label: 'Créditos',
                    align: 'left',
                    field: 'creditos',
                    sortable: true
                },
                {
                    name: 'acoes',
                    label: 'Ações',
                    align: 'center',
                    field: 'acoes',
                    sortable: false
                }
            ]
        }
    },
    validations: {
        item: {
            nome: {
                required,
                minLength: minLength(3)
            },
            creditos: {
                required
            }
        }
    },
    methods: {
        editarDisciplina(row) {
            this.$v.$reset();
            this.item = cloneDeep(row);
            this.criar.modal = true;
            this.criar.criar = false;
        },
        abrirModalCriar() {
            this.$v.$reset();
            this.item.nome = '';
            this.item.creditos = null;
            this.criar.modal = true;
            this.criar.criar = true;
        },
        abrirModalApagar(disciplina) {
            this.apagar.item = disciplina;
            this.apagar.modal = true;
        },
        apagarDisciplina() {
            this.apagar.loader = true;
            const index = this.disciplinas.findIndex(item => item.id === this.apagar.item.id);
            this.$axios.delete(`disciplina/${this.apagar.item.id}`).then(response => {
                this.$q.notify({
                    message: `Número de disciplinas apagadas: ${response}`,
                    icon: 'fa fa-trash',
                    color: 'primary'
                });
                this.disciplinas.splice(index, 1);
                this.apagar.loader = false;
                this.apagar.modal = false;
            }).catch(() => {
                this.apagar.loader = false;
            });
        },
        criarDisciplina() {
            this.$v.item.$touch();

            if (this.$v.item.$error) {
                this.$q.notify('Verifique os campos novamente!');
                return;
            }

            this.criar.loader = true;

            if(this.criar.criar) {
                this.item.catalogo_id = this.$route.params.catalogoId;

                this.$axios.post('disciplina', this.item).then(response => {
                    this.$q.notify({
                        message: 'Catálogo criado com sucesso',
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });

                    this.criar.loader = false;
                    this.criar.modal = false;
                
                    this.disciplinas.unshift(response);
                }).catch(() => {
                    this.criar.loader = false;
                });
            } else {
                this.$axios.put(`disciplina/${this.item.id}`, this.item).then(response => {
                    this.$q.notify({
                        message: ` Número de catálogos editados: ${response}`,
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });

                    this.criar.loader = false;
                    this.criar.modal = false;
                
                    const index = this.disciplinas.findIndex(item => item.id === this.item.id);
                    const novo = cloneDeep(this.disciplinas[index]);

                    novo.nome = this.item.nome;
                    novo.creditos = this.item.creditos;

                    this.disciplinas.splice(index, 1, novo);

                }).catch(() => {
                    this.criar.loader = false;
                });
            }

        }
    }
}
</script>

<style lang="stylus" scoped>
>>>.linha-tabela:hover {
    background: #791d1f1c;
}
</style>
