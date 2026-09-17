type MemberRole = "leader" | "member";

type StudyMember = {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
};

const members: StudyMember[] = [
    { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
    { id: 2, name: "지수", role: "member" },
];

function getMemberIntro(id: number): string {
    const member = members.find((m) => m.id === id);
    if (!member) {
        return "해당 ID의 회원을 찾을 수 없어요.";
    }

    const githubText = member.githubId ?? "등록되지 않음";
    const roleText = member.role === "leader" ? "리더" : "멤버";

    return member.name + " 님 (" + roleText + ", GitHub: " + githubText + ")";
}

console.log(getMemberIntro(1));
console.log(getMemberIntro(2));
console.log(getMemberIntro(999));