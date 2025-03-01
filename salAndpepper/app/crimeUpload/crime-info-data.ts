// This file contains detailed information for each crime category

export type HelplineInfo = {
    name: string
    number: string
  }
  
  export type StepInfo = {
    title: string
    description: string
  }
  
  export type CrimeInfoType = {
    title: string
    emergencyHelplines: HelplineInfo[]
    steps: StepInfo[]
    additionalInfo?: string
  }
  
  export const crimeInfoData: Record<string, CrimeInfoType> = {
    domestic_violence: {
      title: "Domestic Violence",
      emergencyHelplines: [
        { name: "National Emergency Number", number: "112" },
        { name: "Women Helpline (All India)", number: "1091" },
        { name: "Women Helpline Domestic Abuse", number: "181" },
        { name: "National Commission for Women", number: "011-26942369" },
      ],
      steps: [
        {
          title: "Ensure Immediate Safety",
          description:
            "If you or someone is in immediate danger, leave the situation if possible and call 100 (Police) or 112 (Emergency).",
        },
        {
          title: "Seek Medical Attention",
          description:
            "If injured, visit the nearest hospital or call 108 for ambulance services. Make sure to document injuries for evidence.",
        },
        {
          title: "File a Police Complaint",
          description:
            "Visit the nearest police station to file an FIR under the Protection of Women from Domestic Violence Act, 2005. You can also call 181 for assistance.",
        },
        {
          title: "Legal Protection",
          description:
            "Apply for a protection order from the court. Contact the Protection Officer in your district or a legal aid service.",
        },
        {
          title: "Counseling and Support",
          description:
            "Reach out to NGOs like Shakti Shalini, SNEHA, or other women's support organizations for counseling and shelter if needed.",
        },
      ],
      additionalInfo:
        "Under the Protection of Women from Domestic Violence Act, 2005, victims can seek protection orders, residence orders, monetary relief, and custody orders. The law covers physical, sexual, verbal, emotional, and economic abuse.",
    },
  
    assault: {
      title: "Assault",
      emergencyHelplines: [
        { name: "National Emergency Number", number: "112" },
        { name: "Police Control Room", number: "100" },
        { name: "Ambulance", number: "108" },
      ],
      steps: [
        {
          title: "Ensure Safety",
          description:
            "Move to a safe location away from the attacker. If severely injured, call 108 for an ambulance immediately.",
        },
        {
          title: "Seek Medical Help",
          description:
            "Visit the nearest hospital for treatment and to document injuries. Request a medical certificate as it serves as evidence.",
        },
        {
          title: "Report to Police",
          description:
            "File an FIR at the nearest police station. Provide detailed information about the incident, including time, location, and description of the attacker.",
        },
        {
          title: "Gather Evidence",
          description:
            "Collect witness statements, photographs of injuries, torn clothing, or any other evidence related to the assault.",
        },
        {
          title: "Legal Assistance",
          description: "Consider consulting a lawyer or contacting legal aid services for guidance on pursuing the case.",
        },
      ],
      additionalInfo:
        "Assault is covered under various sections of the Indian Penal Code, including Section 351 (defining assault) and Sections 352, 353, 354, and 355 for different types of assault. The punishment varies based on the severity and nature of the assault.",
    },
  
    human_trafficking: {
      title: "Human Trafficking",
      emergencyHelplines: [
        { name: "National Emergency Number", number: "112" },
        { name: "Anti-Human Trafficking Unit", number: "1098" },
        { name: "Women Helpline", number: "1091" },
        { name: "Childline", number: "1098" },
      ],
      steps: [
        {
          title: "Report Immediately",
          description:
            "If you suspect human trafficking, call 1098 (Childline) or 1091 (Women Helpline) or the local Anti-Human Trafficking Unit.",
        },
        {
          title: "Provide Detailed Information",
          description:
            "Share specific details like location, descriptions of victims and traffickers, vehicle information, and any patterns observed.",
        },
        {
          title: "Do Not Intervene Directly",
          description:
            "Human trafficking often involves organized crime. Let law enforcement handle the situation to ensure safety.",
        },
        {
          title: "Support Victims",
          description:
            "If you're helping a victim, connect them with organizations like Prajwala, Shakti Vahini, or government shelters.",
        },
        {
          title: "Follow Up",
          description:
            "Stay in touch with authorities about the case and provide any additional information that may help.",
        },
      ],
      additionalInfo:
        "Human trafficking is addressed under the Immoral Traffic (Prevention) Act, 1956, and Sections 370 and 370A of the Indian Penal Code. The government has established Anti-Human Trafficking Units (AHTUs) in many districts to specifically handle these cases.",
    },
  
    cybercrime: {
      title: "Cybercrime",
      emergencyHelplines: [
        { name: "National Cyber Crime Reporting Portal", number: "www.cybercrime.gov.in" },
        { name: "Cyber Crime Helpline", number: "1930" },
        { name: "Women Helpline for Cyber Crime", number: "155260" },
      ],
      steps: [
        {
          title: "Preserve Evidence",
          description:
            "Take screenshots of all relevant communications, websites, or messages. Note dates, times, and any other pertinent details.",
        },
        {
          title: "Report Online",
          description:
            "File a complaint on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call the Cyber Crime Helpline at 1930.",
        },
        {
          title: "Visit Cyber Cell",
          description:
            "For serious cases, visit your local police station's cyber cell with all evidence and file an FIR.",
        },
        {
          title: "Financial Fraud Actions",
          description:
            "For financial fraud, immediately contact your bank to freeze transactions and report to the RBI ombudsman.",
        },
        {
          title: "Update Security",
          description: "Change passwords for all accounts, update security settings, and scan devices for malware.",
        },
      ],
      additionalInfo:
        "Cybercrimes in India are primarily dealt with under the Information Technology Act, 2000 (amended in 2008). For immediate action in financial fraud cases, report within 24 hours to increase chances of recovering funds.",
    },
  
    // Add more crime categories as needed...
  
    other: {
      title: "Other Crimes",
      emergencyHelplines: [
        { name: "National Emergency Number", number: "112" },
        { name: "Police Control Room", number: "100" },
        { name: "Ambulance", number: "108" },
        { name: "Women Helpline", number: "1091" },
        { name: "Child Helpline", number: "1098" },
      ],
      steps: [
        {
          title: "Assess the Situation",
          description:
            "Determine if there is an immediate threat to safety. If yes, move to a safe location and call emergency services.",
        },
        {
          title: "Report to Authorities",
          description: "Contact the appropriate emergency number or visit the nearest police station to file a report.",
        },
        {
          title: "Document Evidence",
          description:
            "Collect and preserve any evidence related to the incident, including photos, videos, or witness information.",
        },
        {
          title: "Seek Appropriate Help",
          description: "Depending on the nature of the crime, contact specialized helplines or support services.",
        },
        {
          title: "Follow Up",
          description:
            "Keep track of your case by obtaining the FIR number and following up with the investigating officer.",
        },
      ],
      additionalInfo:
        "For any crime not specifically listed, it's important to report to the local police station. You can also use the CCTNS (Crime and Criminal Tracking Network & Systems) to track the status of your complaint online in many states.",
    },
  }
  
  // Function to get crime-specific information
  export const getCrimeInfo = (category: string): CrimeInfoType => {
    return crimeInfoData[category] || crimeInfoData.other
  }
  
  