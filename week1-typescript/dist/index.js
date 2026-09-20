"use strict";
const members = [
    { id: 1, name: "민혁", role: "스터디원", githubID: "Minhyuk0722" },
    { id: 2, name: "주헌", role: "스터디장", githubID: "wngjs8114" },
];
function findMember(memberId) {
    const foundMember = members.find((member) => member.id === memberId);
    if (!foundMember) {
        console.log('ID가 존재하지 않습니다.');
        return;
    }
    const githubInfo = foundMember.githubID
        ? `GitHub ID: ${foundMember.githubID}`
        : 'GitHub ID가 존재하지 않습니다.';
    console.log(`ID: ${foundMember.id}, Name: ${foundMember.name}, Role: ${foundMember.role}, ${githubInfo}`);
}
findMember(1);
findMember(2);
findMember(999);
