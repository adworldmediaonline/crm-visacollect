export interface VisaApplication {
    _id: string;
    emailAddress: string;
    lastExitUrl: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentId?: string;
    paymentDate: string;
    paymentAmount?: number;
    applicationStatus: string;
    noOfVisa: number;
    additionalApplicants: AdditionalApplicant[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    visaDetails: VisaDetails;
    arrivalInfo: ArrivalInfo;
    personalInfo: PersonalInfo;
    passportInfo: PassportInfo;
    documents?: Documents;
    declaration?: Declaration;
    govRefDetails?: GovRefDetails;
    isComplete: boolean;
    id: string;
}

export interface AdditionalApplicant {
    govRefDetails: GovRefDetails;
    _id: string;
    id: string;
    personalInfo: PersonalInfo;
    passportInfo: PassportInfo;
    documents?: Documents;
}

export interface PersonalInfo {
    _id: string;
    formId: string;
    givenName: string;
    surname: string;
    citizenship: string;
    gender: string;
    maritalStatus?: string;
    countryOfBirth: string;
    dateOfBirth: string;
    placeOfBirth: string;
    email: string;
    phoneNumber: string;
    occupation: string;
    streetAddress: string;
    addressCity: string;
    addressCountry: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: string;
}

export interface PassportInfo {
    _id: string;
    formId: string;
    passportNumber: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: string;
}

export interface VisaDetails {
    _id: string;
    formId: string;
    visaType: string;
    visaValidity: string;
    visaFee: number;
    reasonForTravel?: string;
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Attachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
}

export interface ArrivalInfo {
    _id: string;
    formId: string;
    arrivalDate: string;
    // Arrival
    arrivingBy: "By Air" | "By Sea" | "By Land";
    // By Air
    arrivalAirline?: string;
    arrivalFlightNumber?: string;
    arrivalAirPort?: string;
    originCountry?: string;
    // By Sea
    arrivalVesselName?: string;
    arrivalSeaPort?: string;
    // By Land
    landBorderCrossing?: string;
    // Departure
    departureBy: "By Air" | "By Sea" | "By Land";
    // By Air
    departureAirline?: string;
    departureFlightNumber?: string;
    departureAirPort?: string;
    destinationCountry?: string;
    // By Sea
    departureVesselName?: string;
    departureSeaPort?: string;
    // By Land
    departureLandBorderCrossing?: string;
    // Accommodation
    accommodationName: string;
    accommodationFromDate: string;
    accommodationToDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Declaration {
    _id: string;
    formId: string;
    tripFinanced: boolean;
    convictedOfOffence: boolean;
    deniedEntryToKenya: boolean;
    previousTravelToKenya: boolean;
    monetaryInstrument: boolean;
    monetaryInstrumentName: string;
    monetaryInstrumentCurrency: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface GovRefDetails {
    _id?: string;
    applicationId: string;
    govRefEmail: string;
    govRefNumber: string;
    comment: string;
    applicantType: 'primary' | 'additional';
    additionalApplicantIndex: number | null;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface Documents {
    documents: {
        passport: Document;
        photo: Document;
        applicationLetter: Document;
        supportLetter: Document;
        invitationLetter: Document;
        invitingCompanyInfo: Document;
        registrationLicense: Document;
        businessLicense: Document;
        tinCertificate: Document;
        foreignInvestorEmployeeVisa: Document;
        acceptanceLetter: Document;
        bankStatement: Document;
        companyProfile: Document;
    };
    _id: string;
    visaApplicationId: string;
    applicantType: string;
    additionalApplicantIndex: number | null;
    isComplete: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: string;
}

export interface Document {
    secure_url?: string;
    public_id?: string;
    fileName?: string;
    uploadedAt: string;
}
