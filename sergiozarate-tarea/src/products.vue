<template>
  <div>
    <hr>
    <div class="form-group" v-if="salesProducts">
      <div class="mt-3">
        <b-container fluid>
          <b-card-group deck>
            <b-card bg-variant="light" header="Filtros" class="text-center">
              <b-form-select v-model="category" :options="dicCategories" size="sm" class="mt-3"></b-form-select>
              <b-form-select v-model="sortProduct" :options="sortOptions" size="sm" class="mt-3"></b-form-select>
            </b-card>
            <b-card bg-variant="light" header="Información importante" class="text-center">
              <b-card-text><strong>Cantidad total vendida:</strong> {{details.sumProducts}}</b-card-text>
              <b-card-text>
                <strong>Total vendido (CLP):</strong> {{details.sumTotalPrices}}
              </b-card-text>
            </b-card>
            <b-card bg-variant="light" header="Gráfico" class="text-center">
              <b-container>
                <b-form-select v-if="showNewGraph" v-model="parameterOne" :options="setOne" size="sm" class="mt-3"></b-form-select>
                <b-form-select v-if="showNewGraph" v-model="parameterTwo" :options="setTwo" size="sm" class="mt-3"></b-form-select>
              </b-container>
              <br>
              <router-link v-show="showNewGraph" :to="{name: 'graphProducts', params: {data: getChartData, options: chartOptions}}"><b-button @click="showNewGraph = false">generar gŕafico</b-button></router-link>
              <router-link v-show="!showNewGraph" to="/productsSales" ><b-button @click="showNewGraph = true"> ¿Ver un nuevo gráfico con otros parámetros?</b-button></router-link>
              <router-view></router-view>
            </b-card>
          </b-card-group>
        </b-container>
      </div>
    </div>
    <div  v-if="salesProducts">
      <h3>Tabla de productos vendidos</h3>
      <b-container fluid>
        <b-table striped hover :items="filterCategories" :fields="fields"></b-table>
      </b-container>
    </div>
    <span v-else>Cargando...</span>

  </div>
</template>

<script>
import GraphProducts from './graphProducts.vue';
import info from './information.json';
import PieChart from "./PieChart.js";

function sortAsc (categories, attr) {
  return categories.sort(function(a,b) {
    if (a[attr] > b[attr]) {
      return 1;
    }
    if (a[attr] < b[attr]) {
      return -1;
    }
    return 0;
  });
}

function sortDesc (categories, attr) {
  return categories.sort(function(a,b) {
    if (a[attr] < b[attr]) {
      return 1;
    }
    if (a[attr] > b[attr]) {
      return -1;
    }
    return 0;
  });
}

export default {
  name: 'productsSales',
  components: {
    PieChart,
    GraphProducts
  },
  mounted () {
    this.getSalesProducts();
  },
  data () {
    return {
      beforeBoton: '',
      boton: '',
      showNewGraph: true,
      salesProducts: null,
      categories: null,
      dicCategories: null,
      nameProducts: null,
      category: '',
      parameterOne: 'name',
      parameterTwo: 'unitPrice',
      sortProduct: '',
      details: {
        sumProducts: 0,
        sumTotalPrices: 0,
      },
      chartOptions: {
        hoverBorderWidth: 20
      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: null,
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#33FFE6", "#336EFF", "#FFFC33", "#008000", "#808000", "#FF00FF", "#800000", "#000080"],
            data: null
          }
        ]
      },
      fields: [
        {key: "name", label: "Nombre Producto"},
        {key: "category", label: "Categoría"},
        {key: "unitPrice", label: "Precio unitario (CLP)"},
        {key: "totalSales", label: "Cantidad vendida"},
        {key: "totalPrices", label: "Total ganado (CLP)"},

      ],
      sortOptions: [
        {value: "", text: "Ordenar por"},
        {value: "Menor precio", text: "Menor precio"},
        {value: "Mayor precio", text: "Mayor precio"},
        {value: "A-Z (nombre)", text: "A-Z (nombre)"},
        {value: "Z-A (nombre)", text: "Z-A (nombre)"},
        {value: "Más vendidos", text: "Más vendidos"},
        {value: "Mayor ganancia", text: "Mayor ganancia"}
      ],
      setOne: [
        {value: "name", text: "Nombre"},
        {value: "category", text: "Categoria"},
      ],
      setTwo: [
        {value: "unitPrice", text: "Precio unitario"},
        {value: "totalSales", text: "Cantidad vendida"},
        {value: "totalPrices", text: "Total ganado"}
      ]
      
    }
  },
  methods: {
    getSalesProducts() {
      const dicProducts = {};
      const setCategories = new Set();
      const dicCat = [{value: '', "text": "Elige una categoría"}];
      const names = [];
      info.data.forEach( elem => {
        elem.products.forEach( product => {
          if (dicProducts[product.name]) {
          dicProducts[product.name].totalSales += product.quantity;
          dicProducts[product.name].totalPrices += product.price;
        } else {
          dicProducts[product.name] = {
            "name": product.name,
            "category": product.category, 
            "totalSales": product.quantity, 
            "totalPrices": product.price,
            "unitPrice": product.price
          }
        }
        setCategories.add(product.category);
        });
      });
      setCategories.forEach(elem => {
        dicCat.push({"value": elem, "text": elem});
      });
      this.categories = setCategories;
      this.dicCategories = dicCat;
      console.log(dicCat);
      this.salesProducts = dicProducts;
    },
    getGraph(parameterOne, parameterTwo) {
      const listParameterOne = [];
      const listParameterTwo = [];
      
      if (parameterOne === "category") {
        Object.values(this.salesProducts).forEach(value => {
          const index = listParameterOne.indexOf(value.category);
          if (index === -1) {
            listParameterOne.push(value.category);
            listParameterTwo.push(value[parameterTwo]);
          } else {
            listParameterTwo[index] += value[parameterTwo];
          }
        });
      } else {
        Object.values(this.salesProducts).forEach(value => {
          listParameterOne.push(value.name);
          listParameterTwo.push(value[parameterTwo]);
        });
      }
      this.chartData.labels = listParameterOne;
      this.chartData.datasets[0].data = listParameterTwo;
    }
  },
  computed: {
    filterCategories() {
      const { sortProduct } = this;
      this.details.sumProducts = 0;
      this.details.sumTotalPrices = 0;
      const cat = Object.values(this.salesProducts).filter(value => {
        if (value.category.includes(this.category)) {
          this.details.sumProducts += value.totalSales;
          this.details.sumTotalPrices += value.totalPrices;
          return value;
        };
      });
      let finalCategories = cat;
      if (sortProduct === "Menor precio") {
        finalCategories = sortAsc(cat, "unitPrice");
      } else if ( sortProduct === "Mayor precio") {
        finalCategories = sortDesc(cat, "unitPrice");
      } else if ( sortProduct === "A-Z (nombre)") {
        finalCategories = sortAsc(cat, "name");
      } else if ( sortProduct === "Z-A (nombre)") {
        finalCategories = sortDesc(cat, "name");
      } else if ( sortProduct === "Más vendidos") {
        finalCategories = sortDesc(cat, "totalSales");
      } else if ( sortProduct === "Mayor ganancia") {
        finalCategories = sortDesc(cat, "totalPrices");
      }
      return finalCategories;
    },
    getChartData () {
      const { parameterOne, parameterTwo } = this;
      this.getGraph(parameterOne, parameterTwo);
      return this.chartData;
    }
  },
}
</script>