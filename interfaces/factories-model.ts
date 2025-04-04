export default interface FactoryModelRepo {
    id: string | number;
    organizationName: string;
    organizationId: string;
    factoryPrefix?: string;
    ip: string;
    country: string;
    status: string;
    isActive: boolean;
    isAccepted: boolean;
}
