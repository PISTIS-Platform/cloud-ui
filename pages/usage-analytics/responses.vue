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

import type { Questionnaire, QuestionResponse } from '~/interfaces/usage-analytics';

const { t } = useI18n();

// const colorPalette = ['c9684a', '2a8e8c', 'bf9a22', '285336', '432046'];
const colorPalette = ['70d6ff', 'ff70a6', 'ff9770', 'ffd670', 'e9ff70'];
const colorPaletteRadio = ['5bb86e', 'E9FF70', '989898', 'FF9770', 'fc3232'].reverse();

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
    interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x',
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    let label = context.dataset.label || '';
                    console.log({ context });

                    if (label) {
                        label += ': ';
                    }
                    label += context.formattedValue + ' responses';
                    return label;
                },
            },
        },
    },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const { data: _datasetData, status: datasetStatus } = useFetch(`/api/datasets/get-specific`, {
    method: 'GET',
    query: {
        id: assetId.value,
    },
});

const {
    data: questionnaire,
    status: questionnaireStatus,
    error: questionnaireError,
} = await useAsyncData<Questionnaire>(`fetchQuestionnaire-asset-${assetId.value}`, () =>
    $fetch(`/api/questionnaire/${assetId.value}`),
);

const { data, status, error } = useFetch<QuestionResponse[]>(`/api/questionnaire/get-answers`, {
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
            <UProgress
                v-if="datasetStatus === 'pending' || status === 'pending' || questionnaireStatus === 'pending'"
                animation="carousel"
                color="primary"
            />
            <ErrorCard
                v-else-if="error || questionnaireError || !data || data.length === 0"
                :error-msg="error?.statusMessage ?? t('usage-analytics.responsesNotFound')"
            />
            <div v-else class="w-full flex flex-col gap-4 text-gray-600">
                <SubHeading
                    :title="`${questionnaire?.title} : ${$t('usage-analytics.responsesFor')} ${assetId}` || ''"
                    :info="questionnaire?.description || ''"
                />
                <UCard v-for="answer in computedChartData" :key="answer" :ui="{ base: 'w-full' }">
                    <template #header>
                        <span class="font-semibold text-lg"
                            >{{ $t('usage-analytics.question') }}: {{ answer.label }}</span
                        >
                    </template>
                    <div class="flex items-start flex-wrap gap-8 md:flex-nowrap">
                        <!-- All time-->
                        <div class="w-full xl:w-[calc(50%-1rem)] max-h-[500px]">
                            <span class="flex justify-center w-full mb-4">{{
                                $t('usage-analytics.overallResponses')
                            }}</span>
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
                                        maintainAspectRatio: true,
                                        plugins: {
                                            ...chartOptions.plugins,
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
                            <span class="flex justify-center w-full mb-4">{{ $t('usage-analytics.timeline') }}</span>
                            <Line class="w-full" :data="answer.timeLine" :options="chartOptions" />
                        </div>
                    </div>
                </UCard>
            </div>
        </PageContainer>
    </div>
</template>
