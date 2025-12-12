import { Observation } from './observation.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
export declare enum ObservationMediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}
export declare class ObservationMedia {
    id: string;
    observationId: string;
    observation: Observation;
    type: ObservationMediaType;
    url: string;
    uploadedByUserId: string;
    uploadedBy: MobileAccount;
    isCorrective: boolean;
    createdAt: Date;
}
