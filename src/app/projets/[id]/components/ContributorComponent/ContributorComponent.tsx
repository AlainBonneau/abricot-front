import type { Project } from '@/app/types/project';
import './ContributorComponent.scss';

type Props = {
  owner?: Project['owner'] | null; // => User
  members?: Project['members']; // => ProjectMember[]
};

export default function ContributorComponent({ owner, members }: Props) {
  return (
    <div className="contributor-component">
      <h3>Contributeurs</h3>

      <div className="contributors-list">
        {owner && (
          <div className="contributor-item">
            <span className="contributor-role">Propriétaire</span>
            <span className="contributor-name">{owner.name}</span>
          </div>
        )}

        {members?.map((member) => (
          <div key={member.id} className="contributor-item">
            <span className="contributor-name">{member.user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
