import { $fetch } from 'ofetch';
import getConfigs from '~/server/utils/getConfig';
import { ConfigType, MemberType } from '~/types';

const members: MemberType = {};

export default defineEventHandler(async (event) => {

    const [perPage, privateToken, baseUrl, sleepDelay] = <ConfigType>getConfigs();

    const { groups_param, projects_param } = await readBody(event);

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const convertMemberLevel = (level: number) => {
        switch (level) {
            case 0: return 'No access';
            case 5: return 'Minimal access';
            case 10: return 'Guest';
            case 20: return 'Reporter';
            case 30: return 'Developer';
            case 40: return 'Maintainer';
            case 50: return 'Owner';
            default: return 'Unknown level';
        }
    }

    const membersFromGroup = async () => {

        if (Object.keys(groups_param).length) {

            for (const group of groups_param) {

                let finished = false;
                let offset: number = 0;

                while (!finished) {

                    const data: any = await $fetch(`${baseUrl}groups/${group.id}/members?page=${offset}&per_page=${perPage}`, {
                        headers: { 'PRIVATE-TOKEN': privateToken }
                    });

                    if (data.length > 0) {
                        offset += perPage;
                        for (const member of data) {
                            if (!members[member.id]) {
                                members[member.id] = {
                                    name: member.name,
                                    nickname: member.username
                                }
                            }

                            const fullName = `${group.name} (${convertMemberLevel(member.access_level)})`;

                            if (!members[member.id].groups) {
                                members[member.id].groups = [fullName]
                            } else {
                                members[member.id].groups?.push(fullName)
                            }

                            members[member.id].groups = [...new Set(members[member.id].groups)]
                        }

                        sleep(sleepDelay)
                    } else {
                        finished = true;
                    }
                }
            }
        }
    }

    const membersFromProjects = async () => {

        if (Object.keys(projects_param).length) {

            for (const project of projects_param) {

                let finished = false;
                let offset: number = 0;

                while (!finished) {

                    const data: any = await $fetch(`${baseUrl}projects/${project.id}/members?page=${offset}&per_page=${perPage}`, {
                        headers: { 'PRIVATE-TOKEN': privateToken }
                    });

                    if (data.length > 0) {
                        offset += perPage;

                        for (const member of data) {

                            if (!members[member.id]) {
                                members[member.id] = {
                                    name: member.name,
                                    nickname: member.username
                                }
                            }

                            const fullName = `${project.name} (${convertMemberLevel(member.access_level)})`

                            if (!members[member.id].projects) {
                                members[member.id].projects = [fullName]
                            } else {
                                members[member.id].projects?.push(fullName)
                            }

                            members[member.id].projects = [...new Set(members[member.id].projects)]
                        }

                        sleep(sleepDelay)
                    } else {
                        finished = true;
                    }
                }
            }
        }
    }

    await membersFromGroup();
    await membersFromProjects();

    return members;

})
