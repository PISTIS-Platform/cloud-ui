import { getToken } from '#auth';

const { intentionAnalyticsServerUrl } = useRuntimeConfig();

interface Questionnaire {
    id: string;
    version: string;
    title: string;
    description?: string;
    creatorId?: string;
    isForVerifiedBuyers?: boolean;
    isActive: boolean;
    publicationDate?: string | null;
}
export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    const results = await $fetch<Questionnaire[]>(`${intentionAnalyticsServerUrl}/questionnaire`, {
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
        },
    });

    return results.map((item: Questionnaire) => ({
        ...item,
        publicationDate: item.publicationDate || '',
        version: item.version ? parseInt(item.version) : '',
    }));
});
