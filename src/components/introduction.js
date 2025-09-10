import data from "@/data/introduction.json";
export default function Introduction(text){
    return (
        <div>
            <h2>{data.title}</h2>
            <p>{data.shortIntro}</p>
            <p>{data.passion}</p>
            <p>{data.goal}</p>
            <p>{data.education}</p>
            <p>Linkedin: <a href={`https://${data.links.linkedin}`} target="_blank" rel="noopener noreferrer">{data.links.linkedin}</a></p>
            <p>Email: <a href={`mailto:${data.links.email}`}>{data.links.email}</a></p>
            <p>Phone: <a href={`tel:${data.links.number}`}>{data.links.number}</a></p>
        </div>
        
    )
}