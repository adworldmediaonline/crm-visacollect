export interface EthiopiaVisaApplication {
    _id: string;
    emailAddress: string;
    lastExitUrl: string;
    paymentStatus: "pending" | "completed" | "failed";
    applicationStatus: "submitted" | "processing" | "approved" | "rejected";
    noOfVisa: number;
    additionalApplicants: AdditionalApplicant[];
    createdAt: string;
    updatedAt: string;
    visaDetails: VisaDetails;
    arrivalInfo: ArrivalInfo;
    personalInfo: PersonalInfo;
    passportInfo: PassportInfo;
    documents: string;
    isComplete: boolean;
    id: string;
}

export interface AdditionalApplicant {
    personalInfo: PersonalInfo;
    passportInfo: PassportInfo;
    _id: string;
    id: string;
}

export interface VisaDetails {
    _id: string;
    formId: string;
    visaType: string;
    visaValidity: string;
    companyReferenceNumber: string;
    visaFee: number;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ArrivalInfo {
    _id: string;
    formId: string;
    arrivalDate: string;
    departureCountry: string;
    departureCity: string;
    airline: string;
    flightNumber: string;
    accommodationType: string;
    accommodationName: string;
    accommodationCity: string;
    accommodationStreetAddress: string;
    accommodationTelephone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PersonalInfo {
    _id: string;
    formId: string;
    givenName: string;
    surname: string;
    citizenship: string;
    gender: string;
    countryOfBirth: string;
    dateOfBirth: string;
    placeOfBirth: string;
    email: string;
    phoneNumber: string;
    occupation: string;
    streetAddress: string;
    addressCity: string;
    addressCountry: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: string;
}

export interface PassportInfo {
    _id: string;
    formId: string;
    passportType: string;
    passportNumber: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    passportIssuingCountry: string;
    passportIssuingAuthority: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: string;
}

export interface Attachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
}