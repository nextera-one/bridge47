import { ColumnSchema } from '../database/schema.reader';
import GeneratorHelper from '../utils/generator.helper';

export function generateVue(tableName: string, columns: ColumnSchema[]): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  const columnDefs = columns.map(col => ({
    name: col.name,
    label: GeneratorHelper.capitalize(col.name.replace(/_/g, ' ')),
    field: col.name,
    align: 'left',
    sortable: true,
  }));

  return `
<template>
  <q-page padding>
    <h5>${className} Management</h5>
    <q-table
      title="${className}s"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      @request="onRequest"
    >
      </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableProps } from 'quasar';
import type { ${className}Model } from '../model/${className}.model';
import ${className}Func from '../${className}.func';

const rows = ref<${className}Model[]>([]);
const func = ${className}Func.getInstance();
const loading = ref(false);

const pagination = ref({
  sortBy: 'updated_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns: QTableProps['columns'] = ${JSON.stringify(columnDefs, null, 2)};

async function onRequest(props: { pagination: typeof pagination.value }) {
  loading.value = true;
  try {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    pagination.value = props.pagination;

    const result = await func.executeGet({
      pagination: {
        page: page,
        rowsPerPage: rowsPerPage,
        sortBy: sortBy,
        descending: descending,
      },
      // Add filters if needed
    });

    rows.value = result.data;
    pagination.value.rowsNumber = result.count;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Add user feedback (e.g., toast notification)
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  onRequest({ pagination: pagination.value });
});
</script>
`;
}