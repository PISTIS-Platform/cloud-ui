export const useHttpHelper = () => {
    const isSuccessResponse = (statusNum: number) => {
        return statusNum >= 200 && statusNum < 400;
    };

    return {
        isSuccessResponse,
    };
};
