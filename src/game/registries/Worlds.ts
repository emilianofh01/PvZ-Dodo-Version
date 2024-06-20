import { Registry } from '$/core/registry';
import { notNullOrUndefined } from 'src/utils/Objects';
import { ENVIRONMENTS_REGISTRY, EnvironmentEntry } from './Environment';
import { LEVELS_REGISTRY, Level } from './Levels';

export interface World {
    name: String
    environment: EnvironmentEntry
    levels: Level[]
}

const WORLDS_REGISTRY = new Registry<World>();
export default WORLDS_REGISTRY;

WORLDS_REGISTRY.add('dodo:day', {
    name: 'Day',
    environment: notNullOrUndefined(ENVIRONMENTS_REGISTRY.get('dodo:sunny')),
    levels: [
        notNullOrUndefined(LEVELS_REGISTRY.get('dodo:level_1-1')),
        notNullOrUndefined(LEVELS_REGISTRY.get('dodo:level_1-2')),
        notNullOrUndefined(LEVELS_REGISTRY.get('dodo:level_1-3')),
    ],
});
