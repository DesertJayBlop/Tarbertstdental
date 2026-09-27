import {defineCliConfig} from 'sanity/cli';
import config from './data/sanity-config.json' with {type:'json'};
export default defineCliConfig({api:{projectId:config.projectId,dataset:config.dataset},project:{basePath:'/studio'}});
