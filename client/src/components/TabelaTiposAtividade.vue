<template>
  <div class="full-width">

    <q-table
      class="full-width no-shadow"
      :data="value"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
    >
      <q-tr slot="body" slot-scope="props" 
            :props="props" class="linha-tabela"
      >
        <q-td key="id" :props="props">{{ props.row.id }}</q-td>
        <q-td key="ordem" :props="props">{{ props.row.ordem }}</q-td>
        <q-td key="nome|descricao" :props="props">
          <div style="font-size: 115%; margin-bottom: 8px">
            {{ props.row.nome }}
          </div>
          <pre >
            {{ props.row.descricao }}
          </pre>
        </q-td>
        <q-td key="max_carga_horaria" :props="props">{{ props.row.max_carga_horaria }}</q-td>
        <q-td key="max_carga_horaria_atividade" :props="props">{{ props.row.max_carga_horaria_atividade }}</q-td>
        <q-td key="acoes" :props="props">
          <div class="corrigeBtn">
            <q-btn size="xs" 
                   round color="primary"
                   icon="fa fa-edit"
                   style="display: inline;"
                   @click="editarTipoAtividade(props.row)"/>
          </div>
          <div class="corrigeBtn">
            <q-btn size="xs" 
                   round color="negative"
                   icon="fa fa-trash"
                   style="display: inline;"
                   @click="abrirModalApagar(tipoAtividade)" />
          </div>
        </q-td>
      </q-tr>
    </q-table>

    <q-modal v-model="apagar.modal" minimized>
      <q-card >
        <q-card-title class="q-pr-lg">
          Apagar Tipo Atividade
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          Todos os dados relacionados a este tipo de atividade serão perdidos. Deseja realmente apagar ?
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="apagar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Apagar" @click="apagarTipoAtividade" 
            color="primary" 
            :loading="apagar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="criar.modal" minimized>
      <q-card :style="{ minWidth: '500px' }">
        <q-card-title class="q-pr-lg">
          {{ criar.criar ? 'Criar' : 'Editar' }} Tipo Atividade
        </q-card-title>
        <q-card-separator />
        <q-card-main class="gutter-sm">
          <q-field :error="$v.item.nome.$error"
                   :error-label="$utils.errorMsg('Nome', $v.item.nome)">
            <q-input v-model="item.nome" 
                     type="textarea"
                     float-label="Nome" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.nome.$touch"
                     @keyup.enter="criarTipoAtividade"/>
          </q-field>

          <q-field :error="$v.item.descricao.$error"
                   :error-label="$utils.errorMsg('Descrição', $v.item.descricao)">
            <q-input v-model="item.descricao" 
                     type="textarea"
                     float-label="Descrição" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.descricao.$touch"/>
          </q-field>

          <q-field :error="$v.item.ordem.$error"
                   :error-label="$utils.errorMsg('Ordem', $v.item.ordem)">
            <q-input v-model="item.ordem" 
                     type="number"
                     float-label="Ordem" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.ordem.$touch"
                     @keyup.enter="criarTipoAtividade"/>
          </q-field>

          <q-field :error="$v.item.max_carga_horaria.$error"
                   :error-label="$utils.errorMsg('Carga Horária Máxima', $v.item.max_carga_horaria)">
            <q-input v-model="item.max_carga_horaria" 
                     type="number"
                     float-label="Carga Horária Máxima" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.max_carga_horaria.$touch"
                     @keyup.enter="criarTipoAtividade"/>
          </q-field>

          <q-field :error="$v.item.max_carga_horaria_atividade.$error"
                   :error-label="$utils.errorMsg('Carga Horária Máxima por Atividade', $v.item.max_carga_horaria_atividade)">
            <q-input v-model="item.max_carga_horaria_atividade" 
                     type="number"
                     float-label="Carga Horária Máxima por Atividade" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.max_carga_horaria_atividade.$touch"
                     @keyup.enter="criarTipoAtividade"/>
          </q-field>

        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="criar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            :label="criar.criar ? 'Criar' : 'Salvar'" @click="criarTipoAtividade" 
            color="primary" 
            :loading="criar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { cloneDeep } from 'lodash';

export default {
    name: 'TabelaTiposAtividades',
    props: {
        value: {
            required: true,
            type: Array
        }
    },
    data () {
        return {
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
                descricao: '',
                max_carga_horaria: null,
                max_carga_horaria_atividade: null,
                ordem: null,
                catalogo_id: this.$route.params.catalogoId
            },
            pagination: {
                sortBy: 'ordem',
                descending: true,
                rowsPerPage: 0
            },
            columns: [
                {
                    name: 'id',
                    required: true,
                    label: 'ID',
                    align: 'left',
                    field: 'id',
                    sortable: true
                },
                {
                    name: 'ordem',
                    required: true,
                    label: 'Ordem',
                    align: 'left',
                    field: 'ordem',
                    sortable: true
                },
                {
                    name: 'nome|descricao',
                    required: true,
                    label: 'Nome / Descrição',
                    align: 'left',
                    field: 'nome|descricao',
                    sortable: false
                },
                {
                    name: 'max_carga_horaria',
                    required: true,
                    label: 'C.M.',
                    align: 'left',
                    field: 'max_carga_horaria',
                    sortable: true
                },
                {
                    name: 'max_carga_horaria_atividade',
                    required: true,
                    label: 'C.M.A.',
                    align: 'left',
                    field: 'max_carga_horaria_atividade',
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
                required
            },
            descricao: {
                required
            },
            ordem: {
                required
            },
            max_carga_horaria: {
                required
            },
            max_carga_horaria_atividade: {
                required
            }
        }
    },
    methods: {
        editarTipoAtividade(row) {
            this.$v.$reset();
            this.item = cloneDeep(row);
            this.criar.modal = true;
            this.criar.criar = false;
        },
        abrirModalCriar() {
            this.$v.$reset();

            this.item.nome = '';
            this.item.descricao = '';
            this.item.max_carga_horaria = null;
            this.item.max_carga_horaria_atividade = null;
            this.item.ordem = Math.max(...this.value.map(item => item.ordem)) + 1;
            this.item.catalogo_id = this.$route.params.catalogoId;

            this.criar.modal = true;
            this.criar.criar = true;
        },
        abrirModalApagar(tipoAtividade) {
            this.apagar.item = tipoAtividade;
            this.apagar.modal = true;
        },
        apagarTipoAtividade() {
            this.apagar.loader = true;
            const index = this.value.findIndex(item => item.id === this.apagar.item.id);
            this.$axios.delete(`tipoAtividade/${this.apagar.item.id}`).then(response => {
                this.$q.notify({
                    message: `Número de tipos de atividades apagados: ${response}`,
                    icon: 'fa fa-trash',
                    color: 'primary'
                });
                this.value.splice(index, 1);
                this.apagar.loader = false;
                this.apagar.modal = false;
            }).catch(() => {
                this.apagar.loader = false;
            });
        },
        criarTipoAtividade() {
            this.$v.item.$touch();

            if (this.$v.item.$error) {
                this.$q.notify('Verifique os campos novamente!');
                return;
            }

            this.criar.loader = true;

            if(this.criar.criar) {
                this.item.catalogo_id = this.$route.params.catalogoId;

                this.$axios.post('tipoAtividade', this.item).then(response => {
                    this.$q.notify({
                        message: 'Tipo Atividade criado com sucesso',
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });

                    this.criar.loader = false;
                    this.criar.modal = false;
                
                    this.value.unshift(response);
                }).catch(() => {
                    this.criar.loader = false;
                });
            } else {
                this.$axios.put(`tipoAtividade/${this.item.id}`, this.item).then(response => {
                    this.$q.notify({
                        message: ` Número de tipo atividade editados: ${response}`,
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });

                    this.criar.loader = false;
                    this.criar.modal = false;
                
                    const index = this.value.findIndex(item => item.id === this.item.id);
                    const novo = cloneDeep(this.value[index]);

                    novo.nome = this.item.nome;
                    novo.descricao = this.item.descricao;
                    novo.ordem = this.item.ordem;
                    novo.max_carga_horaria = this.item.max_carga_horaria;
                    novo.max_carga_horaria_atividade = this.item.max_carga_horaria_atividade;

                    this.value.splice(index, 1, novo);
                }).catch(() => {
                    this.criar.loader = false;
                });
            }
        }
    }
}
</script>

<style lang="stylus" scoped>

>>>.linha-tabela {
    td {
        white-space: inherit;
    }
}

.corrigeBtn {
    display: contents;
}

>>>.linha-tabela:hover {
    background: #791d1f1c;

    td {
        white-space: inherit;
    }
}
</style>
