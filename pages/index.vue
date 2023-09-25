<script lang="ts" setup>

const members = ref<any>([]);
const loading = ref(false);
const inputRef = ref();

const loadData = async (value: any) => {

    if (value) {

        const groupsStore = useGroupsStore();
        groupsStore.topGroupId = value;

        await useAsyncData(() => groupsStore.getGroupsDescendants());
        if (groupsStore.groupsFetchSuccess) {
            useToaster('All groups loaded successfully', 'info');
        } else {
            groupsStore.groups = [];
        }

        const projectStore = useProjectStore();
        projectStore.topGroupId = value;

        await useAsyncData(() => projectStore.getProjects());
        if (projectStore.projectsFetchSuccess) {
            useToaster('All projects loaded successfully', 'info');
        } else {
            projectStore.projects = [];
        }

        if (groupsStore.groups.length && projectStore.projects.length) {

            const memberStore = useMembersStore();
            memberStore.$patch({
                groups: groupsStore.groups,
                projects: projectStore.projects
            })

            await useAsyncData(() => memberStore.getMembers());
            if (memberStore.membersFetchSuccess && Object.keys(memberStore.members).length) {
                useToaster('All members processed successfully', 'info');
            }
            members.value = transformMembers(memberStore.members);

        }

        loading.value = false;

    }

}

const changeValue = async () => {
    members.value = [];

    if (inputRef.value.value != '') {
        loading.value = true;
        await loadData(inputRef.value.value);
    }
}

</script>

<template>
    <div>
        <div class="input_wrapper">
            <input ref="inputRef" type="text" placeholder="Enter top level group ID" />
            <div class="change">
                <span v-if="loading" class="loading_data">Loading data...</span>
                <span v-else class="ready_to_load" @click="changeValue">Click to load data</span>
            </div>
        </div>
        <div v-if="members.length" class="members_wrapper">
            <div v-for="(member, index) in members" :key="index" class="grid_row">
                <div class="member_name">
                    {{ member.name }} (&#64;{{ member.nickname }})
                </div>
                <div class="member_grid">
                    <div class="grid_element">
                        <span class="label">Groups:</span>
                        <span class="row">[
                            <span v-for="(group, i) in member.groups" :key="i">
                                <span class="val">{{ group }}
                                    <span v-if="i !== member.groups.length - 1" class="divider">&#9642;</span>
                                </span>
                            </span>
                            ]</span>
                    </div>
                    <div class="grid_element">
                        <span class="label">Projects:</span>
                        <span class="row">[
                            <span v-for="(project, i) in member.projects" :key="i">
                                <span class="val">{{ project }}
                                    <span v-if="index !== member.projects.length - 1" class="divider">&#9642;</span>
                                </span>
                            </span>
                            ]</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
