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
            round color="secondary"
            icon="fa fa-plus" :loading="criando"
            @click.native="criarCatalogo"/>
        </div>
        <q-tr slot="body" slot-scope="props" 
              :props="props" class="linha-tabela"
        >
          <q-td key="id" :props="props" 
                class="cursor-pointer" @click.native="detalheCatalogo(props.row)">{{ props.row.id }}</q-td>
          <q-td key="nome" :props="props" 
                class="cursor-pointer" @click.native="detalheCatalogo(props.row)">{{ props.row.nome }}</q-td>
          <q-td key="created" :props="props" 
                class="cursor-pointer" @click.native="detalheCatalogo(props.row)">{{ props.row.created }}</q-td>
          <q-td key="acoes" :props="props">
            <q-btn size="sm" flat 
                   round color="negative"
                   icon="fa fa-trash"
                   :loading="props.row.apagando"
                   @click.native="apagarCatalogo(props.row)"/>
          </q-td>
        </q-tr>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment';

export default {
    name: 'Catalogos',
    data() {
        return {
            carregando: false,
            catalogos: [],
            criando: false,
            pagination: {
                sortBy: 'id', // String, column "name" property value
                descending: true,
                rowsPerPage: 0 // current rows per page being displayed
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
                    name: 'nome',
                    required: true,
                    label: 'Nome',
                    align: 'left',
                    field: 'nome',
                    sortable: true
                },
                {
                    name: 'created',
                    required: true,
                    label: 'Criado em',
                    align: 'left',
                    field: 'created',
                    sortable: true
                },
                {
                    name: 'acoes',
                    label: 'Ações',
                    align: 'left',
                    field: 'acoes',
                    sortable: false
                }
            ]
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
            this.catalogos = response.map(item => {
                item.created = moment(item.crated_at).format('DD/MM/YYYY');
                item.apagando = false;
                return item;
            });
            this.carregando = false;
        }).catch(() => {
            this.carregando = false;
        });
    },
    methods: {
        detalheCatalogo(catalogo) {
            
        },
        apagarCatalogo(catalogo) {
            this.$q.dialog({
                title: 'Apagar catálogo',
                message: 'Todos os dados relacionados a este catálogo serão perdidos. Deseja realmente apagar ?',
                ok: 'Sim',
                cancel: 'Cancelar'
            }).then(() => {
                const index = this.catalogos.findIndex(item => item.id === catalogo.id);
                this.catalogos[index].apagando = true;
                this.$axios.delete(`catalogo/${catalogo.id}`).then(response => {
                    this.$q.notify({
                        message: `Número de catálogos apagados: ${response}`,
                        icon: 'fa fa-trash',
                        color: 'primary'
                    });
                    this.catalogos.splice(index, 1);
                }).catch(() => {
                    this.catalogos[index].apagando = false;
                });
            }).catch(() => {
            });
        },
        criarCatalogo() {
            this.$q.dialog({
                title: 'Novo catálogo',
                message: 'Defina um nome para o catálogo.',
                prompt: {
                    model: '',
                    type: 'text',
                    label: 'Teste'
                },
                cancel: true,
                color: 'primary'
            }).then(data => {
                this.criando = true;
                this.$axios.post('catalogo', { nome: data }).then(response => {
                    this.$q.notify({
                        message: 'Catálogo criado com sucesso',
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });
                    this.criando = false;
                    response.created = moment(response.crated_at).format('DD/MM/YYYY');
                    response.apagando = false;
                    this.catalogos.unshift(response);
                }).catch(() => {
                    this.criando = false;
                });
            }).catch(() => {
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
