import { useDatabase } from '../context/DatabaseContext';
import type { Skill } from '../context/DatabaseContext';

interface RadarChartProps {
  studentId: string;
  skills: Skill[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ studentId, skills }) => {
  const { masteryRecords } = useDatabase();

  const center = 150;
  const radius = 100;
  const levelsCount = 5; // 5 levels: Novice(1), Advanced Beginner(2), Competent(3), Proficient(4), Expert(5)
  const totalSkills = skills.length; // should be 5

  // Map mastery levels to numeric values (1 to 5)
  const getLevelValue = (level: string): number => {
    switch (level) {
      case 'excellent':
        return 5; // Expert
      case 'meets_expectations':
        return 3; // Competent (Course Target)
      case 'needs_improvement':
        return 1.5; // Advanced beginner/needs improvement
      case 'none':
      default:
        return 0; // Novice
    }
  };

  // Get coordinates for a given skill index and value
  const getCoordinates = (index: number, value: number) => {
    // Offset by -Math.PI / 2 to start at the top
    const angle = (index * 2 * Math.PI) / totalSkills - Math.PI / 2;
    const distance = (value / 5) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // 1. Grid lines (background pentagons for levels 1 to 5)
  const gridPentagons = [];
  for (let i = 1; i <= levelsCount; i++) {
    const points: string[] = [];
    for (let j = 0; j < totalSkills; j++) {
      const { x, y } = getCoordinates(j, i);
      points.push(`${x},${y}`);
    }
    gridPentagons.push({
      level: i,
      pointsString: points.join(' ')
    });
  }

  // 2. Target "Competent" (Level 3) polygon points
  const targetPoints: string[] = [];
  for (let j = 0; j < totalSkills; j++) {
    const { x, y } = getCoordinates(j, 3);
    targetPoints.push(`${x},${y}`);
  }
  const targetPointsString = targetPoints.join(' ');

  // 3. User's actual competency levels
  const userPoints: string[] = [];
  const skillValues = skills.map((skill, index) => {
    const record = masteryRecords.find(r => r.student_id === studentId && r.skill_id === skill.id);
    const val = record ? getLevelValue(record.mastery_level) : 0;
    const { x, y } = getCoordinates(index, val);
    userPoints.push(`${x},${y}`);
    return { name: skill.name.split(' (')[0], value: val, x, y };
  });
  const userPointsString = userPoints.join(' ');

  // Radial axis lines
  const axisLines = skills.map((_, index) => {
    const start = { x: center, y: center };
    const end = getCoordinates(index, 5);
    return { start, end };
  });

  return (
    <div className="flex flex-col items-center p-6 bg-white border border-[#3E5E63]/20 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#214C54]/5 to-transparent pointer-events-none" />
      <h3 className="text-xl font-bold text-[#15333B] mb-2">Hải Đồ Năng Lực</h3>
      <p className="text-xs text-[#3E5E63] mb-6 text-center max-w-sm">
        Vạch liền màu <span className="text-[#EAB308] font-bold">Vàng</span> thể hiện năng lực hiện tại của bạn. Vòng tròn <span className="text-[#214C54] font-bold">Xanh</span> là mục tiêu tốt nghiệp (Level 3 - Competent).
      </p>

      <svg width="320" height="320" className="drop-shadow-md">
        {/* Draw background grid lines */}
        {gridPentagons.map((pent, i) => (
          <polygon
            key={`grid-${i}`}
            points={pent.pointsString}
            fill="none"
            stroke="#3E5E63"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        ))}

        {/* Draw axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="#3E5E63"
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}

        {/* Target Level 3 Pentagon (Competent) */}
        <polygon
          points={targetPointsString}
          fill="rgba(33, 76, 84, 0.05)"
          stroke="#214C54"
          strokeWidth="2"
          strokeDasharray="4,4"
          strokeOpacity="0.6"
        />

        {/* User Level Pentagon */}
        {userPointsString.trim() && (
          <>
            <polygon
              points={userPointsString}
              fill="rgba(234, 179, 8, 0.2)"
              stroke="#EAB308"
              strokeWidth="3.5"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-out"
            />
            {/* Draw data dots for student */}
            {skillValues.map((sv, idx) => (
              <g key={`dot-${idx}`}>
                <circle
                  cx={sv.x}
                  cy={sv.y}
                  r="6"
                  fill="#EAB308"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="hover:scale-150 transition-all duration-300 cursor-pointer"
                />
                {/* Tiny labels near endpoints */}
                {(() => {
                  const angle = (idx * 2 * Math.PI) / totalSkills - Math.PI / 2;
                  const labelRadius = radius + 22;
                  const lx = center + labelRadius * Math.cos(angle);
                  const ly = center + labelRadius * Math.sin(angle);
                  let textAnchor: 'middle' | 'start' | 'end' = 'middle';
                  if (Math.cos(angle) > 0.1) textAnchor = 'start';
                  if (Math.cos(angle) < -0.1) textAnchor = 'end';
                  
                  // Label text splits
                  let name = sv.name;
                  if (name.includes('Năng lực ')) name = name.replace('Năng lực ', '');
                  
                  return (
                    <text
                      x={lx}
                      y={ly + 4}
                      textAnchor={textAnchor}
                      fill="#15333B"
                      fontSize="9"
                      fontWeight="bold"
                      className="select-none"
                    >
                      {name} (Lvl {sv.value})
                    </text>
                  );
                })()}
              </g>
            ))}
          </>
        )}
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 w-full border-t border-gray-100 pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block border border-white shadow-sm" />
          <span>Hải trình của bạn</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 block border border-white shadow-sm" />
          <span>Mốc Competent (Tốt nghiệp)</span>
        </div>
      </div>
    </div>
  );
};
