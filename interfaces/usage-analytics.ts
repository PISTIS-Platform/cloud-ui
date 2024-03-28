export enum QuestionType {
    TEXT = 'Text',
    CHECKBOX = 'Checkbox',
    RADIO = 'Radio Button',
}

export interface QuestionOption {
    id?: string;
    text?: string;
    description?: string;
}

export interface Question {
    id?: string;
    type: QuestionType | string;
    title: string;
    description?: string;
    options?: QuestionOption[];
    isOptional?: boolean;
    isRequired?: boolean;
    isValid?: boolean;
}

export interface Questionnaire {
    id: string;
    version: number | string | null;
    title: string;
    description?: string;
    creatorId?: string;
    isForVerifiedBuyers?: boolean;
    isActive: boolean;
    publicationDate?: string | null;
    questions: Question[];
}
