type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function createMemberMessage(memberId: number) {
  const foundMember = members.find(
    (member) => member.id === memberId
  );

  if (!foundMember) {
    return "회원을 찾지 못했어요.";
  }

  const githubId = foundMember.githubId ?? "등록되지 않음";

  return (
    foundMember.name +
    " / 역할: " +
    foundMember.role +
    " / GitHub: " +
    githubId
  );
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));

const studyHour: number | undefined = 0;

console.log(studyHour || 1);
console.log(studyHour ?? 1);
