import data from "@/data/introduction.json";
import styles from "@/styles/introduction.module.css";

export default function Introduction() {
    return (
        <div className={styles.intro}>
            <h2 className={styles.title}>{data.title}</h2>
            <p className={styles.lead}>{data.shortIntro}</p>
            <p>{data.passion}</p>
            <p>{data.goal}</p>
            <p className={styles.edu}>{data.education}</p>

            <div className={styles.contact}>
                <span>
                    LinkedIn:{" "}
                    <a href={`https://${data.links.linkedin}`} target="_blank" rel="noopener noreferrer">
                        {data.links.linkedin}
                    </a>
                </span>
                <span>
                    Email: <a href={`mailto:${data.links.email}`}>{data.links.email}</a>
                </span>
                <span>
                    Phone: <a href={`tel:${data.links.number}`}>{data.links.number}</a>
                </span>
            </div>
        </div>
    );
}
