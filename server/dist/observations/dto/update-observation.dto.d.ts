import { CreateObservationDto } from './create-observation.dto';
import { ObservationStatus } from '../observation-status';
declare const UpdateObservationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateObservationDto>>;
export declare class UpdateObservationDto extends UpdateObservationDto_base {
    status?: ObservationStatus;
    supervisorSeenAt?: string;
    fixedAt?: string;
    closedAt?: string;
    description?: string;
}
export {};
