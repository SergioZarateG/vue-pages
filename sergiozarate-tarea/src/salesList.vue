<template>
    <div>
      <hr>
      <h2>Detalles Ventas</h2>
      <p v-if="information" class="subtittle">{{information.length}} resultados</p>
      <b-container fluid>
        <b-card-group deck>
          <b-card bg-variant="light" header="Filtros" class="text-center">
            <b-row>
              <b-col lg="6" class="my-1">
                <b-form-group
                  label="Filtrar"
                  label-for="filter-input"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-input"
                      v-model="filter"
                      type="search"
                      placeholder="Escribe lo que deseas filtrar"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col lg="6" class="my-1">
                <b-form-group
                  label="Filtrar en"
                  description="Deje todo sin marcar para filtrar todos los datos"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                  v-slot="{ ariaDescribedby }"
                >
                  <b-form-checkbox-group
                    v-model="filterOn"
                    :aria-describedby="ariaDescribedby"
                    class="mt-1"
                  >
                    <b-form-checkbox value="waiter">Mesero</b-form-checkbox>
                    <b-form-checkbox value="cashier">Cajero</b-form-checkbox>
                    <b-form-checkbox value="zone">Zona</b-form-checkbox>
                  </b-form-checkbox-group>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
          <b-card bg-variant="light" header="Filtrar por fecha" class="text-center">
            <b-row>
              <b-col lg="6" class="my-1">
                <section id="search">
                  <div>
                    <label for="example-datepicker"><strong>Fecha inicio</strong></label>
                    <b-form-datepicker id="example-datepicker" v-model="initDate" class="mb-2"></b-form-datepicker>
                  </div>
                </section>
              </b-col>
              <b-col lg="6" class="my-1">
                <section id="search">
                    <div>
                        <label for="example-datepicker"><strong>Fecha termino</strong></label>
                        <b-form-datepicker id="example-datepicker" v-model="endDate" class="mb-2"></b-form-datepicker>
                    </div>
                </section>
              </b-col>
            </b-row>
          </b-card>
        </b-card-group>
        <b-table striped hover :items="updateInformation" :fields="fields" :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive="sm" :per-page="perPage"
        :current-page="currentPage" :filter="filter"
        :filter-included-fields="filterOn" @filtered="onFiltered">
          <template #cell(actions)="row">
            <b-button v-b-modal.modal-scrollable size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
              Ver productos
            </b-button>
          </template>
          <template #cell(pay)="row">
            <b-button v-b-modal.modal-scrollable size="sm" @click="info2(row.item, row.index, $event.target)" class="mr-1">
              Ver
            </b-button>
          </template>
        </b-table>
        <b-modal :id="infoModal.id" scrollable title="Productos" ok-only @hide="resetInfoModal">
          <b-table striped hover :items="products" :fields="fieldsProducts"></b-table>
        </b-modal>
        <b-modal :id="infoModal2.id" scrollable title="Forma de Pago" ok-only @hide="resetInfoModal2">
          <b-table striped hover :items="payments" :fields="fieldsPayments"></b-table>
        </b-modal>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
          class="page"
        ></b-pagination>
      </b-container>
    </div>
</template>

<script>
import data from './information.json';


export default {
    name: 'salesList',
    beforeMount () {
        this.getInformation();
    },
    data () {
        return {
          initDate: '2017-01-01',
          endDate: '2023-01-01',
          context: null,
          filter: null,
          perPage: 10,
          currentPage: 1,
          sortBy: '',
          sortDesc: false,
          texto: 'Este texto es de prueba',
          information: null,
          infoModal: {
            id: 'info-modal',
            title: '',
            content: ''
          },
          infoModal2: {
            id: 'info-modal2',
            title: '',
            content: ''
          },
          fields: [
            {key: "zone", label: "Zona", sortable: true}, 
            {key: "waiter", label: "Mesero", sortable: true}, 
            {key: "cashier", label: "Cajero", sortable: true}, 
            {key: "diners", label: "Comensales", sortable: true}, 
            {key: "table", label: "Mesa", sortable: true}, 
            {key: "total", label: "Total", sortable: true},
            {key: "date_opened", label: "Llegada comensales", sortable: true},
            {key: "date_closed", label: "Partida comensales", sortable: true},
            {key: 'actions', label: 'Productos vendidos' },
            {key: "pay", label: "Forma de Pago"}
            ],
          totalRows: 1,
          filterOn: [],
          products: null,
          fieldsProducts: [
            {key: "name", label: "Nombre"},
            {key: "category", label: "Categoria"},
            {key: "price", label: "Precio (CLP)"},
            {key: "quantity", label: "Cantidad"}
          ],
          payments: null,
          fieldsPayments: [
            {key: "amount", label: "Monto (CLP)"},
            {key: "type", label: "Tipo"}
          ]

        }
    },
    mounted() {
      // Set the initial number of items
      this.totalRows = this.information.length
    },
    methods: {
      info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.products = item.products;
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      info2(item, index, button) {
        this.infoModal2.title = `Row index: ${index}`
        this.payments = item.payments;
        this.infoModal2.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal2.id, button)
      },
      resetInfoModal2() {
        this.infoModal2.title = ''
        this.infoModal2.content = ''
      },
      getInformation() {
          this.information = data.data;
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      onContext(ctx) {
        this.context = ctx
      }
    },
    computed: {
      rows() {
        return this.information.length
      },
      updateInformation() {
        const { initDate, endDate } = this;
        const newInformation = this.information.filter((info) => {
          if(initDate<info.date_opened && endDate>info.date_closed) {
            return info;
          }
        });
        return newInformation;
      }
    }
}
</script>

<style>
  .page {
    justify-content: center;
  }
  .subtittle {
    color: grey;
  }
</style>