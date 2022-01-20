<template>
    <div>
        <hr>
        <h3>Información importante para la toma de decisiones</h3>
        <b-container fluid>
          <b-card-group deck>
            <b-card bg-variant="light" header="Ventas realizadas por cada mesero" class="text-center">
              <b-table striped hover :items="Object.values(dicWaiter)" :fields="fieldsWaiter"></b-table>
            </b-card>
            <b-card bg-variant="light" header="Gráfico de ventas por mesero" class="text-center">
                <pie-chart :data="chartData" :options="chartOptions"></pie-chart>
            </b-card>
            <b-card bg-variant="light" header="Pagos recibidos por cada cajero" class="text-center">
              <b-table striped hover :items="Object.values(dicCashier)" :fields="fieldsCashier"></b-table>
            </b-card>
            <b-card bg-variant="light" header="Gráfico de pagos recibidos por cajero" class="text-center">
                <pie-chart :data="chartDataCashier" :options="chartOptions"></pie-chart>
            </b-card>
          </b-card-group>
        </b-container>
        <br>
        <b-container fluid>
            <b-card-group deck>
                <b-card bg-variant="light" header="Pagos recibidos por cada cajero" class="text-center">
                <b-table striped hover :items="Object.values(dicPayments)" :fields="fieldsPayments"></b-table>
                </b-card>
                <b-card bg-variant="light" header="Gráfico de num de pagos recibidos por medio de pago" class="text-center">
                <pie-chart :data="chartDataPaymentsOne" :options="chartOptions"></pie-chart>
                </b-card>
                <b-card bg-variant="light" header="Gráfico de monto recibido por medio de pago" class="text-center">
                    <pie-chart :data="chartDataPaymentsTwo" :options="chartOptions"></pie-chart>
                </b-card>
            </b-card-group>
        </b-container>
        <br>
    </div>
</template>

<script>
import information from './information.json'
import PieChart from "./PieChart.js";
export default {
    name: "otherStatistics",
    components: {
        PieChart,
    },
    beforeMount() {
        this.getInformation();
    },
    data () {
        return {
            dicWaiter: null,
            dicCashier: null,
            dicPayments: null,
            fieldsWaiter: [
                {key: "waiter", label: "Mesero"},
                {key: "num", label: "Ventas realizadas"}
            ],
            fieldsCashier: [
                {key: "cashier", label: "Cajero"},
                {key: "num", label: "Pagos recibidos"}
            ],
            fieldsPayments: [
                {key: "type", label: "Medio de Pago"},
                {key: "amount", label: "Monto recibido"},
                {key: "num", label: "Num de pagos recibidos"}
            ],
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
            chartDataCashier: {
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
            chartDataPaymentsOne: {
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
            chartDataPaymentsTwo: {
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
        }
    },
    methods: {
        getInformation() {
            const dicWaiter = {};
            const dicCashier = {};
            const dicPayments = {};
            information.data.forEach(element => {
                if(dicWaiter[element.waiter]) {
                    dicWaiter[element.waiter].num++;
                } else {
                    dicWaiter[element.waiter] = { "waiter": element.waiter, "num": 1};
                }
                if(dicCashier[element.cashier]) {
                    dicCashier[element.cashier].num++;
                } else {
                    dicCashier[element.cashier] = { "cashier": element.cashier, "num": 1};

                }
                element.payments.forEach( elem => {
                    if (dicPayments[elem.type]) {
                        dicPayments[elem.type].amount += elem.amount;
                        dicPayments[elem.type].num ++;
                    } else {
                        dicPayments[elem.type] = { "type": elem.type, "amount": elem.amount, "num": 1 };
                    }
                })
            });
            const nums = [];
            const numsCashier = [];
            const numsPay = [];
            const amountPay = [];

            Object.values(dicWaiter).forEach(value => {
                nums.push(value.num);
            });
            Object.values(dicCashier).forEach(value => {
                numsCashier.push(value.num);
            });
            Object.values(dicPayments).forEach(value => {
                numsPay.push(value.num);
                amountPay.push(value.amount);
            });
            this.chartDataPaymentsOne.datasets[0].data = numsPay;
            this.chartDataPaymentsTwo.datasets[0].data = amountPay;
            this.chartDataPaymentsOne.labels = Object.keys(dicPayments);
            this.chartDataPaymentsTwo.labels = Object.keys(dicPayments);
            this.chartDataCashier.datasets[0].data = numsCashier;
            this.chartDataCashier.labels = Object.keys(dicCashier);
            this.chartData.datasets[0].data = nums;
            this.chartData.labels = Object.keys(dicWaiter);
            this.dicPayments = dicPayments;
            this.dicWaiter = dicWaiter;
            this.dicCashier = dicCashier
        }
    }
}
</script>