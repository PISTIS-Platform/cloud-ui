import type { ModelType } from './model-type.enum';

export default interface ModelsTableRow {
    id?: string;
    title: string;
    description: string;
    type: ModelType;
    filepath?: string;
    version: string;
    size?: number;
    date?: string;
    data?: any; //binary data , can be anything
}
