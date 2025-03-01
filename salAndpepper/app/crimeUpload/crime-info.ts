
export function getCrimeInfo(category: string) {
    const crimeInfoMap: Record<string, any> = {
      domestic_violence: {
        title: "Domestic Violence",
        description:
          "Domestic violence involves any physical, emotional, or psychological abuse within a household or intimate relationship. It may include physical assault, verbal abuse, intimidation, and controlling behaviors.",
        legalConsequences:
          "Under the Protection of Women from Domestic Violence Act, 2005 (applicable across India), perpetrators can face criminal prosecution, civil injunctions, and restraining orders. Penalties include fines and imprisonment, as well as orders for restitution.",
        precautionaryMeasures:
          "Ensure immediate safety—if you're in imminent danger, leave the location and contact emergency services. Avoid confronting the offender directly.",
        trackReportStatus:
          "File your report online via the Maharashtra Police portal (Maharashtra Police Online Services) and use your unique complaint number to track updates.",
        helplines: [
          { name: "Women's Helpline", number: "181" },
          { name: "National Domestic Violence Support", number: "+91-11-23389090" },
        ],
        legalAidSupport:
          "Organizations such as Stree Aadhar and Majlis Manch offer legal counseling and crisis intervention.",
        secureEvidence:
          "Retain photographs, audio recordings, screenshots of messages, and any documented injuries. Keep digital copies backed up securely.",
        uploadEvidence:
          "Use the online complaint portals to attach supplementary documents and multimedia files; ensure files are timestamped and unaltered.",
        safetyTips:
          "Inform a trusted friend or relative about your whereabouts, change passwords regularly, and avoid sharing your location on social media.",
        emergencyContacts:
          "Keep a list of local police, nearby hospitals, and trusted family members; consider using safety apps that alert your contacts in emergencies.",
        rewardInfo:
          "Some state initiatives acknowledge citizen reports that help prevent further crimes. Check with your local police station for any reward schemes or public recognition programs.",
      },
      theft_burglary: {
        title: "Theft / Burglary",
        description:
          "Theft and burglary involve the unlawful taking of personal property, with burglary typically including the act of breaking into homes or businesses.",
        legalConsequences:
          "The Indian Penal Code (IPC) defines theft under Section 378 and covers burglary (housebreaking) under sections like 441–442. Convictions can result in imprisonment and fines.",
        precautionaryMeasures:
          "Do not disturb the scene; contact the police immediately to preserve evidence.",
        trackReportStatus:
          "Lodge a First Information Report (FIR) at your local station or via the Maharashtra Police mobile app.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Local Crime Helpline", number: "Check Maharashtra Police website" },
        ],
        legalAidSupport:
          "NGOs like Citizen Helpdesk offer guidance on property recovery and legal advice.",
        secureEvidence:
          "Preserve any broken locks, door/frame damage, and if available, obtain nearby CCTV footage. Do not tamper with the crime scene.",
        uploadEvidence:
          "Digital portals now allow uploading images, videos, and documents after the initial FIR submission.",
        safetyTips:
          "Install surveillance systems, use strong locks, and form community watch groups.",
        emergencyContacts:
          "Maintain a list of nearby police contacts and community liaison officers.",
        rewardInfo:
          "Some local initiatives reward informants who provide key information leading to arrests—check with your local police for details.",
      },
      assault: {
        title: "Assault",
        description:
          "Assault involves any intentional act of physical violence or threat of violence against another person.",
        legalConsequences:
          "Under the IPC, sections covering assault (e.g., Section 351) and causing hurt (e.g., Section 323) apply. Convictions can result in imprisonment and monetary fines.",
        precautionaryMeasures:
          "Seek immediate medical help if injured and get to a safe location. Do not engage further with the assailant.",
        trackReportStatus:
          "File an FIR at your nearest police station or via the Maharashtra Police online portal.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Local Assault Helpline", number: "Check state services" },
        ],
        legalAidSupport:
          "Organizations such as Human Rights Law Network can offer legal support and counseling.",
        secureEvidence:
          "Secure medical reports, photographs of injuries, eyewitness statements, and any available CCTV footage.",
        uploadEvidence:
          "Use the complaint portal's attachment feature to add extra evidence as it becomes available.",
        safetyTips:
          "Avoid isolated areas, use the 'safety check' features on mobile apps, and inform a trusted contact of your whereabouts.",
        emergencyContacts:
          "Keep emergency numbers on speed dial, including local hospitals and nearby police stations.",
        rewardInfo:
          "Some community programs provide commendations for witnesses or victims who help in the prosecution of assault cases.",
      },

      vandalism: {
        title: "Vandalism",
        description:
          "Vandalism involves the willful destruction, defacement, or damage to public or private property. This may include graffiti, breaking windows, or other acts of property damage.",
        legalConsequences:
          "Under the IPC, Section 425 (mischief) and related sections can be applied, leading to fines and imprisonment.",
        similarCases:
          "Cases in Maharashtra have seen individuals arrested for graffiti and damage to public monuments, with subsequent trials and community service orders.",
        precautionaryMeasures:
          "Do not attempt to remove or alter evidence. Document the damage immediately and take photographs.",
        trackReportStatus:
          "Register your complaint at the local police station or via the online portal.",
        anonymityAssurance:
          "You may choose to remain anonymous, particularly if the vandalism occurred in a politically or socially sensitive context.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Vandalism-specific queries", number: "Check local district helplines" },
        ],
        nearestPoliceStation:
          "Use Google Maps to find your local station; many provide real-time directions.",
        legalAidSupport:
          "NGOs such as Save Heritage offer advice on property damage and restoration issues.",
        secureEvidence:
          "Record the scene with high-quality photographs or videos from different angles. Note the time, date, and location precisely.",
        uploadEvidence:
          "Use the reporting portal to attach additional images or digital records as they become available.",
        safetyTips:
          "Get involved in neighborhood watch programs and report suspicious activities. Stay updated on local alerts.",
        emergencyContacts:
          "Keep contacts of local civic bodies and municipal authorities handy in addition to the police.",
        rewardInfo:
          "In some areas, residents who report vandalism that leads to conviction are publicly acknowledged or given community rewards.",
      },
    
      drug_related: {
        title: "Drug-Related Crimes",
        description:
          "Drug-related crimes involve the possession, distribution, or manufacturing of illegal substances. These offenses harm public health and often fund organized crime.",
        legalConsequences:
          "The Narcotic Drugs and Psychotropic Substances (NDPS) Act, 1985 outlines stringent penalties including long-term imprisonment and heavy fines.",
        similarCases:
          "Several cases in Maharashtra have seen individuals arrested in drug raids, with seizures of large quantities of substances and subsequent convictions under the NDPS Act.",
        precautionaryMeasures:
          "Avoid any direct involvement in drug circles. Report through secure channels to protect your identity.",
        trackReportStatus:
          "Use the official state crime reporting system or designated anti-drug task force portals.",
        anonymityAssurance:
          "Reports can be filed confidentially, protecting the reporter from potential retribution.",
        helplines: [
          { name: "Narcotics Anonymous Helpline", number: "Check state-specific listings" },
          { name: "General Emergency", number: "112" },
        ],
        nearestPoliceStation:
          "Use Google Maps to find the nearest anti-narcotics cell or police station.",
        legalAidSupport:
          "NGOs such as The Anti Narcotics Council provide counseling and rehabilitation support.",
        secureEvidence:
          "If safe, document suspicious activities (e.g., video from a distance) without endangering yourself. Avoid handling any substances.",
        uploadEvidence:
          "Supplement your report with digital files or descriptions via the secure online reporting portal.",
        safetyTips:
          "Stay informed about local drug hotspots and participate in community awareness programs.",
        emergencyContacts:
          "Keep the contacts of local anti-narcotics cells and crisis intervention centers readily available.",
        rewardInfo:
          "Some state initiatives offer incentives for tip-offs that lead to major drug busts—check with your local police for any such programs.",
      },
    
      cybercrime: {
        title: "Cybercrime",
        description:
          "Cybercrime encompasses online fraud, hacking, identity theft, and cyberbullying. These crimes exploit digital platforms and can affect individuals and businesses.",
        legalConsequences:
          "The Information Technology Act, 2000 provides the legal framework to address cyber offenses. Penalties include imprisonment, fines, and orders to compensate victims.",
        similarCases:
          "Cyber fraud cases in cities such as Pune and Mumbai have resulted in arrests of hackers and recovery of stolen funds after thorough investigations.",
        precautionaryMeasures:
          "Immediately secure your online accounts—change passwords, enable two-factor authentication, and do not share personal data further.",
        trackReportStatus:
          "Register your complaint on the National Cyber Crime Reporting Portal and use the reference number to monitor progress.",
        anonymityAssurance:
          "Reports can be submitted anonymously; your personal details remain protected under data privacy norms.",
        helplines: [
          { name: "Cybercrime Cell Helpline", number: "155260 (varies by district)" },
          { name: "General Emergency", number: "112" },
        ],
        nearestPoliceStation:
          "Check the local cyber cell branch via Google Maps (e.g., Mumbai Cyber Cell).",
        legalAidSupport:
          "Organizations like Cyberpeace Foundation offer technical and legal advice for cybercrime victims.",
        secureEvidence:
          "Save all electronic communications, screenshots, and emails. Preserve IP logs and any digital transaction records.",
        uploadEvidence:
          "Digital reporting portals allow you to attach files and documents securely; always keep backups.",
        safetyTips:
          "Regularly update security software, be cautious of phishing scams, and educate friends and family on safe internet practices.",
        emergencyContacts:
          "Maintain a list of trusted IT professionals, local cyber cells, and relevant helplines.",
        rewardInfo:
          "Some initiatives may recognize citizens whose reports lead to the disruption of significant cybercrimes—consult local cyber cell programs for details.",
      },
    
      human_trafficking: {
        title: "Human Trafficking",
        description:
          "Human trafficking involves coercing or forcing individuals into labor or sexual exploitation. It is a grave violation of human rights.",
        legalConsequences:
          "The Immoral Traffic (Prevention) Act, 1956 provides for strict punishments, including long-term imprisonment and heavy fines.",
        similarCases:
          "In Maharashtra, sting operations have led to the dismantling of trafficking rings, with perpetrators tried under the ITPA and relevant sections of the IPC.",
        precautionaryMeasures:
          "Report immediately through secure and confidential channels. Do not try to rescue trafficked persons without proper support.",
        trackReportStatus:
          "Use local police websites or dedicated human trafficking units to follow up on your complaint.",
        anonymityAssurance:
          "Confidentiality is guaranteed to protect whistleblowers and vulnerable witnesses.",
        helplines: [
          { name: "Human Trafficking Helpline", number: "181 or state-specific helplines" },
          { name: "General Emergency", number: "112" },
        ],
        nearestPoliceStation:
          "Locate your nearest anti-trafficking unit via Google Maps.",
        legalAidSupport:
          "Organizations such as Prahar and Rakshak provide counseling, legal support, and rehabilitation services.",
        secureEvidence:
          "Collect and store any communications, photographs, or documents that indicate coercion or exploitation. Ensure that the evidence is time-stamped.",
        uploadEvidence:
          "Secure portals allow additional submissions—always use encrypted channels where possible.",
        safetyTips:
          "Be alert to signs of trafficking in your community; report suspicious behavior without direct confrontation.",
        emergencyContacts:
          "List the contacts for local trafficking task forces, district police, and social services.",
        rewardInfo:
          "Some initiatives recognize those who help expose trafficking networks; inquire with your local police or NGOs regarding any reward programs.",
      },
    
      homicideMurder: {
        title: "Homicide / Murder",
        description:
          "Homicide (murder) refers to the unlawful killing of a person. It is treated as one of the most serious offenses.",
        legalConsequences:
          "The Indian Penal Code, Section 302 prescribes the death penalty or life imprisonment for convicted murderers.",
        similarCases:
          "High-profile homicide cases in Maharashtra have led to prolonged investigations, with forensic evidence playing a critical role in securing convictions.",
        precautionaryMeasures:
          "Immediately contact emergency services. Do not disturb the scene.",
        trackReportStatus:
          "FIRs can be tracked through local police websites or by contacting the investigating officer.",
        anonymityAssurance:
          "Witnesses may submit statements confidentially if they fear reprisal.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Specialized homicide investigation units", number: "Available via district police helplines" },
        ],
        nearestPoliceStation:
          "Use Google Maps to locate the nearest homicide or crime investigation unit.",
        legalAidSupport:
          "NGOs like Crime Victim Network provide counseling and legal support to families.",
        secureEvidence:
          "Do not alter the crime scene. Provide any available forensic or eyewitness information to the investigating agency.",
        uploadEvidence:
          "Evidence such as CCTV footage, digital communications, and forensic reports can be submitted through the police portal as the case progresses.",
        safetyTips:
          "Stay vigilant, avoid sharing sensitive details on social media, and cooperate with law enforcement.",
        emergencyContacts:
          "Maintain a list of district crime branch contacts and local police station numbers.",
        rewardInfo:
          "In some cases, providing key evidence that helps solve a homicide may result in commendations or financial rewards through witness protection programs.",
      },
    
      fraud_scams: {
        title: "Fraud / Scams",
        description:
          "Fraud and scams involve deceptive financial practices such as identity theft, credit card fraud, and Ponzi schemes. They can target individuals and businesses alike.",
        legalConsequences:
          "The IPC (Section 420) deals with cheating and fraud, with penalties including imprisonment and fines. In some cases, the Prevention of Money Laundering Act, 2002 may also apply.",
        similarCases:
          "Several scams in Maharashtra—ranging from online fraud to multi-level marketing schemes—have led to extensive investigations and prosecutions.",
        precautionaryMeasures:
          "Immediately secure your financial information. Contact your bank and do not share sensitive details further.",
        trackReportStatus:
          "Register your complaint with the local economic offenses wing and track via their online system.",
        anonymityAssurance:
          "You may opt for anonymous reporting if you fear retaliation from organized fraudsters.",
        helplines: [
          { name: "National Cyber Crime Reporting", number: "155260" },
          { name: "General Emergency", number: "112" },
        ],
        nearestPoliceStation:
          "Locate the nearest Economic Offences Wing office using Google Maps.",
        legalAidSupport:
          "Organizations like Consumer Guidance Society of India provide legal advice and financial dispute resolution.",
        secureEvidence:
          "Keep all emails, transaction records, and screenshots of fraudulent communications. Preserve any correspondence from banks or financial institutions.",
        uploadEvidence:
          "Use secure file upload options on the complaint portal to add additional evidence as you gather it.",
        safetyTips:
          "Educate yourself on common scam tactics, verify the credentials of unknown contacts, and use secure networks for online transactions.",
        emergencyContacts:
          "Keep a list of consumer helplines, local police, and cybercrime units.",
        rewardInfo:
          "In some instances, tip-offs that lead to the dismantling of fraud networks may be rewarded by investigative agencies—check with local authorities for details.",
      },
    
      hate_crimes: {
        title: "Hate Crimes",
        description:
          "Hate crimes are motivated by bias against race, religion, gender, or other identity factors. Although India does not have a dedicated hate crime statute, such offenses are prosecuted under various IPC sections and, in some cases, under the Protection of Civil Rights Act, 1955.",
        legalConsequences:
          "Offenders may face charges under relevant IPC sections for causing public disorder or inciting violence, along with additional penalties if specific communal or caste-based laws are violated.",
        similarCases:
          "Incidents driven by communal bias in cities like Mumbai have resulted in heightened police vigilance and strict legal actions under multiple statutes.",
        precautionaryMeasures:
          "If you witness or experience a hate crime, move to a safe location and document any identifying features of the aggressor(s).",
        trackReportStatus:
          "File an FIR at your local police station and use the designated community safety portals for updates.",
        anonymityAssurance:
          "Reports can be filed confidentially; personal identity is safeguarded during the investigation.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Community Relations Helpline", number: "Contact details available on state police websites" },
        ],
        nearestPoliceStation:
          "Use Google Maps to locate a station familiar with handling communal or hate-related issues.",
        legalAidSupport:
          "NGOs like Citizens for Justice and Peace offer legal assistance and counseling for hate crime victims.",
        secureEvidence:
          "Record any audio or video of the incident, collect witness contact information, and save all digital communications.",
        uploadEvidence:
          "Secure portals provided by the police allow you to upload evidence safely and confidentially.",
        safetyTips:
          "Stay informed through local community forums and avoid areas with known tensions until authorities have intervened.",
        emergencyContacts:
          "Maintain updated contacts of community liaison officers and local police.",
        rewardInfo:
          "Though not common, in certain jurisdictions community volunteers and informants who help prevent hate crimes may be publicly commended.",
      },

      sexual_offenses: {
        title: "Sexual Offenses",
        description:
          "Sexual offenses include rape, sexual assault, harassment, and exploitation. These crimes profoundly affect the victims' physical and emotional well-being.",
        legalConsequences:
          "The IPC (Section 376 for rape, Section 354 for sexual harassment) and subsequent amendments under the Criminal Law (Amendment) Act, 2013 impose strict penalties including long-term imprisonment and, in some cases, the death penalty.",
        precautionaryMeasures:
          "Immediately seek a safe space and medical attention. Do not delete any evidence, including digital communications.",
        trackReportStatus:
          "Report at the nearest police station or through women's help centers; many states now offer tracking via dedicated apps.",
        helplines: [
          { name: "Women's Helpline", number: "181/1091" },
          { name: "Sexual Assault Crisis Intervention", number: "Contact details provided by local NGOs" },
        ],
        legalAidSupport:
          "Organizations such as Sangini and Rape Crisis Centers provide immediate legal and emotional support.",
        secureEvidence:
          "Preserve any physical evidence (clothing, photos, medical reports) and digital evidence (texts, social media messages). Seek forensic assistance as soon as possible.",
        uploadEvidence:
          "Use the secure online portals provided by the police or designated apps to attach supplementary evidence.",
        safetyTips:
          "Regularly update someone you trust about your whereabouts; consider carrying a personal safety device.",
        emergencyContacts:
          "Keep a list of trusted emergency contacts, local police, and crisis support lines.",
        rewardInfo:
          "Many state schemes and NGOs acknowledge the courage of survivors and witnesses—some offer rehabilitation support and legal assistance free of charge.",
      },
      arson: {
        title: "Arson",
        description:
          "Arson involves the intentional setting of fires to property or land. It endangers lives, destroys property, and disrupts communities.",
        legalConsequences:
          "Under the IPC (sections covering criminal mischief by fire, e.g., Section 435), arson is punishable by imprisonment and fines.",
        precautionaryMeasures:
          "Evacuate the area immediately and avoid interfering with active fire scenes. Contact emergency services without delay.",
        trackReportStatus:
          "File an FIR at the nearest police station and track via state emergency portals.",
        helplines: [
          { name: "Fire and Emergency", number: "101" },
          { name: "Police Emergency", number: "112" },
        ],
        legalAidSupport:
          "Organizations like Prayas offer support to victims of property crimes.",
        secureEvidence:
          "Document the damage from a safe distance using photographs and videos; note details like time and location.",
        uploadEvidence:
          "Submit evidence through secure portals provided by the fire or police departments.",
        safetyTips:
          "Follow local safety advisories during fire outbreaks and participate in community fire-safety programs.",
        emergencyContacts:
          "Keep the contact details of local fire services, hospitals, and police stations readily available.",
        rewardInfo:
          "Informants whose tips help prevent further arson-related incidents are sometimes publicly acknowledged by community safety initiatives.",
      },
      public_order_crimes: {
        title: "Public Order Crimes",
        description:
          "Public order crimes include disturbances such as public intoxication, disorderly conduct, and loitering that disrupt community peace.",
        legalConsequences:
          "Offenses under sections such as Section 188 of the IPC can lead to fines, community service, or imprisonment.",
        precautionaryMeasures:
          "Remove yourself from the immediate area if tensions are rising and contact local authorities.",
        trackReportStatus:
          "File a complaint via the local police station or through designated public grievance portals.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Local public order complaint helpline", number: "Refer to the Maharashtra Police website" },
        ],
        legalAidSupport:
          "Local civic bodies and legal aid societies can offer advice on handling public order disputes.",
        secureEvidence:
          "Record the situation if safe to do so. Collect contact information from witnesses.",
        uploadEvidence:
          "Supplement your report with digital files through the police portal's secure upload feature.",
        safetyTips:
          "Stay informed of local events and avoid areas known for frequent disturbances.",
        emergencyContacts:
          "Keep emergency numbers and local police contacts easily accessible.",
        rewardInfo:
          "Citizens contributing to the restoration of public order may be recognized by local community committees.",
      },
      kidnapping_abduction: {
        title: "Kidnapping / Abduction",
        description:
          "Kidnapping or abduction involves the unlawful taking and detention of a person against their will. This offense is taken very seriously given its implications on personal freedom and safety.",
        legalConsequences:
          "The IPC (Sections 363–369) prescribes strict punishments including long-term imprisonment.",
        precautionaryMeasures:
          "If you suspect an abduction, immediately alert the police and do not try to intervene on your own.",
        trackReportStatus:
          "File an FIR immediately and obtain a reference number to follow up on the investigation.",
        helplines: [
          { name: "Emergency", number: "112" },
          { name: "Special Kidnapping Hotline", number: "Provided by local authorities (check the Maharashtra Police website)" },
        ],
        legalAidSupport:
          "NGOs like Bachpan Bachao Andolan support victims and families in abduction cases.",
        secureEvidence:
          "Record any suspicious behavior, note vehicle details, and gather witness accounts. Avoid direct confrontation.",
        uploadEvidence:
          "Attach photos, videos, or written descriptions through the secure reporting portal.",
        safetyTips:
          "Maintain a trusted network of contacts and inform them of any unusual activities in your vicinity.",
        emergencyContacts:
          "Keep a list of police, child protection agencies, and trusted community leaders.",
        rewardInfo:
          "Some state schemes may offer rewards for information leading to the rescue of abducted individuals—check local protocols.",
      },
      corruption_bribery: {
        title: "Corruption / Bribery",
        description:
          "Corruption and bribery involve the abuse of power for personal or financial gain, undermining public trust and governance.",
        legalConsequences:
          "The Prevention of Corruption Act, 1988 and relevant sections of the IPC impose fines, imprisonment, and disqualification from public office.",
        precautionaryMeasures:
          "Document all corrupt interactions carefully. Avoid direct confrontation and preserve evidence.",
        trackReportStatus:
          "Report to the local Anti-Corruption Bureau or use online reporting systems; track using the reference number provided.",
        helplines: [
          { name: "Anti-Corruption Helpline", number: "155255 (state-specific)" },
          { name: "General Emergency", number: "112" },
        ],
        legalAidSupport:
          "Organizations like Common Cause offer legal guidance and support for corruption-related cases.",
        secureEvidence:
          "Secure copies of documents, emails, and audio recordings. Store evidence in a safe, backed-up location.",
        uploadEvidence:
          "Use secure online portals designed for whistleblower submissions.",
        safetyTips:
          "Avoid sharing sensitive details publicly. Use secure, encrypted channels for communication.",
        emergencyContacts:
          "Keep updated contacts for local anti-corruption cells and legal advisors.",
        rewardInfo:
          "In certain cases, whistleblower protection laws provide incentives or monetary rewards for information that leads to a conviction.",
      },
      gang_related_crimes: {
        title: "Gang-Related Crimes",
        description:
          "Gang-related crimes involve organized criminal activity such as drug trafficking, extortion, and violent offenses. These activities are often interlinked with broader criminal networks.",
        legalConsequences:
          "Offenders may be prosecuted under various IPC sections (e.g., Section 120B for criminal conspiracy) and, in some cases, under the Unlawful Activities (Prevention) Act.",
        precautionaryMeasures:
          "Do not attempt to intervene directly. Report immediately to specialized units.",
        trackReportStatus:
          "Use dedicated gang-crime reporting channels available on police websites.",
        helplines: [
          { name: "Gang Crime Helpline", number: "Check local listings (often available via state police apps)" },
          { name: "Emergency", number: "112" },
        ],
        legalAidSupport:
          "NGOs like Justice Initiative provide legal aid and rehabilitation support for crime victims.",
        secureEvidence:
          "Document any suspicious group activity, noting dates, times, and descriptions of persons or vehicles involved.",
        uploadEvidence:
          "Use secure submission features on the dedicated reporting portal to provide further details.",
        safetyTips:
          "Stay alert in areas known for gang activity, and report any unusual group gatherings.",
        emergencyContacts:
          "Maintain contact details of local police and community watch groups.",
        rewardInfo:
          "Some state programs reward critical information that helps break up organized crime syndicates—check with your local police.",
      },
      stalking_and_harassment: {
        title: "Stalking and Harassment",
        description:
          "Stalking and harassment involve repeated unwanted attention that causes fear or distress. This can occur offline or online.",
        legalConsequences:
          "The IPC (Section 354D for stalking and related provisions) and the Protection of Women from Domestic Violence Act, 2005 (for harassment in domestic settings) impose penalties including imprisonment and fines.",
        precautionaryMeasures:
          "Immediately document incidents (dates, times, screenshots) and inform a trusted contact. Avoid direct confrontation.",
        trackReportStatus:
          "File an FIR and use designated tracking systems provided by the local police.",
        helplines: [
          { name: "Women's Helpline", number: "181/1091" },
          { name: "Cyber Stalking Helpline", number: "Available via the Maharashtra Police website" },
        ],
        legalAidSupport:
          "NGOs like Jagori provide legal advice and counseling for stalking and harassment cases.",
        secureEvidence:
          "Keep all messages, call logs, and recordings. Use apps that time-stamp screenshots automatically.",
        uploadEvidence:
          "Secure online platforms let you attach new evidence as it is collected.",
        safetyTips:
          "Regularly update your privacy settings on social media, inform trusted friends or family, and consider using safety apps.",
        emergencyContacts:
          "Have a list of local police, cyber cell numbers, and trusted contacts.",
        rewardInfo:
          "Some initiatives publicly commend individuals whose evidence contributes to the cessation of harassment and stalking behaviors.",
      },
      environmental_crimes: {
        title: "Environmental Crimes",
        description:
          "Environmental crimes include illegal dumping, pollution, and wildlife poaching. These offenses have long-term impacts on public health and biodiversity.",
        legalConsequences:
          "The Environment Protection Act, 1986 and the Wildlife Protection Act, 1972 outline penalties ranging from fines to imprisonment.",
        precautionaryMeasures:
          "Document the incident without disturbing the site. Ensure your own safety by keeping a safe distance.",
        trackReportStatus:
          "Use the state’s environmental grievance portals or local police stations to file and track your complaint.",
        helplines: [
          { name: "Pollution Control Board Helpline", number: "Check Maharashtra State Pollution Control Board contacts" },
          { name: "Emergency", number: "112" },
        ],
        legalAidSupport:
          "NGOs such as Centre for Science and Environment and Greenpeace India provide legal and technical assistance.",
        secureEvidence:
          "Take clear photographs or videos of the violation. Note the location (using GPS coordinates), date, and time.",
        uploadEvidence:
          "Submit your evidence using the designated online forms or email addresses provided by environmental authorities.",
        safetyTips:
          "Engage with local environmental groups, attend public hearings, and stay informed about local environmental regulations.",
        emergencyContacts:
          "Keep contacts of local pollution control offices, environmental NGOs, and district administrative bodies.",
        rewardInfo:
          "Some government and NGO schemes provide awards or recognition for environmental whistleblowers whose reports lead to corrective action.",
      },
    
    };
  
    return (
      crimeInfoMap[category] || {
        title: "General Crime Information",
        description: "Please select a specific crime category for detailed information.",
      }
    );
}
