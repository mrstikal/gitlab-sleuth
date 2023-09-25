import { defineStore } from 'pinia';
import useToaster from '~/composables/helpers/useToaster';
import { GroupType } from '~/types';

const route: string = '/api/groups';

const useGroupsStore = defineStore('groups', {
    state: () => ({
        topGroupId: '0',
        groups: [] as GroupType[],
        groupsFetchSuccess: true
    }),
    actions: {
        async getGroupsDescendants () {
            if (this.topGroupId !== '0') {
                try {
                    const data: [] = await $fetch(route, {
                        method: 'POST',
                        body: {
                            group_id: this.topGroupId
                        }
                    });
                    this.groups = data;
                    this.groupsFetchSuccess = true;
                } catch (e: any) {
                    this.groupsFetchSuccess = false;
                    useToaster(`Route ${route} is unavailable`, 'error');
                }
            }
        }
    }
})

export default useGroupsStore;
