import { ObservationStatus } from '../observation-status';
import { ObservationMediaType } from '../observationMedia.entity';
declare class ObservationMediaInputDto {
    type: ObservationMediaType;
    url: string;
    isCorrective?: boolean;
}
export declare class CreateObservationDto {
    createdByUserId?: string;
    projectId: string;
    departmentId: string;
    categoryId: string;
    subcategoryId?: string;
    supervisorId: string;
    workerFullName: string;
    workerProfession: string;
    riskLevel: number;
    description: string;
    deadline: string;
    status?: ObservationStatus;
    media?: ObservationMediaInputDto[];
}
export {};
