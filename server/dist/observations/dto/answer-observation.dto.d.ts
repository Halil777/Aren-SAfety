import { ObservationMediaType } from '../observationMedia.entity';
declare class AnswerMediaDto {
    type: ObservationMediaType;
    url: string;
    isCorrective?: boolean;
}
export declare class AnswerObservationDto {
    answer?: string;
    media?: AnswerMediaDto[];
}
export {};
