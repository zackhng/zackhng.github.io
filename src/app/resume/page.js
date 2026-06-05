import resume from "@/data/resume.json";
import styles from "@/styles/resume.module.css";

export const metadata = {
    title: "Resume — Ng Zhao Hui",
    description: "Resume of Ng Zhao Hui, rendered as an ASCII document.",
};

/* tree-style section: "├── TITLE ────" rule, content hangs off a │ rail.
   The rail and rule tail are CSS borders so long lines wrap responsively
   while the glyphs stay ASCII. */
function Section({ title, last = false, children }) {
    return (
        <section className={styles.section}>
            <div className={styles.rule}>
                <span className={styles.ruleHead}>{(last ? "└──" : "├──") + " " + title}</span>
            </div>
            <div className={`${styles.body} ${last ? styles.bodyLast : ""}`}>{children}</div>
        </section>
    );
}

function Entry({ title, sub, dates, bullets }) {
    return (
        <div className={styles.entry}>
            <div className={styles.entryHead}>
                <span className={styles.entryTitle}>{title}</span>
                {dates && <span className={styles.entryDate}>{dates}</span>}
            </div>
            {sub && <p className={styles.entrySub}>{sub}</p>}
            {bullets && (
                <ul className={styles.bullets}>
                    {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Resume() {
    const { name, contact, education, experience, projects, awards, skills } = resume;

    return (
        <main className={styles.wrapper}>
            <div className={styles.topRow}>
                <h1 className={styles.h1}>~/resume</h1>
                <a
                    className={styles.pdfLink}
                    href="/pdf/Resume_Ng_Zhao_Hui_AI.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    [ download.pdf ]
                </a>
            </div>

            <header className={styles.header}>
                <p className={styles.name}>{name.toUpperCase()}</p>
                <p className={styles.contact}>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    {" · "}
                    <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer">
                        {contact.github}
                    </a>
                    {" · "}
                    <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                        {contact.linkedin}
                    </a>
                </p>
            </header>

            <Section title="EDUCATION">
                <Entry
                    title={education.school}
                    sub={education.degree}
                    dates={education.dates}
                />
                {education.honors.map((h) => (
                    <p key={h} className={styles.note}>
                        {h}
                    </p>
                ))}
            </Section>

            <Section title="EXPERIENCE">
                {experience.map((job) => (
                    <Entry
                        key={job.company}
                        title={`${job.company} · ${job.title}`}
                        dates={job.dates}
                        bullets={job.bullets}
                    />
                ))}
            </Section>

            <Section title="PROJECTS">
                {projects.map((p) => (
                    <Entry
                        key={p.title}
                        title={p.title}
                        sub={p.subtitle}
                        dates={p.dates}
                        bullets={p.bullets}
                    />
                ))}
            </Section>

            <Section title="AWARDS">
                {awards.map((a) => (
                    <p key={a} className={styles.note}>
                        {a}
                    </p>
                ))}
            </Section>

            <Section title="SKILLS" last>
                <dl className={styles.skills}>
                    {Object.entries(skills).map(([k, v]) => (
                        <div key={k} className={styles.skillRow}>
                            <dt className={styles.skillKey}>{k}</dt>
                            <dd className={styles.skillVal}>: {v}</dd>
                        </div>
                    ))}
                </dl>
            </Section>
        </main>
    );
}
