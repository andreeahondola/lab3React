import {action, getLogger, errorPayload} from '../core/utils';
import {search, save} from './resource';

const log = getLogger('dog/service');

// Loading dogs
const LOAD_DOGS_STARTED = 'dog/loadStarted';
const LOAD_DOGS_SUCCEEDED = 'dog/loadSucceeded';
const LOAD_DOGS_FAILED = 'dog/loadFailed';
const CANCEL_LOAD_DOGS = 'dog/cancelLoad';

// Saving dogs
const SAVE_DOG_STARTED = 'dog/saveStarted';
const SAVE_DOG_SUCCEEDED = 'dog/saveSucceeded';
const SAVE_DOG_FAILED = 'dog/saveFailed';
const CANCEL_SAVE_DOG = 'dog/cancelSave';

// Dog notifications
const DOG_DELETED = 'dog/deleted';

export const loadDogs = () => async(dispatch, getState) => {
    log(`loadDogs...`);
    const state = getState();
    const dogState = state.dog;
    try {
        dispatch(action(LOAD_DOGS_STARTED));
        const dogs = await search(state.auth.server, state.auth.token)
        log(`loadDogs succeeded`);
        if (!dogState.isLoadingCancelled) {
            dispatch(action(LOAD_DOGS_SUCCEEDED, dogs));
        }
    } catch(err) {
        log(`loadDogs failed`);
        if (!dogState.isLoadingCancelled) {
            dispatch(action(LOAD_DOGS_FAILED, errorPayload(err)));
        }
    }
};

export const cancelLoadDogs = () => action(CANCEL_LOAD_DOGS);

export const saveDog = (dog) => async(dispatch, getState) => {
    log(`saveDog...`);
    const state = getState();
    const dogState = state.dog;
    try {
        dispatch(action(SAVE_DOG_STARTED));
        const savedDog = await save(state.auth.server, state.auth.token, dog)
        log(`saveDog succeeded`);
        if (!dogState.isSavingCancelled) {
            dispatch(action(SAVE_DOG_SUCCEEDED, savedDog));
        }
    } catch(err) {
        log(`saveDog failed`);
        if (!dogState.isSavingCancelled) {
            dispatch(action(SAVE_DOG_FAILED, errorPayload(err)));
        }
    }
};

export const cancelSaveDog = () => action(CANCEL_SAVE_DOG);

export const dogCreated = (createdDog) => action(SAVE_DOG_SUCCEEDED, createdDog);
export const dogUpdated = (updatedDog) => action(SAVE_DOG_SUCCEEDED, updatedDog);
export const dogDeleted = (deletedDog) => action(DOG_DELETED, deletedDog);

export const dogReducer = (state = {items: [], isLoading: false, isSaving: false}, action) => { //newState (new object)
    let items, index;
    switch (action.type) {
        // Loading
        case LOAD_DOGS_STARTED:
            return {...state, isLoading: true, isLoadingCancelled: false, issue: null};
        case LOAD_DOGS_SUCCEEDED:
            return {...state, items: action.payload, isLoading: false};
        case LOAD_DOGS_FAILED:
            return {...state, issue: action.payload.issue, isLoading: false};
        case CANCEL_LOAD_DOGS:
            return {...state, isLoading: false, isLoadingCancelled: true};
        // Saving
        case SAVE_DOG_STARTED:
            return {...state, isSaving: true, isSavingCancelled: false, issue: null};
        case SAVE_DOG_SUCCEEDED:
            items = [...state.items];
            index = items.findIndex((i) => i._id == action.payload._id);
            if (index != -1) {
                items.splice(index, 1, action.payload);
            } else {
                items.push(action.payload);
            }
            return {...state, items, isSaving: false};
        case SAVE_DOG_FAILED:
            return {...state, issue: action.payload.issue, isSaving: false};
        case CANCEL_SAVE_DOG:
            return {...state, isSaving: false, isSavingCancelled: true};
        // Notifications
        case DOG_DELETED:
            items = [...state.items];
            const deletedDog = action.payload;
            index = state.items.findIndex((dog) => dog._id == deletedDog._id);
            if (index != -1) {
                items.splice(index, 1);
                return {...state, items};
            }
            return state;
        default:
            return state;
    }
};