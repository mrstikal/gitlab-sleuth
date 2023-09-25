import { defineStore } from 'pinia';
import useToaster from '~/composables/helpers/useToaster';
import { ProjectType } from '~/types';

const route: string = '/api/projects';

const useProjectStore = defineStore('projects', {
    state: () => ({
        topGroupId: '0',
        projects: [] as ProjectType[],
        projectsFetchSuccess: true
    }),
    actions: {
        async getProjects () {
            if (this.topGroupId !== '0') {
                try {
                    const data: [] = await $fetch(route, {
                        method: 'POST',
                        'Cache-Control': 'no-cache',
                        body: {
                            group_id: this.topGroupId
                        }
                    });
                    this.projects = data;
                    this.projectsFetchSuccess = true;
                } catch (e: any) {
                    this.projectsFetchSuccess = false;
                    useToaster(`Route ${route} is unavailable`, 'error');
                }
            }
        }
    }
})

export default useProjectStore;
