import { $fetch } from 'ofetch';
import getConfigs from '~/server/utils/getConfig';
import { ConfigType } from '~/types';
import { ProjectType } from '~/types';

export default defineEventHandler(async (event) => {

    const [perPage, privateToken, baseUrl, sleepDelay] = <ConfigType>getConfigs();

    const { group_id } = await readBody(event);

    let projectsFinished = false;
    let pageOffset = 0;

    const projects: ProjectType[] = [];

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const fetchProjects = async () => {

        while (!projectsFinished) {
            let data: any = await $fetch(`${baseUrl}groups/${group_id}/projects?include_subgroups=true&page=${pageOffset}&per_page=${perPage}`, {
                headers: { 'PRIVATE-TOKEN': privateToken }
            });
            if (data.length > 0) {
                pageOffset += perPage;
                data.forEach((project: any) => {
                    projects.push({
                        id: project.id,
                        name: project.path_with_namespace
                    });
                })
                sleep(sleepDelay)
            } else {
                projectsFinished = true;
            }
        }
    };

    await fetchProjects();
    return projects;
})
