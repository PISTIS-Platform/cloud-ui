<script setup lang="ts">
const sharesToPurchase = ref(0);
</script>

<template>
    <div class="justify-center items-center px-8 max-w-7xl mx-auto w-full">
        <PageContainer>
            <UCard class="w-full">
                <template #header>
                    <div class="flex items-center gap-4">
                        <UIcon name="streamline:investment-selection" class="w-10 h-10 text-gray-500" />
                        <SubHeading :title="$t('invest.title')" :info="$t('invest.info')" />
                    </div>
                </template>
                <div class="flex gap-6 flex-col w-full">
                    <UCard class="bg-gray-50 w-full">
                        <template #header>
                            <div class="flex items-center gap-3">
                                <UIcon name="tabler:list-details" class="h-6 w-6 text-gray-500" />
                                <span class="text-gray-500 font-semibold">{{ $t('invest.assetDetails') }}</span>
                            </div>
                        </template>
                        <div class="flex flex-col gap-4">
                            <div class="flex gap-1 flex-col">
                                <span class="text-sm font-semibold text-gray-400">{{ $t('invest.assetTitle') }}</span>
                                <span>Sample Dataset </span>
                            </div>
                            <div class="flex gap-1 flex-col">
                                <span class="text-sm font-semibold text-gray-400">{{
                                    $t('invest.assetDescription')
                                }}</span>
                                <span>This dataset is a sample for investing</span>
                            </div>
                            <div class="flex gap-1 flex-col">
                                <span class="text-sm font-semibold text-gray-400">{{
                                    $t('invest.assetDistribution')
                                }}</span>
                                <span>Distribution #239847</span>
                            </div>
                        </div>
                    </UCard>
                    <UCard class="bg-gray-50 w-full">
                        <template #header>
                            <div class="flex items-center gap-3">
                                <UIcon name="dashicons:money-alt" class="h-6 w-6 text-gray-500" />
                                <span class="text-gray-500 font-semibold">{{ $t('invest.investmentDetails') }}</span>
                            </div>
                        </template>
                        <div class="flex items-start gap-6">
                            <div class="flex flex-col gap-4 w-full">
                                <div class="flex gap-1 flex-col">
                                    <span class="text-sm font-semibold text-gray-400">{{
                                        $t('invest.validUntil')
                                    }}</span>
                                    <span><span class="font-bold text-lg">25 December 2027</span></span>
                                </div>
                                <div class="flex gap-1 flex-col">
                                    <span class="text-sm font-semibold text-gray-400">{{
                                        $t('invest.availableShares')
                                    }}</span>
                                    <span><span class="font-bold text-lg">800 / 1000</span> shares</span>
                                </div>
                                <div class="flex gap-1 flex-col">
                                    <span class="text-sm font-semibold text-gray-400">{{
                                        $t('invest.maxPerInvestor')
                                    }}</span>
                                    <span><span class="font-bold text-lg">100</span> shares</span>
                                </div>
                                <div class="flex gap-1 flex-col">
                                    <span class="text-sm font-semibold text-gray-400">{{
                                        $t('invest.sharePercentage')
                                    }}</span>
                                    <span><span class="font-bold text-lg">0.049%</span> per share</span>
                                </div>
                                <div class="flex gap-1 flex-col">
                                    <span class="text-sm font-semibold text-gray-400">{{
                                        $t('invest.sharePrice')
                                    }}</span>
                                    <span><span class="font-bold text-lg">20 EUR</span> per share</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-4 w-full">
                                <div class="flex gap-1 flex-col">
                                    <span class="text-sm font-semibold text-gray-400">{{
                                        $t('invest.termsAndConditions')
                                    }}</span>
                                    <p class="whitespace-pre-line">
                                        Duis dolore consequat adipisicing laboris nulla ullamco deserunt amet anim ut
                                        nostrud cupidatat velit occaecat. Labore aliqua ut in elit ut exercitation duis.
                                        Pariatur sint proident sit sunt est minim voluptate est. Nostrud exercitation
                                        eiusmod exercitation et ut ad nostrud culpa elit ut velit labore officia non do.
                                        Culpa tempor veniam dolor tempor. Qui dolor consequat quis ex laborum aute
                                        deserunt. Minim ea cupidatat magna enim aliquip elit nostrud. Amet deserunt
                                        cillum ea anim dolore eiusmod nulla incididunt ut non amet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
                <div class="mt-6">
                    <UForm class="flex items-end gap-6">
                        <UFormGroup
                            :label="$t('invest.numberOfSharesToPurchase')"
                            class="flex-1"
                            name="percentagePrice"
                            :ui="{ error: 'absolute -bottom-6' }"
                            required
                            eager-validation
                        >
                            <UInput
                                v-model.number="sharesToPurchase"
                                :placeholder="$t('data.investmentPlanner.sharePricePlaceholder')"
                                type="number"
                                size="xl"
                                min="0"
                            >
                                <template #trailing>
                                    <span class="text-gray-500 text-xs">shares</span>
                                </template>
                            </UInput>
                        </UFormGroup>
                        <span v-if="sharesToPurchase === 0" class="mb-2.5">Please select 1 share or more.</span>
                        <span v-else class="mb-2.5"
                            >You are purchasing
                            <span class="font-bold"
                                >{{ sharesToPurchase }} share{{ sharesToPurchase === 1 ? '' : 's' }}</span
                            >
                            at <span class="font-bold">20 EUR {{ sharesToPurchase === 1 ? '' : 'each' }}</span> for a
                            total of <span class="font-bold">{{ sharesToPurchase * 20 }} EUR</span>.</span
                        >
                        <UButton type="submit" size="xl" :disabled="sharesToPurchase === 0">Purchase</UButton>
                    </UForm>
                </div>
            </UCard>
        </PageContainer>
    </div>
</template>
