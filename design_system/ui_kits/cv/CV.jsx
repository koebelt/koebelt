function CvRow({role,org,period,summary}){
  return <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:"var(--space-7)",
    padding:"var(--space-6) 0",borderTop:"var(--border-width) solid var(--border-hairline)"}}>
    <span style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",color:"var(--text-faint)"}}>{period}</span>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:"var(--space-4)",flexWrap:"wrap"}}>
        <span style={{font:"var(--text-heading-xs)"}}>{role}</span>
        <span style={{font:"var(--text-body-sm)",color:"var(--text-muted)"}}>{org}</span>
      </div>
      {summary&&<p style={{font:"var(--text-body-sm)",color:"var(--text-muted)",maxWidth:"var(--measure-narrow)",margin:0}}>{summary}</p>}
    </div>
  </div>;
}

function CV(){
  const {SectionHeading,Tag}=window.KOEBELTDesignSystem_35e9bf;
  const experience=[
    {period:"2019—Present",role:"Independent software engineer",org:"koebelt",summary:"Product engineering and web development for studios and small institutions."},
    {period:"2017—2019",role:"Software engineer",org:"Studio Nord, Strasbourg",summary:"Web and internal tooling for cultural clients."},
    {period:"2016—2017",role:"Engineering intern",org:"Atelier Fabrique",summary:"Frontend development and tooling."}
  ];
  const education=[
    {period:"2013—2016",role:"BA Graphic Design",org:"HEAR Strasbourg"},
    {period:"2012—2013",role:"Foundation year",org:"Lycée des Arts"}
  ];
  const skills=["Figma","Adobe Illustrator","Adobe InDesign","Adobe Photoshop","HTML/CSS","After Effects"];
  return <div style={{background:"var(--surface-page)",minHeight:"100vh"}}>
    <section style={{padding:"var(--space-11) var(--gutter-inline-lg) var(--space-8)",display:"flex",flexDirection:"column",gap:"var(--space-5)"}}>
      <SectionHeading eyebrow="CV" title="Résumé"/>
      <a href="#" onClick={e=>e.preventDefault()} style={{font:"var(--text-label-md)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",border:0,color:"var(--text-accent)",display:"inline-flex",gap:"var(--space-3)"}}>Download CV (PDF)</a>
    </section>
    <section style={{padding:"0 var(--gutter-inline-lg) var(--space-10)"}}>
      <SectionHeading eyebrow="01 — Experience" title="Work history"/>
      <div style={{marginTop:"var(--space-7)"}}>
        {experience.map(e=><CvRow key={e.role+e.org} {...e}/>)}
      </div>
    </section>
    <section style={{padding:"0 var(--gutter-inline-lg) var(--space-11)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--space-12)"}}>
      <div>
        <SectionHeading eyebrow="02 — Education" title="School"/>
        <div style={{marginTop:"var(--space-7)"}}>
          {education.map(e=><CvRow key={e.role+e.org} {...e}/>)}
        </div>
      </div>
      <div>
        <SectionHeading eyebrow="03 — Skills" title="Tools & software"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:"var(--space-3)",marginTop:"var(--space-7)"}}>
          {skills.map(s=><Tag key={s}>{s}</Tag>)}
        </div>
      </div>
    </section>
  </div>;
}
window.CV=CV;
