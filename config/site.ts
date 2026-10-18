export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  socials: {
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  demoDisclaimer: string;
}

export const siteConfig: SiteConfig = {
  name: "ZustDevServices",
  shortName: "ZustClinic",
  tagline: "Custom Clinic Management Systems Tailored For Healthcare Practitioners",
  description:
    "Explore our interactive doctor dashboard and clinic management suite demo. Experience how a custom-engineered solution can organize your appointments, patient EHR records, digital prescriptions, and billing seamlessly.",
  contactEmail: "zustdevservices@gmail.com",
  // Editable placeholders — do not render broken or fabricated profile links
  socials: {
    linkedin: "https://www.linkedin.com/in/zustdev-services-4b17783b2",
    instagram: "https://www.instagram.com/zustdevservices",
    youtube: "https://www.youtube.com/@zustdevservices",
  },
  demoDisclaimer:
    "This application is an interactive product demonstration created by ZustDevServices for clinical workflow evaluation. All records are fictional and stored solely in your local browser session (localStorage). No data is transmitted to or stored on any external server or medical database.",
};

export function getCustomEnquiryMailtoUrl(subject?: string, body?: string): string {
  const defaultSubject = encodeURIComponent("Custom Clinic Management System Inquiry - ZustDevServices");
  const defaultBody = encodeURIComponent(
    "Hello ZustDevServices Team,\n\nI explored your Clinic Management Suite Demo and would like to discuss building a customized clinic management solution for my clinic / hospital.\n\nClinic Name: \nSpecialty: \nEstimated Monthly Patients: \nKey Requirements: \nPhone Number: \n\nLooking forward to hearing from you!\n"
  );

  const finalSubject = subject ? encodeURIComponent(subject) : defaultSubject;
  const finalBody = body ? encodeURIComponent(body) : defaultBody;

  return `mailto:${siteConfig.contactEmail}?subject=${finalSubject}&body=${finalBody}`;
}
