import { defaultApiEndpoint } from '../constants'

export const get = async (endpoint: string, body?: any): Promise<any> => {
    return await fetch(`${defaultApiEndpoint}/${endpoint}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
}

export const post = async (endpoint: string, body: any): Promise<any> => {
    return await fetch(`${defaultApiEndpoint}/${endpoint}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
}

export const put = async (endpoint: string, body: any): Promise<any> => {
    return await fetch(`${defaultApiEndpoint}/${endpoint}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
}
