import { defineStore } from "pinia";
import useToaster from "~/composables/helpers/useToaster";
import { MemberType } from '~/types';
import { ProjectType } from '~/types';
import { GroupType } from '~/types';

const route: string = '/api/members';

const useMembersStore = defineStore("members", {
    state: () => ({
        groups: [] as GroupType[],
        projects: [] as ProjectType[],
        members: [] as MemberType[],
        membersFetchSuccess: true
    }),
    actions: {
        async getMembers() {
            try {
                if (this.groups.length && this.projects.length) {
                    const data: [] = await $fetch(route, {
                        method: 'POST',
                        body: {
                            groups_param: this.groups,
                            projects_param: this.projects,
                        }
                    });
                    if (Object.keys(data).length) {
                        this.members = data;
                        this.membersFetchSuccess = true;
                    }
                }
            } catch (e: any) {
                this.membersFetchSuccess = false;
                useToaster(`Route ${route} is unavailable`, 'error');
            }
        }
    }
})

export default useMembersStore;