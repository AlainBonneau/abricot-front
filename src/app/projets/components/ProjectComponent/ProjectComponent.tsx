import type { Project } from '@/app/types/project';
import { getInitials } from '@/app/utils/function';
import './ProjectComponent.scss';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ProjectComponent({ project }: { project: Project }) {
  // Données fake (en attendant l'API)
  const totalTasks: number = 4;
  const doneTasks: number = 2;

  const progressPercent = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return (
    <article className="project-component">
      <div className="project-component-head">
        <h4 className="project-title">{project.name}</h4>
        <p className="project-description">{project.description}</p>
      </div>

      <section className="project-progression">
        <div className="progression-top">
          <p className="progression-label">Progression</p>
          <p className="progression-value">{clamp(progressPercent, 0, 100)}%</p>
        </div>

        <div
          className="progression-bar"
          role="progressbar"
          aria-valuenow={clamp(progressPercent, 0, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression du projet"
        >
          <div
            className="progression-bar-fill"
            style={{ width: `${clamp(progressPercent, 0, 100)}%` }}
          />
        </div>

        <p className="progression-sub">
          {doneTasks}/{totalTasks} tâches terminées
        </p>
      </section>

      <footer className="project-component-footer">
        <div className="team-header">
          <span className="team-icon" aria-hidden="true">
            👥
          </span>
          <p className="team-label">Équipe ({project.members.length})</p>
        </div>

        <div className="team-row">
          <span className="avatar avatar-owner" title={project.owner.name}>
            {getInitials(project.owner.name)}
          </span>

          <span className="owner-pill">Propriétaire</span>

          {project.members.map((member) => (
            <span key={member.id} className="avatar" title={member.user.name}>
              {getInitials(member.user.name)}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}
