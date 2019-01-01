import { Contact } from 'src/app/models/Contact';
import { Trade } from 'src/app/models/Trade';

export class SubContractor {
    Id: number;
    Name: string;
    TradeId: number;
    TradeName: string;
    AddressLine1: string;
    AddressLine2: string;
    State: string;
    City: string;
    ZipCode: string;
    WebsiteURL: string;
    PrimaryPhone: string;
    PrimaryFax: string;
    PrimaryEmail: string;
    Contacts: Contact[];
    Trade: Trade;
}