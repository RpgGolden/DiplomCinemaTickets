import { mapObjectKeys } from '../utils/map.js';

const roles = {
    CLIENT: 1,
    ADMINISTRATOR: 2,
};

export default roles;

export const map = mapObjectKeys(roles);
