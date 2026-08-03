import Badge, { statusTone } from './Badge';
import { TASK_STATUS_LABELS, PLAN_STATUS_LABELS } from '@/constants/statuses';

export default function StatusBadge({ status, type = 'task' }) {
  const labels = type === 'plan' ? PLAN_STATUS_LABELS : TASK_STATUS_LABELS;
  const tone = statusTone(status);
  return (
    <Badge tone={tone} dot>
      {labels[status] || status}
    </Badge>
  );
}
