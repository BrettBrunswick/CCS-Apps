import { SubContractor } from 'src/app/models/SubContractor';

export class SubContractorList {
    id: number;
    Name: string;
    description: string;
    createdByUser: string;
    SubContractors: SubContractor[]
}