<script setup lang="ts">
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import * as R from 'ramda';
import { Bar, Line, Pie } from 'vue-chartjs';

import type { QuestionResponse } from '~/interfaces/usage-analytics';

const colorPalette = ['c9684a', '2a8e8c', 'bf9a22', '285336', '432046'];
const colorPaletteRadio = ['5bb86e', 'dfbd67', '989898', 'f57c25', 'fc3232'].reverse();

const route = useRoute();
const assetId = computed(() => route.query.assetId);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            ticks: {
                precision: 0,
            },
        },
    },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const { data } = useFetch<QuestionResponse[]>(`/api/questionnaire/get-answers`, {
    query: {
        assetId: assetId.value,
    },
});

const filteredData = computed(() =>
    data.value ? data.value?.filter((response: QuestionResponse) => response.questionType !== 'Text') : [],
);

const computedChartData = computed(() =>
    filteredData.value
        ? filteredData.value.map((response: QuestionResponse) => {
              const labels = response.options;
              const label = response.questionTitle;
              const allTimeData: number[] = [];
              const chartType = response.questionType === 'Checkbox' ? 'bar' : 'pie';

              //All time data
              labels?.forEach((label: string) => {
                  allTimeData.push(
                      response.responses.reduce((acc: number, curr: { response: string; date: string }) => {
                          if (curr.response === label) {
                              acc += 1;
                          }
                          return acc;
                      }, 0),
                  );
              });

              //Timeline data
              const groupByDate = R.groupBy((response: { response: string; date: string }) => {
                  const day = dayjs(response.date).format('DD/MM/YY');
                  return day;
              });
              const groupedByDate = groupByDate(response.responses);

              const dates = Object.keys(groupedByDate);
              const datasetsByLabel: Record<string, number[]> = {};

              labels?.forEach((label: string) => {
                  const datasetData: number[] = [];
                  dates.forEach((date: string) => {
                      const responses = groupedByDate[date] as { response: string; date: string }[];
                      console.log({ responses });
                      datasetData.push(
                          responses.reduce((acc: number, curr: { response: string; date: string }) => {
                              console.log(`${curr.response}, ${label}`);
                              if (curr.response === label) {
                                  acc += 1;
                              }
                              return acc;
                          }, 0),
                      );
                  });
                  datasetsByLabel[label] = datasetData;
              });

              const datasetsForTimeline = Object.keys(datasetsByLabel).map((lineLabel: string, index: number) => {
                  const color =
                      chartType === 'bar'
                          ? `#${colorPalette[index % colorPalette.length]}`
                          : `#${colorPaletteRadio[index % colorPalette.length]}`;
                  return {
                      label: lineLabel,
                      data: datasetsByLabel[lineLabel],
                      backgroundColor: color,
                      borderColor: color,
                  };
              });

              return {
                  label,
                  allTime: {
                      chartType,
                      label,
                      labels,
                      datasets: [
                          {
                              data: allTimeData,
                              backgroundColor: allTimeData.map((_, index) =>
                                  chartType === 'bar'
                                      ? `#${colorPalette[index % colorPalette.length]}`
                                      : `#${colorPaletteRadio[index % colorPalette.length]}`,
                              ),
                              borderColor: allTimeData.map((_, index) =>
                                  chartType === 'bar'
                                      ? `#${colorPalette[index % colorPalette.length]}`
                                      : `#${colorPaletteRadio[index % colorPalette.length]}`,
                              ),
                          },
                      ],
                  },
                  timeLine: {
                      chartType: 'line',
                      label,
                      labels: dates,
                      datasets: datasetsForTimeline,
                  },
              };
          })
        : [],
);
</script>

<template>
    <div class="items-center justify-center w-full px-8 mx-auto max-w-7xl">
        <PageContainer>
            <div class="w-full flex flex-col gap-4 text-gray-600">
                <span class="font-bold text-xl">
                    Questionnaire Responses for asset <span class="font-mono">{{ assetId }}</span></span
                >
                <UCard v-for="answer in computedChartData" :key="answer" :ui="{ base: 'w-full' }">
                    <template #header>
                        <span class="font-semibold text-lg">Question: {{ answer.label }}</span>
                    </template>
                    <div class="flex items-start flex-wrap gap-8 xl:flex-nowrap">
                        <!-- All time-->
                        <div class="w-full xl:w-[calc(50%-1rem)] max-h-[500px]">
                            <span class="flex justify-center w-full mb-4">Overall Responses</span>
                            <div v-if="answer.allTime.chartType === 'pie'">
                                <Pie
                                    :data="answer.allTime"
                                    :options="{
                                        ...chartOptions,
                                        scales: { x: { display: false }, y: { display: false } },
                                    }"
                                />
                            </div>
                            <div v-else>
                                <Bar
                                    class="w-full h-full"
                                    :data="answer.allTime"
                                    :options="{
                                        ...chartOptions,
                                        plugins: {
                                            title: {
                                                display: false,
                                            },
                                            legend: {
                                                display: false,
                                            },
                                        },
                                    }"
                                />
                            </div>
                        </div>
                        <!-- Timeline-->
                        <div class="w-full xl:w-[calc(50%-1rem)] max-h-[300px]">
                            <span class="flex justify-center w-full mb-4">Timeline</span>
                            <Line class="w-full" :data="answer.timeLine" :options="chartOptions" />
                        </div>
                    </div>
                </UCard>
            </div>
        </PageContainer>
    </div>
</template>
