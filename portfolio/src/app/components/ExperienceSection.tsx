import ExperienceItem from "./ExperienceItem";
import ResumeLink from "./ResumeLink";
import SectionTitle from "./SectionTitle";

const ExperienceSection = () => {
  return (
    <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Work experience">
      <SectionTitle title="Experience" />
      <div>
        <ol className="group/list">
          <ExperienceItem
            title="Software Consultant"
            company="Source Allies"
            companySite="https://www.sourceallies.com/"
            startDate="September 2022"
            description="In my current role as a consultant, I leverage my software engineering expertise 
            to empower partners in achieving their technology goals. My specialization lies in building 
            cutting-edge enterprise applications on the cloud."
            technologies={["React", "Node.js", "TypeScript", "GCP", "Azure"]}
          />
          <ExperienceItem
            title="Software Engineer"
            company="Gravity Legal"
            companySite="https://www.gravity-legal.com/"
            startDate="June 2022"
            endDate="January 2023"
            description="Applied engineering expertise to enhance a payment processing software designed
            for law firms and legal tech companies. Automated QA through the development of a Cypress test 
            suite, providing comprehensive end-to-end test coverage. Lead integration testing during an 
            overhaul of the payment processing flow."
            technologies={["React", "Node.js", "TypeScript", "TypeORM", "Cypress", "MySQL", "AWS"]}
          />
          <ExperienceItem
            title="Software Engineer II"
            company="Principal Financial Group"
            companySite="https://www.principal.com/"
            startDate="August 2020"
            endDate="June 2022"
            description="Served as a software engineer within the Enterprise Experience Enablement 
            group. My focus was enhancing the user experiences for various customers, including key 
            experiences like home page, messaging, and user profile. Led an effort to integrate a 
            new customer segment after an acquisition, working closely with many teams across the
            company."
            technologies={["JavaEE", "JSP", "Websphere", "DB2", "Python", "Flask", "API Gateway", "AWS"]}
          />
          <ExperienceItem
            title="Software Scientist"
            company="Department of Energy"
            companySite="https://www.ameslab.gov/"
            startDate="January 2020"
            endDate="July 2020"
            description="Part-time role as Software Scientist at the Ames Laboratory contributing 
            to an open-source project CMakePP designed for creating cross-platform C and C++ build 
            systems for computational chemistry. Extended the functionality of the CMakePP 
            language and generated comprehensive and user-friendly documentation."
            technologies={["GNU Make", "CMake", "Sphinx Docs", "Linux"]}
          />
          <ExperienceItem
            title="Software Engineering Intern"
            company="Herzog Technologies"
            companySite="https://www.herzog.com/"
            startDate="May 2018"
            endDate="August 2019"
            description="Contributed as a software developer across three impactful projects: 
            developing a LiDAR-based app for railroad clearance analysis, taking on a technical 
            lead role for an in-house compensation management application, and modernizing a 
            small proprietary desktop railroad data validation software into a web-based solution."
            technologies={["Tornado", "Angular", "Python", "Bootstrap", "SQLAlchemy", "Docker", "C#", "WPF"]}
          />
          <ExperienceItem
            title="Software Engineering Intern"
            company="Collins Aerospace"
            companySite="https://www.collinsaerospace.com/"
            startDate="June 2014"
            endDate="January 2018"
            description="Contributed as a member of a team responsible for multifaceted automated 
            testing system for cutting-edge radio hardware. Incorporated feedback from test engineers to
            implement new features and address bugs within the system, improving their efficiency."
            technologies={["JavaFX", "Python", "Tornado", "Angular"]}
          />
        </ol>
        <ResumeLink />
      </div>
    </section>
  );
};

export default ExperienceSection;
