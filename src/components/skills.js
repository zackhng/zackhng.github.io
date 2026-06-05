import data from "@/data/introduction.json";
import styles from "@/styles/skills.module.css";

const GROUPS = [
    { key: "lang", title: "Languages" },
    { key: "frameworks", title: "Frameworks" },
    { key: "tools", title: "Tools" },
];

export default function Skills() {
    return (
        <section className={styles.skills}>
            <h3 className={styles.heading}>~/skills</h3>
            <div className={styles.grid}>
                {GROUPS.map((g) => (
                    <div key={g.key} className={styles.group}>
                        <div className={styles.groupTitle}>+ {g.title}</div>
                        <ul className={styles.list}>
                            {(data.skills[g.key] || []).map((s) => (
                                <li key={s} className={styles.tag}>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
