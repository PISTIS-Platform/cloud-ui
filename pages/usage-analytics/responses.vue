<script setup lang="ts">
import dayjs from 'dayjs';
import * as R from 'ramda';

import type { QuestionResponse } from '~/interfaces/usage-analytics';

const route = useRoute();
const assetId = computed(() => route.query.assetId);

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

              const datasetsForTimeline = Object.keys(datasetsByLabel).map((label: string) => {
                  return {
                      label,
                      data: datasetsByLabel[label],
                  };
              });

              return {
                  allTime: {
                      chartType,
                      label,
                      labels,
                      datasets: [
                          {
                              label: 'Overall Data',
                              data: allTimeData,
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
            <div>ID: {{ assetId }}</div>
            <pre>{{ filteredData }}</pre>
            <pre>{{ computedChartData }}</pre>
        </PageContainer>
    </div>
</template>
