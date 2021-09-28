import { client } from './Client';
import { sqrt, cos, sin, complex, pi } from 'mathjs';
import * as math from 'mathjs';

const identity = [[1,0], [0,1]]
const hadamardGate = [[sqrt(1/2), sqrt(1/2)], [sqrt(1/2), -sqrt(1/2)]]
const tGate = [[1, 0], [0, complex(cos(pi/4), sin(pi/4))]]

function scalarProduct(a: math.Complex, b: any): any {
    const result = []
    if (!Array.isArray(b[0])) {
        for (const element of b) {
            result.push(math.multiply(a, element))
        }
    } else {
        for (const element of b) {
            result.push(scalarProduct(a, element))
        }
    }    
    return result
}

function kroneckerProduct(a: any, b: any): any {
    let result = []
    if (!Array.isArray(a) && typeof !Array.isArray(b)) {
        return math.multiply(a, b)
    } else if (!Array.isArray(a)) {
        return scalarProduct(a, b)
    } else if (!Array.isArray(b)) {
        return scalarProduct(b, a)
    } else {
        result = []
        for (const row of a) {
            const tmpMatrices = []
            for (const element of row) {
                tmpMatrices.push(scalarProduct(element, b))
            }
            for (const rowIndex of [...Array(b.length)].map((_, i) => (i))) {
                const tmpList = []
                for (const tmpMatrix of tmpMatrices) {
                    for (const element of tmpMatrix[rowIndex]) {
                        tmpList.push(element)
                    }
                }
                result.push(tmpList)
            }
        }
    }
    return result
}

export interface ListedTransformer {
    id: number
    name: string
}

export const TransformerType = {
    observable: 1,
    timeEvolve: 2,
} as const
export type TransformerType = typeof TransformerType[keyof typeof TransformerType]

export interface GotTransformer {
    id: number
    name: string
    type: TransformerType
    matrix: string[][]
}

export const getType = (transformer: GotTransformer) => {
    let transformerType = '';
    if (transformer.type == TransformerType.observable) {
        transformerType = 'Observable';
    } else if (transformer.type == TransformerType.timeEvolve) {
        transformerType = 'TimeEvolve';
    }
    return transformerType;
}

export const listTransformers = async () => {
    const response = await client.get('/transformer/');
    return response.data;
}

export const getTransformer = async (id: number) => {
    const response = await client.get(`/transformer/${id}`);
    return response.data;
}

export const postTransformer = async (
    type: TransformerType,
    matrix: string[][],
    name: string,
) => {
    const response = await client.post(`/transformer/`, {
        type: type,
        matrix: matrix,
        name: name,
    });
    return response.data;
}

export const deleteTransformer = async (
    id: number    
) => {
    const response = await client.delete(`/transformer/${id}`);
    return response.data;
}

export const postHadamardGate = async (
    targetQubit: number,
    domainQubitsCount: number,
    name: string,
) => {
    let tmpMatrix = 1;
    for (const index of [...Array(domainQubitsCount)].map((_, i) => (i))) {
        const nextMatrix = (index == targetQubit) ? Array.from(hadamardGate) : Array.from(identity)
        tmpMatrix = kroneckerProduct(tmpMatrix, nextMatrix)
    }
    const tmp = tmpMatrix as unknown
    const numberMatrix = tmp as math.Complex[][]
    const matrix = numberMatrix.map((elementList) => elementList.map((element) => element.toString()))
    postTransformer(TransformerType.timeEvolve, matrix, name)
}

export const postTGate = async (
    targetQubit: number,
    domainQubitsCount: number,
    name: string,
) => {
    let tmpMatrix = 1;
    for (const index of [...Array(domainQubitsCount)].map((_, i) => (i))) {
        const nextMatrix = (index == targetQubit) ? Array.from(tGate) : Array.from(identity)
        tmpMatrix = kroneckerProduct(tmpMatrix, nextMatrix)
    }
    const tmp = tmpMatrix as unknown
    const numberMatrix = tmp as math.Complex[][]
    const matrix = numberMatrix.map((elementList) => elementList.map((element) => element.toString()))
    postTransformer(TransformerType.timeEvolve, matrix, name)
}

export const postObservable = async (
    domainQubitsCount: number,
    name: string,
) => {
    const numberMatrix = []
    for (const rowIndex of [...Array(2**domainQubitsCount)].map((_, i) => (i))) {
        const row = [] 
        for (const colIndex of [...Array(2**domainQubitsCount)].map((_, i) => (i))) {
            if (rowIndex == colIndex) {
                row.push(rowIndex)
            } else {
                row.push(0)
            }
        }
        numberMatrix.push(row)
    }
    const matrix = numberMatrix.map((elementList) => elementList.map((element) => element.toString()))
    postTransformer(TransformerType.observable, matrix, name)
}
