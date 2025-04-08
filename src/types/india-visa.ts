export interface IndianVisaApplication {
  _id: string;
  emailId: string;
  applicationType: string;
  nationalityRegion: string;
  passportType: string;
  portOfArrival: string;
  dateOfBirth: string;
  contactNo: string;
  visaService: string;
  expectedDateOfArrival: string;
  lastExitStepUrl: string;
  visaStatus: string;
  paid: boolean;
  price: number;
  termsAndConditions: boolean;
  termsAndConditionsContent?: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentId?: string;
  paymentAmount?: number;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  step2?: IndianVisaPersonalDetails;
  step3?: IndianVisaAddressDetails;
  step4?: Record<string, string>;
  step5?: Record<string, string | boolean>;
  step6?: IndianVisaDocuments;
  step8?: { termsAndConditions: string; termsAndConditionsAgree: boolean };
  id?: string;
}

// You can expand these with more specific types as needed
export interface IndianVisaPersonalDetails {
  formId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  townCityOfBirth: string;
  countryRegionOfBirth: string;
  citizenshipNationalID: string;
  religion: string;
  visibleIdentificationMarks?: string;
  educationalQualification?: string;
  nationalityRegion: string;
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  countryOfIssue: string;
}

export interface IndianVisaAddressDetails {
  formId: string;
  houseNoStreet: string;
  villageTownCity: string;
  country: string;
  stateProvinceDistrict: string;
  postalZipCode: string;
  phoneNo: string;
  mobileNo: string;
  emailAddress: string;
  fatherFullName?: string;
  fatherNationality?: string;
  motherFullName?: string;
  motherNationality?: string;
  applicantMaritalStatus?: string;
  spouseFullName?: string;
  spouseNationality?: string;
}

export interface IndianVisaDocuments {
  formId: string;
  profilePicture?: string;
  passport: string[];
  businessCard?: string[];
  eMedicalCard?: string[];
}
