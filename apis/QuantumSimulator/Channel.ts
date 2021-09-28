import { client } from './Client';

export interface ListedChannel {
    id: number;
    name: string;
}

export interface GotChannel {
    id: number;
    name: string;
    qubit_count: number;
    register_count: number;
    init_transformer_ids: number[];
    state_ids: number[];
    transformer_ids: number[];
    outcome: number | null
}

export const listChannels = async () => {
    const response = await client.get('/channel/');
    return response.data;
}

export const getChannel = async (id: number) => {
    const response = await client.get(`/channel/${id}`);
    return response.data;
}

export const postChannel = async (
    qubitCount: number,
    registersCount: number,
    initTransformerIds: number[][],
    name: string,
) => {
    const response = await client.post(`/channel/`, {
        qubit_count: qubitCount,
        register_count: registersCount,
        init_transformer_ids: initTransformerIds,
        name: name,
    });
    return response.data;
}


export const deleteChannel = async (
    id: number    
) => {
    const response = await client.delete(`/channel/${id}`);
    return response.data;
}

export const initializeChannel = async (id: number) => {
    const response = await client.put(`/channel/${id}/initialize`);
    return response.data;
}

export const transformChannel = async (id: number, transformerId: number, registerIndex?: number) => {
    const response = await client.put(`/channel/${id}/transform`.concat(`?transformer_id=${transformerId}`).concat(registerIndex == null ? "" : `&register_index=${registerIndex}`));
    return response.data;
}

export const finalizeChannel = async (id: number, targetQubits: number[]) => {
    const response = await client.put(`/channel/${id}/finalize`, targetQubits);
    return response.data;
}
