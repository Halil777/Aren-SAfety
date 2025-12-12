import { ObservationMediaType } from '../observationMedia.entity';
export declare class CreateObservationMediaDto {
    type: ObservationMediaType;
    url: string;
    uploadedByUserId: string;
    isCorrective: boolean;
}
