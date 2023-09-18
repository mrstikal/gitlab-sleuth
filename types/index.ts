export type ConfigType = [
    perPage: number,
    privateToken: string,
    baseUrl: string,
    sleepDelay: number
]

export type GroupType = {
    id: number,
    name: string
}

export type ProjectType = {
    id: number,
    name: string
}

export type MemberType = {
    [key: number]: {
        name: string,
        nickname: string,
        groups?: string[],
        projects?: string[]
    }
}

export type MemberArrayType = {
    name?: string,
    nickname?: string,
    groups?: string[],
    projects?: string[]
}