import {MemberType} from '~/types/';
import {MemberArrayType} from '~/types/'

const transformMembers = ((groups: any) => {

    const transformedGroups: MemberArrayType[] = [];

    Object.values(groups).forEach((value: any) => {

        if (!value.groups) {
            value.groups = [];
        }

        if (!value.projects) {
            value.projects = [];
        }

        transformedGroups.push(value);
    });

    return transformedGroups;
})

export default transformMembers;