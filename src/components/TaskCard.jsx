export default function TaskCard({ image, title, description }) {
  return (
    <div className="task-card">
      <img src={image} alt={title} className="task-card-img" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
