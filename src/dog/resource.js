import {getLogger, ResourceError} from '../core/utils';
import {authHeaders} from '../core/api';

const log = getLogger('dog/resource');

export const search = async(server, token) => {
    const url = `${server.url}/api/dog`;
    log(`GET ${url}`);
    let ok;
    let json = await fetch(url, {method: 'GET', headers: authHeaders(token)})
        .then(res => {
            ok = res.ok;
            return res.json();
        })
    return interpretResult('GET', url, ok, json);
}

export const save = async(server, token, dog) => {
    const body = JSON.stringify(dog);
    const url = dog._id ? `${server.url}/api/dog/${dog._id}` : `${server.url}/api/dog`;
    const method = dog._id ? 'PUT' : 'POST';
    log(`${method} ${url}`);
    let ok;
    return fetch(url, {method, headers: authHeaders(token), body})
        .then(res => {
            ok = res.ok;
            return res.json();
        })
    return interpretResult(method, url, ok, json);
};

function interpretResult(method, url, ok, json) {
    if (ok) {
        log(`${method} ${url} succeeded`);
        return json;
    } else {
        log(`${method} ${url} failed`);
        throw new ResourceError('Fetch failed', json.issue);
    }
}