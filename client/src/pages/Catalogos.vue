<template>
  <q-page padding class="column">
    <div class="row justify-center self-center full-width" style="max-width: 1000px">
      <q-table
        class="full-width"
        title="Catálogos"
        :data="catalogos"
        :columns="columns"
        row-key="id"
        :loading="carregando"
        :pagination.sync="pagination"
      >
        <div slot="top-right" slot-scope="props">
          <q-btn  
            size="xs"
            round color="secondary"
            icon="fa fa-plus"
            @click="abrirModalCriar"/>
        </div>
        <q-tr slot="body" slot-scope="props" 
              :props="props" class="linha-tabela"
        >
          <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
          <q-td key="created_at" :props="props">{{ props.row.created | formatDate('DATE') }}</q-td>
          <q-td key="acoes" :props="props">
            <q-btn size="xs" class="q-mr-sm"
                   round color="primary"
                   icon="fa fa-edit"
                   @click="detalheCatalogo(props.row)"/>
            <q-btn size="xs" 
                   round color="negative"
                   icon="fa fa-trash"
                   @click="abrirModalApagar(props.row)"/>
          </q-td>
        </q-tr>
      </q-table>
    </div>

    <q-modal v-model="apagar.modal" minimized>
      <q-card >
        <q-card-title class="q-pr-lg">
          Apagar catálogo
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          Todos os dados relacionados a este catálogo serão perdidos. Deseja realmente apagar ?
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="apagar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Apagar" @click="apagarCatalogo" 
            color="primary" 
            :loading="apagar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="criar.modal" minimized>
      <q-card >
        <q-card-title class="q-pr-lg">
          Criar catálogo
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <q-field :error="$v.criar.nome.$error"
                   :error-label="$utils.errorMsg('Nome', $v.criar.nome)">
            <q-input v-model="criar.nome" 
                     float-label="Nome" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.criar.nome.$touch"
                     @keyup.enter="criarCatalogo"/>
          </q-field>
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="criar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Criar" @click="criarCatalogo" 
            color="primary" 
            :loading="criar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

  </q-page>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import moment from 'moment';

export default {
    name: 'Catalogos',
    data() {
        return {
            apagar: {
                modal: false,
                loader: false,
                item: {},
            },
            criar: {
                modal: false,
                loader: false,
                nome: '',
            },
            carregando: false,
            catalogos: [],
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
                    name: 'created_at',
                    required: true,
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
                    sortable: false
                }
            ]
        }
    },
    validations: {
        criar: {
            nome: {
                required,
                minLength: minLength(3)
            },
        }
    },
    watch: {
        'criar.modal': function nome() {
            this.nome = '';
        }
    },
    computed: {
        filteredColumns() {
            return this.columns.filter(item => item.name !== 'acoes');
        }
    },
    created() {
        this.carregando = true;

        this.$axios.get('catalogo').then(response => {
            this.catalogos = response;
            this.carregando = false;
        }).catch(() => {
            this.carregando = false;
        });
    },
    methods: {
        abrirModalCriar() {
            this.criar.modal = true;
            this.criar.nome = '';
        },
        detalheCatalogo(catalogo) {
            this.$router.push({ name: 'detalheCatalogo', params: { catalogoId: catalogo.id }});
        },
        abrirModalApagar(catalogo) {
            this.apagar.item = catalogo;
            this.apagar.modal = true;
        },
        apagarCatalogo() {
            this.apagar.loader = true;
            const index = this.catalogos.findIndex(item => item.id === this.apagar.item.id);
            this.$axios.delete(`catalogo/${this.apagar.item.id}`).then(response => {
                this.$q.notify({
                    message: `Número de catálogos apagados: ${response}`,
                    icon: 'fa fa-trash',
                    color: 'primary'
                });
                this.catalogos.splice(index, 1);
                this.apagar.loader = false;
                this.apagar.modal = false;
            }).catch(() => {
                this.apagar.loader = false;
            });
        },
        criarCatalogo() {
            this.$v.criar.$touch();

            if (this.$v.criar.$error) {
                this.$q.notify('Verifique os campos novamente!');
                return;
            }

            this.criar.loader = true;
            this.$axios.post('catalogo', { nome: this.criar.nome }).then(response => {
                this.$q.notify({
                    message: 'Catálogo criado com sucesso',
                    icon: 'fa fa-thumbs-up',
                    color: 'primary'
                });
                this.criar.loader = false;
                this.criar.modal = false;
                this.catalogos.unshift(response);
            }).catch(() => {
                this.criar.loader = false;
            });
        }
    }
}
</script>

<style lang="stylus" scoped>
>>>.linha-tabela:hover {
    background: #791d1f1c;
}
</style>
