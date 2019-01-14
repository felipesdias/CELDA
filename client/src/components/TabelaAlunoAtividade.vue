<template>
  <div class="full-width">
    <q-card v-for="tipoAtividade in value.tiposAtividades" :key="tipoAtividade.id" 
            class="q-mb-md full-width">
      <q-collapsible group="haha" class="full-width"
                     @show="tipoAtividadeSelecionada = tipoAtividade">
        <template slot="header">
          <q-item-main :label="tipoAtividade.nome" />
        </template>

        <pre> {{ tipoAtividade.descricao }} </pre>
        
        <q-table
          class="full-width q-my-md no-shadow"
          title="Atividades"
          :data="getAtividades(tipoAtividade)"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
        >
          <!-- <div slot="top-left" slot-scope="props">
            
          </div> -->
          <div slot="top-right" slot-scope="props">
            <q-btn  
              size="xs"
              round color="secondary"
              icon="fa fa-plus"
              @click="abrirModalCriar(tipoAtividade)"/>
          </div>
          <q-tr slot="body" slot-scope="props" 
                :props="props" class="linha-tabela"
                :class="[(props.row.confirmado ? 'confirmado' : '')]"
          >
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="nome" :props="props">
              <a v-if="props.row.comprovante" :href="props.row.comprovante.url" 
                 target="popup"
                 @click="abrirPopUp(props.row.comprovante.url)">
                {{ props.row.nome }}
              </a>
              <a v-else>
                {{ props.row.nome }}
              </a>
            </q-td>
            <q-td key="carga_sugerida" :props="props">{{ props.row.carga_sugerida }}</q-td>
            <q-td key="carga_planejada" :props="props">{{ props.row.carga_planejada }}</q-td>
            <q-td key="carga_confirmada" :props="props">{{ props.row.carga_confirmada }}</q-td>
            <q-td key="created_at" :props="props">{{ props.row.created_at | formatDate('DATE') }}</q-td>
            <q-td key="acoes" :props="props">
              <q-btn v-if="$can('adm,aux')"
                     size="xs" class="q-mr-sm"
                     round
                     :icon="props.row.confirmado ? 'fa fa-lock-open' : 'fa fa-lock'"
                     :color="props.row.confirmado ? 'negative' : 'positive'"
                     @click="confirmarAtividade(props.row)"/>
              <q-btn v-show="!props.row.confirmado"
                     size="xs" class="q-mr-sm"
                     round color="primary"
                     icon="fa fa-edit"
                     :disable="!!props.row.confirmado"
                     @click="editarTipoAtividade(props.row)"/>
              <q-btn v-show="!props.row.confirmado"
                     size="xs" 
                     round color="negative"
                     icon="fa fa-trash"
                     :disable="!!props.row.confirmado"
                     @click="abrirModalApagar(props.row)"/>
            </q-td>
          </q-tr>
        </q-table>
      </q-collapsible>
    </q-card>

    <q-modal v-model="apagar.modal" minimized>
      <q-card >
        <q-card-title class="q-pr-lg">
          Apagar Atividade
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          Todos os dados relacionados a esta atividade serão perdidos. Deseja realmente apagar ?
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="apagar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Apagar" @click="apagarAtividade" 
            color="primary" 
            :loading="apagar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="criar.modal" minimized>
      <q-card :style="{ minWidth: '500px' }">
        <q-card-title class="q-pr-lg">
          {{ criar.criar ? 'Criar' : 'Editar' }} Atividade
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
                     @keyup.enter="criarAtividade"/>
          </q-field>

          <q-field v-if="$can('aluno')"
                   :error="$v.item.carga_sugerida.$error"
                   :error-label="$utils.errorMsg('Horas Sujeridas', $v.item.carga_sugerida)">
            <q-input v-model="item.carga_sugerida" 
                     type="number"
                     float-label="Horas Sujeridas" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.carga_sugerida.$touch"
                     @keyup.enter="criarAtividade"/>
          </q-field>

          <q-field v-if="$can('adm')"
                   :error="$v.item.carga_planejada.$error"
                   :error-label="$utils.errorMsg('Horas Planejadas', $v.item.carga_planejada)">
            <q-input v-model="item.carga_planejada" 
                     type="number"
                     float-label="Horas Planejadas" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.item.carga_planejada.$touch"
                     @keyup.enter="criarAtividade"/>
          </q-field>

          <q-uploader v-if="!item.comprovante"
                      ref="uploader" @add="$refs.uploader.upload()"
                      url=""
                      float-label="Adicionar comprovante" auto-expand 
                      :upload-factory="uploadFile" hide-upload-button
                      :multiple="false" no-thumbnails />
          <div v-else class="column">
            <q-btn label="Alterar comprovante" 
                   icon="fa fa-redo" class="q-mb-md"
                   @click="limpaComprovante"
                   color="tertiary" flat/>
            <div class="row text-center justify-center">
              <a :href="item.comprovante.url" target="popup"
                 @click="abrirPopUp(item.comprovante.url)">
                Comprovante
              </a>
            </div>
          </div>

        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="criar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            :label="criar.criar ? 'Criar' : 'Salvar'" @click="criarAtividade" 
            color="primary" 
            :loading="criar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>

    <q-modal v-model="confirmar.modal" minimized>
      <q-card>
        <q-card-title class="q-pr-lg">
          Confirmar Horas
        </q-card-title>
        <q-card-separator />
        <q-card-main class="gutter-sm">
          <q-field :error="$v.confirmar.horas.$error"
                   :error-label="$utils.errorMsg('Horas Confirmadas', $v.confirmar.horas)">
            <q-input v-model="confirmar.horas" 
                     type="number"
                     float-label="Horas Confirmadas" 
                     hide-underline
                     class="celda-input"
                     @blur="$v.confirmar.horas.$touch"
                     @keyup.enter="confirmarAtividade(null)"/>
          </q-field>
        </q-card-main>
        <q-card-separator />
        <q-card-actions class="row justify-end q-px-md">
          <q-btn 
            label="Cancelar" @click="confirmar.modal = false" 
            class="btn-cancelar"
          />
          <q-btn 
            label="Confirmar" @click="confirmarAtividade(null)" 
            color="primary" 
            :loading="confirmar.loader" />
        </q-card-actions>
      </q-card>
    </q-modal>
  </div>
</template>

<script>
import { required, maxValue, url } from 'vuelidate/lib/validators';
import { cloneDeep } from 'lodash';

export default {
    name: 'TabelaAlunoAtividade',
    props: {
        value: {
            required: true,
            type: Object
        },
    },
    data() {
        return {
            confirmar: {
                horas: null,
                modal: false,
                loader: false,
                item: null
            },
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
                carga_sugerida: null,
                carga_planejada: null,
                carga_confirmada: null,
                comprovante: null,
                confirmado: false,
                catalogo_id: this.value.catalogo_id,
                tipos_atividade_id: null
            },
            uploading: false,
            tipoAtividadeSelecionada: {},
            pagination: {
                sortBy: '',
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
                    name: 'nome',
                    required: true,
                    label: 'Nome',
                    align: 'left',
                    field: 'nome',
                    sortable: true
                },
                {
                    name: 'carga_sugerida',
                    required: true,
                    label: 'H.S.',
                    align: 'left',
                    field: 'carga_sugerida',
                    sortable: true
                },
                {
                    name: 'carga_planejada',
                    required: true,
                    label: 'H.P.',
                    align: 'left',
                    field: 'carga_planejada',
                    sortable: true
                },
                {
                    name: 'carga_confirmada',
                    required: true,
                    label: 'H.C.',
                    align: 'left',
                    field: 'carga_confirmada',
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
    validations() {
        return {
            item: {
                nome: {
                    required
                },
                carga_sugerida: {
                    maxValue: maxValue(this.tipoAtividadeSelecionada.max_carga_horaria_atividade || 99999)
                },
                carga_planejada: {
                    maxValue:  maxValue(this.tipoAtividadeSelecionada.max_carga_horaria_atividade || 99999)
                }
            },
            confirmar: {
                horas: {
                    required,
                    maxValue: maxValue(this.tipoAtividadeSelecionada.max_carga_horaria_atividade || 99999)
                }
            }
        }
    },
    methods: {
        confirmarAtividade(atividade) {
            if(atividade == null) {
                atividade = this.confirmar.item;
                this.$axios.put(`atividade/${atividade.id}/confirma`, { horas: this.confirmar.horas }).then(response => {
                    this.confirmar.modal = false;
                    const index = this.value.atividades.findIndex(item => item.id === response.id);
                    this.value.atividades.splice(index, 1, response);
                }).catch(() => {

                });
            } else if(atividade.confirmado) {
                if (this.$v.item.$error) {
                    this.$q.notify('Verifique os campos novamente!');
                    return;
                }
                this.$axios.put(`atividade/${atividade.id}/desconfirma`).then(response => {
                    const index = this.value.atividades.findIndex(item => item.id === response.id);
                    this.value.atividades.splice(index, 1, response);
                }).catch(() => {

                });
            } else {
                this.confirmar.item = atividade;
                this.$v.$reset();
                this.confirmar.horas = null;
                this.confirmar.loading = false;
                this.confirmar.modal = true;
            }
        },
        limpaComprovante() {
            this.item.comprovante = null
        },
        uploadFile (file, updateProgress) {
            const formData = new FormData();
            formData.append('file', file);
            this.uploading = true;

            this.$axios.post(`file/${this.value.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'text/plain;'
                },
                responseType: 'text',
                onUploadProgress: progressEvent => {
                    updateProgress(progressEvent.loaded/progressEvent.total)
                }
            }).then(response => {
                this.item.comprovante = response;
                this.uploading = false;
                return new Promise((resolve, reject) => {
                    resolve(file)
                });
            }).catch(() => {
                this.uploading = false;
                return new Promise((resolve, reject) => {
                    reject(file)
                });
            });
        },
        editarTipoAtividade(row) {
            this.$v.$reset();
            this.item = cloneDeep(row);
            this.criar.modal = true;
            this.criar.criar = false;
        },
        abrirModalCriar(tipoAtividade) {
            this.$v.$reset();

            this.item.nome = '';
            this.item.carga_sugerida = null;
            this.item.carga_planejada = null;
            this.item.carga_confirmada = null;
            this.item.comprovante = null;
            this.item.confirmado = false;
            this.item.catalogo_id = tipoAtividade.catalogo_id;
            this.item.tipos_atividade_id = tipoAtividade.id;
            this.item.user_id = parseInt(this.$route.params.alunoId, 10);

            this.criar.modal = true;
            this.criar.criar = true;
        },
        abrirPopUp(link) {
            window.open(link,'popup','width=800,height=800');
            return false;
        },
        getAtividades(tipoAtividade) {
            return this.value.atividades.filter(item => item.tipos_atividade_id === tipoAtividade.id);
        },
        abrirModalApagar(atividade) {
            this.apagar.item = atividade;
            this.apagar.modal = true;
        },
        apagarAtividade() {
            this.apagar.loader = true;
            const index = this.value.atividades.findIndex(item => item.id === this.apagar.item.id);
            this.$axios.delete(`atividade/${this.apagar.item.id}`).then(response => {
                this.$q.notify({
                    message: `Número de atividades apagadas: ${response}`,
                    icon: 'fa fa-trash',
                    color: 'primary'
                });
                this.value.atividades.splice(index, 1);
                this.apagar.loader = false;
                this.apagar.modal = false;
            }).catch(() => {
                this.apagar.loader = false;
            });
        },
        criarAtividade() {
            this.$v.item.$touch();

            if (this.$v.item.$error) {
                this.$q.notify('Verifique os campos novamente!');
                return;
            }

            if (this.uploading) {
                this.$q.notify({
                    message: 'Aguarde o upload do comprovante terminar!',
                    type: 'info'
                });
                return;
            }

            this.criar.loader = true;

            if(this.criar.criar) {
                this.$axios.post('atividade', this.item).then(response => {
                    this.$q.notify({
                        message: 'Atividade criado com sucesso',
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });

                    this.criar.loader = false;
                    this.criar.modal = false;
                
                    this.value.atividades.unshift(response);
                }).catch(() => {
                    this.criar.loader = false;
                });
            } else {
                this.$axios.put(`atividade/${this.item.id}`, this.item).then(response => {
                    this.$q.notify({
                        message: ` Número de atividades editadas: ${response}`,
                        icon: 'fa fa-thumbs-up',
                        color: 'primary'
                    });

                    this.criar.loader = false;
                    this.criar.modal = false;
                
                    const index = this.value.atividades.findIndex(item => item.id === this.item.id);
                    const novo = {
                        ...cloneDeep(this.value.atividades[index]),
                        ...this.item
                    };

                    this.value.atividades.splice(index, 1, novo);
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

.crop-text-table {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 1px;
}

.confirmado {
    background: #e9ffe9;
}
</style>
