interface StudyMember {
    id: number;
    name: string;
    role: "leader" | "member";
    githubId?: string;
}

const members: StudyMember[] = [
    { id: 1, name: "밍", role: "member", githubId: "chewing020520"},
    { id: 2, name: "팝콘", role: "member", githubId: "popcorn"},
];

function findMember(id: number): StudyMember | undefined {
    return members.find((member)=>member.id === id);
}

function createMemberMessage(id: number): string {
    const member = findMember(id);

    if(member === undefined){
        return `ID ${id}번 회원을 찾을 수 없어요.`;
    }

    const roleLabel = member.role === "leader" ? "스터디장" : "스터디원";
    const github = member.githubId ?? "등록되지 않음";

    return `${member.name}님은 ${roleLabel}이고, 깃허브 아이디는 ${github}`;

}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(99));
