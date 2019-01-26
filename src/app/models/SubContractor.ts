import { Contact } from 'src/app/models/Contact';
import { Trade } from 'src/app/models/Trade';
import { SubContractorSubContractorList } from 'src/app/models/SubContractorSubContractorList';

export class SubContractor {
    id: number;
    Name: string;
    AddressLine1: string;
    AddressLine2: string;
    State: string;
    City: string;
    ZipCode: string;
    WebsiteURL: string;
    OfficePhone: string;
    OfficeFax: string;
    OfficeEmail: string;
    Contacts: Contact[];
    Trade: Trade;
    Source: string;
    subContractorSubContractorLists: SubContractorSubContractorList[];
}