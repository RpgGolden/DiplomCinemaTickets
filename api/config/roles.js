import { mapObjectKeys } from '../utils/map.js';

const roles = {
    CLIENT: 1,
    ADMINISTRATOR: 2,
    SUPERADMIN: 3,
};

export default roles;

export const map = mapObjectKeys(roles);
