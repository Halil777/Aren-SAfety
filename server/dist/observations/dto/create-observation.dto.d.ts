import { ObservationStatus } from '../observation-status';
export declare class CreateObservationDto {
    createdByUserId: string;
    projectId: string;
    departmentId: string;
    categoryId: string;
    subcategoryId: string;
    supervisorId: string;
    workerFullName: string;
    workerProfession: string;
    riskLevel: number;
    description: string;
    deadline: string;
    status?: ObservationStatus;
}
