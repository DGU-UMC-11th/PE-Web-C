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


// 선택 미션 1: type과 interface 비교
// StudyMember와 동일한 구조로 작성

type StudyMemberByType = {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
};

interface StudyMemberByInterface {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
}

/*
1. type과 interface 모두 객체의 모양(프로퍼티와 타입)을 정의할 수 있어 이번처럼 단순한 회원 객체 표현에는 둘 다 동일하게 쓸 수 있다.
2. type은 &로 여러 타입을 합치는 교차 타입과 원시 타입 별칭·유니언까지 표현 가능하지만, interface는 주로 객체 모양만 표현하고 대신 extends로 확장한다.
3. interface는 같은 이름으로 다시 선언하면 자동으로 합쳐지지만, type은 같은 이름으로 재선언이 불가능하다.
*/


// 선택 미션 2: || vs ??
const studyHour: number | undefined = 0;

console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0

/*
studyHour의 값은 0인데, 0은 falsy이므로 ||는 왼쪽 값을 falsy로 판단해 오른쪽 기본값 1을 사용한다.
반면 ??는 왼쪽 값이 null 또는 undefined일 때만 오른쪽 기본값을 사용하는데, 0은 null도 undefined도 아니므로 그대로 0을 유지한다.
즉 0이나 빈 문자열처럼 falsy이지만 유효한 값을 지켜야 할 때는 ??를 써야 한다.
*/


// 선택 미션 3: formatMemberId(input: unknown)
function formatMemberId(input: unknown): string {
    if (typeof input === "number") {
        return "숫자 ID: " + input;
    }
    
    if (typeof input === "string") {
        return "문자열 ID: " + input;
    }
    
    return "알 수 없는 형식의 ID예요.";
}

console.log(formatMemberId(1));     // 숫자 ID: 1
console.log(formatMemberId("abc")); // 문자열 ID: abc
console.log(formatMemberId(true));  // 알 수 없는 형식의 ID예요.
