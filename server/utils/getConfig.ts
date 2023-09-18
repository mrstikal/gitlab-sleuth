const getConfigs = () => {

    const perPage: number = Number(useRuntimeConfig().PAGE_LIMIT);
    const privateToken: string = useRuntimeConfig().PRIVATE_TOKEN;
    const baseUrl: string = useRuntimeConfig().BASE_URL;
    const sleepDelay: number = Number(useRuntimeConfig().SLEEP_DELAY);

    return [perPage, privateToken, baseUrl, sleepDelay]
}

export default getConfigs;