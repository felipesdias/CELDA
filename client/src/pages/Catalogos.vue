<template>
  <q-page padding class="column">
    <div class="row justify-center gutter-md self-center" style="max-width: 1000px">
      <q-table
        title="Table Title"
        :data="tableData"
        :columns="columns"
        row-key="name"
      />
    </div>
  </q-page>
</template>

<script>
export default {
    name: 'Catalogos',
    data() {
        return {
            catalogos: [],
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
                }
            ]
        }
    },
    created() {
        this.$axios.get('catalogo').then(response => {
            this.catalogos = response;
        })
    }
}
</script>

<style>
</style>
