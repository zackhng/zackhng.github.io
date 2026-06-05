import intro from "@/data/introduction.json";
import projects from "@/data/projects.json";
import AsciiFrame from "@/components/asciiFrame";
import Project from "@/components/project";
import styles from "@/styles/homeContent.module.css";

const SKILL_GROUPS = [
    { key: "lang", title: "Languages" },
    { key: "frameworks", title: "Frameworks" },
    { key: "tools", title: "Tools" },
];

export default function HomeContent() {
    return (
        <div className={styles.content}>
            <section className={styles.hero}>
                <div className={styles.heroFrame}>
                    <AsciiFrame imagePath="/images/selfie_2.jpg" scale={0.32} alt={intro.name} />
                </div>
                <div className={styles.heroText}>
                    <p className={styles.kicker}>~/ portfolio</p>
                    <h1 className={styles.name}>{intro.name}</h1>
                    <p className={styles.lead}>{intro.shortIntro}</p>
                </div>
            </section>

            <section className={styles.section} id="about" style={{ scrollMarginTop: "6rem" }}>
                <p>{intro.passion}</p>
                <p>{intro.goal}</p>
                <p className={styles.edu}>{intro.education}</p>

                <div className={styles.skills}>
                    {SKILL_GROUPS.map((g) => (
                        <div key={g.key} className={styles.skillGroup}>
                            <span className={styles.skillTitle}>+ {g.title}</span>
                            <div className={styles.tags}>
                                {(intro.skills[g.key] || []).map((s) => (
                                    <span key={s} className={styles.tag}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section} id="projects" style={{ scrollMarginTop: "6rem" }}>
                <h2 className={styles.h2}>Projects</h2>
                <div className={styles.projectGrid}>
                    {projects.map((p) => (
                        <Project key={p.id} project={p} />
                    ))}
                </div>
            </section>

            <section className={styles.section} id="contact" style={{ scrollMarginTop: "6rem" }}>
                <h2 className={styles.h2}>Contact</h2>
                <p>
                    LinkedIn:{" "}
                    <a href={`https://${intro.links.linkedin}`} target="_blank" rel="noopener noreferrer">
                        {intro.links.linkedin}
                    </a>
                </p>
                <p>
                    Email: <a href={`mailto:${intro.links.email}`}>{intro.links.email}</a>
                </p>
            </section>
        </div>
    );
}
