/* 필수미션:스터디 회원 관리 프로그램 완성하기 */

type StudyMember = {
    id: number;
    name: string;
    role: string;
    githubId?: string;
};

const members: StudyMember[] = [
    { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
    { id: 2, name: "우진", role: "member" },
];

function getMemberInfo(id: number): string {
    const member = members.find((member) => member.id === id);

    if (!member) return `ID ${id} | 회원을 찾을 수 없습니다.`;
    const github = member.githubId ?? "없음";
    return `ID ${member.id} | 이름: ${member.name} | 역할: ${member.role} | GitHub: ${github}`;
}

console.log(getMemberInfo(1)); // ID 1 | 이름: 광수 | 역할: leader | GitHub: gwangsoo 
console.log(getMemberInfo(2)); // ID 2 | 이름: 우진 | 역할: member | GitHub: 없음 
console.log(getMemberInfo(99));// ID 99 | 회원을 찾을 수 없습니다.