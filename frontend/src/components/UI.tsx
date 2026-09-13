interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScore({ score, size = 'md' }: MatchScoreProps) {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-green-500 text-white';
    if (s >= 60) return 'bg-yellow-500 text-white';
    if (s >= 40) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg',
  };

  return (
    <div className={`rounded-full flex items-center justify-center font-bold ${getColor(score)} ${sizeClasses[size]}`}>
      {score}%
    </div>
  );
}

interface SkillBadgeProps {
  name: string;
  level?: string;
}

export function SkillBadge({ name, level }: SkillBadgeProps) {
  return (
    <span className="badge badge-blue">
      {name}
      {level && <span className="ml-1 text-xs opacity-75">({level})</span>}
    </span>
  );
}

interface InterestBadgeProps {
  name: string;
}

export function InterestBadge({ name }: InterestBadgeProps) {
  return <span className="badge badge-purple">{name}</span>;
}

interface RoleBadgeProps {
  name: string;
}

export function RoleBadge({ name }: RoleBadgeProps) {
  return <span className="badge badge-green">{name}</span>;
}

interface MatchReasonsProps {
  reasons: string[];
}

export function MatchReasons({ reasons }: MatchReasonsProps) {
  if (!reasons || reasons.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700 mb-1">Why this match?</p>
      <ul className="text-sm text-gray-600 space-y-1">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start">
            <span className="text-accent-500 mr-2">•</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: string;
}

export function ProgressBar({ value, label, color = 'bg-primary-500' }: ProgressBarProps) {
  return (
    <div>
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
