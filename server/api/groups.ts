import { $fetch } from 'ofetch';
import getConfigs from '~/server/utils/getConfig';
import { ConfigType } from '~/types';
import { GroupType } from '~/types';

export default defineEventHandler(async (event) => {

    const [perPage, privateToken, baseUrl, sleepDelay] = <ConfigType>getConfigs();

    const { group_id } = await readBody(event);

    let groupsFinished = false;
    let pageOffset: number = 0;

    const groups: GroupType[] = [];

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const fetchFirstGroup = async () => {

        const group: any = await $fetch(`${baseUrl}groups/${group_id}`, {
            headers: { 'PRIVATE-TOKEN': privateToken,  'Cache-Control': "max-age=0, must-revalidate, public"}
        });
        
        groups.push({
            id: group.id,
            name: group.full_path
        });
    }

    const fetchDescentantGroups = async () => {

        while (!groupsFinished) {

            const data: any = await $fetch(`${baseUrl}groups/${group_id}/descendant_groups?page=${pageOffset}&per_page=${perPage}`, {
                headers: { 'PRIVATE-TOKEN': privateToken }
            });

            if (data.length > 0) {
                pageOffset += perPage;
                data.forEach((group: any) => {
                    groups.push({
                        id: group.id,
                        name: group.full_path
                    });
                })
                sleep(sleepDelay)
            } else {
                groupsFinished = true;
            }
        }
    };

    await Promise.all([fetchFirstGroup(), fetchDescentantGroups()])
    return groups;
})
