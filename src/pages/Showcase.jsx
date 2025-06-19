import TaskCard from "../components/TaskCard";

export default function Showcase() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI Task Cards</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <TaskCard
          image="https://via.placeholder.com/300x200"
          title="AI in Teaching"
          description="Explore how AI supports effective instruction"
        />
        <TaskCard
          image="https://via.placeholder.com/300x200"
          title="AI in Learning"
          description="Empowering students through adaptive learning"
        />
      </div>
    </div>
  );
}
