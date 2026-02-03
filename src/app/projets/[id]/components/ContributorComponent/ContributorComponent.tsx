import type { Project } from '@/app/types/project';
import { getInitials } from '@/app/utils/function';
import './ContributorComponent.scss';

type Props = {
  owner?: Project['owner'] | null; // => User
  members?: Project['members']; // => ProjectMember[]
};

export default function ContributorComponent({ owner, members }: Props) {
  return (
    <div className="contributor-component">
      <div className="contributor-left">
        <h5>Contributeurs</h5>
        <p>{members ? members.length + 1 : 1} personnes</p>
      </div>
      <div className="contributor-right">
        <span className="contributor-avatar contributor-avatar-owner" title={owner?.name}>
          {getInitials(owner?.name || '')}
        </span>
        <span className="owner-pill-contributor">Propriétaire</span>

        {members?.map((member) => (
          <div key={member.id} className='avatar-container'>
            <span className="contributor-avatar" title={member.user.name}>{getInitials(member.user.name)}</span>
            <span className='avatar-name'>{member.user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
