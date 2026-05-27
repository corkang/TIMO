# 서버 개발 학습 노트

> TIMO 프로젝트의 `server/` 코드를 분석하며 백엔드 개발의 핵심 개념을 정리한 문서.
> 각 섹션 마지막에 **핵심 요약**과 **코드 평가**가 있어 복습에 활용할 수 있다.

---

## 목차

1. [서버의 큰 그림](#1-서버의-큰-그림)
2. [Model — DB 테이블의 코드 표현](#2-model-모델--db-테이블의-코드-표현)
3. [Controller — 요청을 처리하는 비즈니스 로직](#3-controller-컨트롤러--요청을-처리하는-비즈니스-로직)
4. [Router — 컨트롤러에 URL을 연결](#4-router-라우터--컨트롤러에-url을-연결)
5. [Middleware — 요청 전후의 공통 처리](#5-middleware-미들웨어--요청-전후의-공통-처리)
6. [app.js — 모든 걸 합치는 진입점](#6-appjs--모든-걸-합치는-진입점)
7. [전체 요청 흐름 (종합)](#7-전체-요청-흐름-종합)
8. [인증 시스템 — OAuth, JWT, Session의 이해](#8-인증-시스템--oauth-jwt-session의-이해)
9. [lib/passport.js — 인증 전략 설정의 중심](#9-libpassportjs--인증-전략-설정의-중심)
10. [나머지 폴더들 — utils, config, services](#10-나머지-폴더들--utils-config-services)
11. [TIMO vs 현업 구조 비교](#11-timo-vs-현업-구조-비교)

---

## 1. 서버의 큰 그림

### 서버 개발 흐름

```
1. DB 구축: 스키마대로 테이블 생성
2. 백엔드 API 개발:
   2.1 모델(Model) 정의
   2.2 컨트롤러(Controller) 작성
   2.3 라우터(Router) 설정
   2.4 미들웨어 (인증, 에러 핸들링)
3. 프론트엔드 개발: API 연동
4. 통합: 프론트-백엔드 연결 테스트
```

### 레스토랑 비유

| 레스토랑 | 서버 | TIMO 코드 |
|---------|------|-----------|
| 주방 냉장고 (재료 보관) | **DB** | MySQL 데이터베이스 |
| 레시피 카드 (재료를 어떻게 꺼낼지) | **Model** | `models/` |
| 셰프 (주문 받고 요리) | **Controller** | `controllers/` |
| 웨이터 (손님 요청을 셰프에게 전달) | **Router** | `routes/` |
| 입구 직원 (예약 확인, 드레스코드) | **Middleware** | `middlewares/` |
| 레스토랑 건물 자체 | **App** | `app.js` |

### 요청 처리 순서

```
[프론트엔드]
    ↓ HTTP 요청 (예: GET /api/user)
[app.js] → CORS → JSON 파싱 → Passport 초기화
    ↓
[routes/index.js] → URL 매칭 + 인증 미들웨어
    ↓
[routes/user.js] → HTTP 메서드 + 세부 경로 매칭
    ↓
[controllers/user.js] → 비즈니스 로직 (Model로 DB 조작)
    ↓
[models/user.js] → Sequelize가 SQL 생성 → MySQL 실행
    ↓ 데이터 반환
[controllers/user.js] → res.send(데이터)
    ↓
[프론트엔드] ← 응답 수신
```

### TIMO 서버 폴더 구조

```
server/
├── app.js                    ← 서버 진입점. 미들웨어 등록 + 라우터 연결
├── bin/www                   ← 서버 실행 스크립트 (포트 설정)
├── models/                   ← DB 테이블 정의 (Sequelize 모델)
│   ├── index.js              ← 모든 모델 자동 로드 + DB 연결
│   ├── user.js               ← User 테이블
│   ├── lecture.js             ← Lecture 테이블
│   ├── timetable.js           ← Timetable 테이블
│   ├── course_review.js       ← CourseReview 테이블
│   ├── feedback.js            ← Feedback 테이블 (유저 피드백)
│   ├── search.js              ← Search 모델 (검색 관련)
│   ├── spike_email_log.js     ← SpikeEmailLog 테이블 (이삭줍기 이메일 발송 기록)
│   └── *_relation.js          ← N:N 관계의 중간 테이블들
├── controllers/               ← 비즈니스 로직 (Model을 사용해 데이터 처리)
│   ├── user.js
│   ├── timetable.js
│   ├── review.js
│   ├── search.js
│   └── share.js
├── routes/                    ← URL + HTTP 메서드 → Controller 연결
│   ├── index.js               ← 모든 라우트를 묶고 인증 미들웨어 배치
│   ├── auth.js, user.js, timetable.js, review.js, share.js
├── middlewares/                ← 요청 전/후 공통 처리
│   ├── auth.js                ← JWT 토큰 검증 (Passport.js)
│   └── error.js               ← 에러 처리
├── lib/passport.js            ← Google OAuth + JWT Strategy 설정
└── utils/                     ← 유틸리티 (상수, 쿼리 헬퍼)
```

---

## 2. Model (모델) — DB 테이블의 코드 표현

### ORM이란?

**ORM (Object-Relational Mapping)** 은 SQL 대신 JavaScript 코드로 DB를 조작할 수 있게 해주는 번역기다.
TIMO는 **Sequelize**라는 ORM을 사용한다.

```js
// SQL 직접 작성 — 결과가 평평한 배열, 직접 구조화해야 함
const result = await db.query(`
  SELECT t.*, l.*
  FROM Timetable t
  JOIN timetableLectureRelation tlr ON t.id = tlr.timetableId
  JOIN Lecture l ON tlr.lectureId = l.id
  WHERE t.userId = ?
`, [userId]);

// Sequelize (ORM) — 결과가 중첩 JS 객체로 자동 구조화됨
const timetables = await Timetable.findAll({
  where: { userId },
  include: [{ model: Lecture }]
});
// → { id, title, lectures: [...] }
```

| | SQL 직접 사용 | Sequelize (ORM) |
|--|--------------|-----------------|
| **간단한 쿼리** | 깔끔하고 직관적 | 오히려 장황할 수 있음 |
| **복잡한 JOIN** | 직접 다 작성 | `include`로 자동 처리 |
| **결과 형태** | 평평한 행(row) 배열 | 중첩된 JS 객체 |
| **DB 변경** | SQL 수동 수정 | 모델 수정 → 자동 반영 가능 |
| **보안** | SQL Injection 직접 방어 | 자동 방어 |
| **DB 종류 변경** | 쿼리 전부 다시 작성 | 설정만 변경 (MySQL→PostgreSQL) |

> 실무에서는 **ORM + 필요시 Raw SQL**을 섞어 쓰는 게 일반적이다.
> Sequelize에서도 `sequelize.query()`로 직접 SQL 실행이 가능하다.

### Sequelize 없이 DB를 사용하면?

ORM 없이는 **mysql2 같은 DB 드라이버**로 직접 SQL을 작성해야 한다:

```js
// Sequelize 사용
const User = require('../models/user');
const user = await User.findOne({ where: { id: userId } });

// mysql2 직접 사용 (ORM 없이)
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host: '...', user: '...', password: '...', database: '...' });
const [rows] = await pool.execute('SELECT * FROM User WHERE id = ?', [userId]);
const user = rows[0];
```

> `User.findOne()`이 가능한 건 Sequelize가 `findOne()`, `create()`, `destroy()` 같은
> DB 조작 메서드를 User 클래스에 자동으로 붙여주기 때문이다.

### 모델의 구조: 두 파트

모든 모델은 동일한 뼈대를 따른다:

```js
class [이름] extends Model {
    static init(sequelize) { ... }      // 파트 1: 컬럼 정의
    static associate(models) { ... }    // 파트 2: 관계 정의 (선택)
}
module.exports = [이름];
```

#### 파트 1: `init()` — 테이블의 컬럼(열) 정의

```js
// models/user.js
static init(sequelize) {
    return super.init(
      {
        email: DataTypes.TEXT,           // 단순한 컬럼: 타입만 지정
        lastLoggedInAt: DataTypes.DATE,
        viewCount: {                     // 상세한 컬럼: 타입 + 옵션
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        tableName: 'User',      // 실제 DB 테이블 이름
        modelName: 'user',      // 코드에서 참조할 이름
        sequelize,              // DB 연결 객체
      },
    );
  }
```

위 코드가 나타내는 실제 DB 테이블:

| id | email | lastLoggedInAt | viewCount | createdAt | updatedAt |
|----|-------|----------------|-----------|-----------|-----------|
| 1 | kim@handong.edu | 2024-03-01 | 5 | ... | ... |
| 2 | lee@handong.edu | 2024-03-02 | 0 | ... | ... |

> `id`, `createdAt`, `updatedAt`는 Sequelize가 자동 생성하므로 코드에 안 써도 된다.

#### 파트 2: `associate()` — 다른 테이블과의 관계 정의

```js
// models/user.js
static associate(models) {
    this.belongsToMany(models.lecture, { through: 'userLectureRelation', as: 'bookmarks' });
    this.belongsToMany(models.lecture, { through: 'userLectureGleaningRelation', as: 'spikes' });
    this.hasMany(models.timetable, { foreignKey: 'userId', targetKey: 'id' });
    this.hasMany(models.courseReview, { foreignKey: 'userId', as: 'reviews' });
  }
```

### 관계(Association) 종류

| 관계 | 의미 | TIMO 예시 |
|------|------|-----------|
| `hasMany` | 1:N (하나가 여러 개를 가짐) | 유저 1명 → 시간표 여러 개 |
| `belongsTo` | N:1 (hasMany의 반대) | 시간표 → 유저 1명에게 속함 |
| `belongsToMany` | N:N (다대다, 중간 테이블 필요) | 유저 ↔ 강의 (즐겨찾기) |

> `belongsToMany`는 **양쪽 모델에서 서로 선언**해야 한다.
> User→Lecture를 선언했으면, Lecture→User도 선언해야 한다.

### foreignKey — ERD의 필드 간 연결선

ERD에서 보이는 필드 간 연결선을 코드에서 표현하는 게 `foreignKey`다:

```
ERD:
User                          Timetable
┌──────────┐                 ┌──────────────┐
│ id (PK)  │────────────────→│ userId (FK)  │
│ email    │      1 : N      │ title        │
└──────────┘                 └──────────────┘

코드:
// User 모델
this.hasMany(models.timetable, {
  foreignKey: 'userId',    // Timetable의 userId 필드가 나(User)의 id를 가리킨다
  targetKey: 'id',         // 내 쪽의 id 필드를 (생략 시 기본값 id)
});

// Timetable 모델
this.belongsTo(models.user, {
  foreignKey: 'userId',    // 내 userId 필드가 User를 가리킨다
  targetKey: 'id',
});
```

| ERD에서 보이는 것 | 코드에서의 표현 |
|------------------|---------------|
| 테이블 간 관계선 (1:N, N:N) | `hasMany`, `belongsTo`, `belongsToMany` |
| 필드 간 연결선 | `foreignKey: '...'` 옵션 |
| PK (Primary Key) | `targetKey: 'id'` (보통 생략) |
| FK (Foreign Key) | `foreignKey: 'userId'` 등 |

N:N 관계에서는 중간 테이블이 FK를 가진다:

```
User          userLectureRelation       Lecture
┌────┐       ┌─────────┬──────────┐    ┌────┐
│ id │←──FK──│ userId   │ lectureId│──FK→│ id │
└────┘       └─────────┴──────────┘    └────┘
```

> `foreignKey`를 생략하면 Sequelize가 `모델이름 + Id` 형태로 자동 생성한다 (예: `userId`).
> 동작하지만, **명시적으로 쓰는 게** 가독성에 좋다.

### N:N 관계에 중간 테이블이 필요한 이유

시간표 ↔ 강의는 N:N 관계. 중간 테이블 없이 콤마로 넣으면:

```
| id | title      | lectureIds     |
|----|------------|----------------|
| 1  | 내 시간표   | 10, 23, 45     |  ← 문제 발생!
```

- "강의 23이 포함된 시간표 찾기" → 문자열 검색, 느리고 부정확
- "강의 45 삭제" → 모든 행의 문자열을 파싱해서 수정
- 강의 100개면 한 칸에 100개 ID를 넣어야 함

중간 테이블을 쓰면:

```
Timetable                timetableLectureRelation         Lecture
| id | title    |        | timetableId | lectureId |     | id | name       |
|----|----------|        |-------------|-----------|     |----|------------|
| 1  | 내 시간표 |   ←──  | 1           | 10        | ──→ | 10 | 자료구조    |
| 2  | 보조     |   ←──  | 1           | 23        | ──→ | 23 | 알고리즘    |
                    ←──  | 1           | 45        | ──→ | 45 | 운영체제    |
                    ←──  | 2           | 10        | ──→ |    |            |
```

- `WHERE lectureId = 23` → 강의 23이 포함된 시간표 즉시 조회
- `WHERE timetableId = 1` → 시간표 1의 강의 목록 즉시 조회
- 추가/삭제는 행 하나만 조작

> **관계형(Relational) DB**라는 이름이 여기서 나왔다. 테이블 간 관계를 별도 테이블로 표현하는 게 핵심이며, **정규화 이론**에 근거한 설계다.

### TIMO 모델 관계도

```
User (유저)
  ├── hasMany → Timetable (시간표 여러 개 소유)
  ├── hasMany → CourseReview (강의평 여러 개 작성)
  ├── belongsToMany ↔ Lecture (즐겨찾기, through: userLectureRelation)
  └── belongsToMany ↔ Lecture (이삭줍기, through: userLectureGleaningRelation)

Timetable (시간표)
  ├── belongsTo → User (한 유저에게 속함)
  └── belongsToMany ↔ Lecture (강의 포함, through: timetableLectureRelation)

Lecture (강의)
  ├── belongsToMany ↔ Timetable
  ├── belongsToMany ↔ User (즐겨찾기)
  └── belongsToMany ↔ User (이삭줍기)
```

### models/index.js — 모든 모델 자동 등록

3단계로 동작한다:

**단계 1: DB 연결** — `.env`의 정보로 MySQL 접속

```js
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
  host: DB_HOST,
  dialect: 'mysql',
});
```

**단계 2: 모든 모델 파일 자동 로드**

```js
fs.readdirSync(__dirname)       // models/ 폴더 파일 목록
  .filter(...)                   // index.js, 숨김파일 제외
  .forEach((file) => {
    const model = require(file).init(sequelize);  // 각 모델의 init() 호출
    db[model.name] = model;                        // db 객체에 저장
  });
```

**단계 3: 관계 설정**

```js
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) model.associate(db);  // 각 모델의 associate() 호출
});
```

> Sequelize 공식 문서에서 권장하는 **자동 로딩 패턴**이다.
> 새 모델 파일을 `models/`에 넣기만 하면 자동 등록된다.

### sequelize.sync() — 모델을 실제 DB에 반영

모델을 정의했다고 DB 테이블이 자동으로 생기지는 않는다. `sync()` 호출이 필요하다:

```js
await sequelize.sync();                    // 테이블 없으면 생성 (있으면 무시)
await sequelize.sync({ force: true });     // 테이블 삭제 후 다시 생성 (데이터 소실!)
await sequelize.sync({ alter: true });     // 모델과 다른 부분만 자동 수정 (주의)
```

TIMO는 `app.js`에서 `sequelize.sync({ alter: true })` 사용 중:

| 환경 | 적합성 | 이유 |
|------|-------|------|
| 개발 | 편리 | 모델 바꾸면 자동 반영 |
| 프로덕션 | **위험** | 컬럼 변경/삭제 시 데이터 소실 가능 |
| 프로덕션 권장 | **Migration** | DB 변경을 버전 관리하며 안전하게 적용 |

### 핵심 요약

> **Model = DB 테이블의 JS 표현.**
> `init()`으로 컬럼을, `associate()`로 테이블 간 관계를 정의한다.
> Sequelize(ORM)를 통해 SQL 대신 JS 코드로 DB를 조작할 수 있다.

### 코드 평가

**잘 된 점:**
- 모든 모델이 동일한 구조 (`init` + `associate`)를 따름
- 관계가 양쪽에서 올바르게 선언됨
- `as` 별칭으로 같은 테이블 간 다중 관계를 구분 (`bookmarks` vs `spikes`)
- `index.js`가 자동 로딩 패턴 사용

**아쉬운 점:**
- `yebi1~4` 같은 컬럼명이 의미 불분명
- `gubun`, `hakbu` (한국어 로마자)와 `professor` (영어)가 혼재 → 네이밍 비일관
- `models/index.js`의 pool 옵션이 mysql2 형식(`connectionLimit`)을 사용 — Sequelize 공식 형식은 `max`, `min`, `idle`이지만 내부적으로 mysql2에 전달되어 동작은 함
- `sync({ alter: true })`를 프로덕션에서 사용 → Migration 전환 필요

---

## 3. Controller (컨트롤러) — 요청을 처리하는 비즈니스 로직

### Controller가 하는 일

프론트엔드에서 요청이 오면 **그 요청을 실제로 처리하는 코드**가 Controller다:

1. 요청을 받고 → `req` (request)
2. Model을 사용해 DB 조작 →
3. 결과를 응답 → `res` (response)

```js
// controllers/timetable.js
exports.createTimetable = async (req, res) => {
  const timetable = await Timetable.create({  // Model로 DB에 저장
    userId: req.user.id,                       // 로그인한 유저 (미들웨어가 설정)
    title: req.body.title,                     // 프론트에서 보낸 데이터
  });
  res.status(201).send(timetable);             // 생성된 객체를 응답
};
```

> 모든 컨트롤러 함수는 `(req, res) => { ... }` 형태. Express 프레임워크 규칙이다.

### req에서 데이터 꺼내는 3가지 방법

| 출처 | 용도 | 예시 |
|------|------|------|
| `req.params` | URL 경로의 값 | `/timetable/:timetableId` → `req.params.timetableId` |
| `req.body` | POST/PUT 요청 본문 | `{ title: "내 시간표" }` → `req.body.title` |
| `req.user` | 로그인 유저 (미들웨어가 설정) | `req.user.id` |

> `+req.params.timetableId`의 `+`는 문자열→숫자 변환. URL 파라미터는 항상 문자열이다.

### CRUD 패턴

거의 모든 백엔드 기능의 기본. "데이터를 만들고, 읽고, 수정하고, 삭제하는" 네 가지 작업이다.

| 동작 | 함수 | Sequelize 메서드 | HTTP 메서드 |
|------|------|------------------|------------|
| **C**reate (생성) | `createTimetable` | `Timetable.create()` | POST |
| **R**ead (조회) | `getTimetable` | `Timetable.findOne()` | GET |
| **U**pdate (수정) | `updateTimetable` | `Timetable.update()` | PUT |
| **D**elete (삭제) | `deleteTimetable` | `Timetable.destroy()` | DELETE |

### 응답(Response) 설계

#### 생성 시 객체를 돌려주는 이유

```js
// 객체를 돌려주면 → 프론트에서 id를 바로 알 수 있음
const response = await axios.post('/api/timetable', { title: '내 시간표' });
// response.data = { id: 42, title: '내 시간표', userId: 1 }

// 201 상태만 돌려주면 → id를 모르니 GET 요청을 또 보내야 함
```

#### 일관적인 응답 형식이 중요

```js
// 좋은 예: 일관적
res.status(201).send(timetable);       // 생성 → 201 + 생성된 객체
res.send({ success: true });           // 수정/삭제 → 200 + 통일된 형태

// TIMO 현재 (비일관적)
res.send(timetable);                   // 어떤 건 객체
res.send('complete');                  // 어떤 건 문자열
```

### 하나의 API가 너무 많은 일을 하면?

TIMO의 `getUser`는 `GET /api/user` 한 번으로 유저+시간표+즐겨찾기+이삭줍기+리뷰통계를 모두 반환한다.

```
방법 1: 한 번에 다 가져오기 (TIMO 현재)
  프론트 → GET /api/user → 모든 데이터 한방에
  장점: API 호출 1번, 프론트 코드 단순
  단점: 서버 함수 비대, 불필요한 데이터도 항상 포함, 느림

방법 2: 나눠서 가져오기
  GET /api/user          → 유저 기본 정보
  GET /api/user/bookmark → 즐겨찾기
  GET /api/timetable     → 시간표
  장점: 각 함수 단순, 필요한 것만 요청 가능
  단점: API 호출 여러 번, 프론트에서 조합 필요
```

> TIMO 규모에서는 방법 1도 문제없지만, 유지보수 관점에서는 방법 2가 낫다.
> 실무에서는 **핵심 데이터는 한 번에, 부가 데이터는 별도 호출**로 절충한다.

### 핵심 요약

> **Controller = 요청을 받아 Model로 DB를 조작하고 응답을 보내는 함수.**
> `(req, res) => { ... }` 형태이며, CRUD 패턴이 기본이다.

### 코드 평가

**잘 된 점:**
- timetable 컨트롤러는 CRUD가 깔끔하게 분리됨
- `exports.함수명` 패턴으로 일관된 export

**아쉬운 점:**
- **에러 처리 전무** — `try/catch`가 없어 DB 오류 시 서버 크래시 가능
- **`getUser` 과부하** — 접속 기록 + 데이터 조회 + 통계 계산을 한 함수에서 처리
- **응답 비일관** — 객체/문자열 혼재
- **권한 검증 부재** — `updateTimetable`에서 남의 시간표도 수정 가능 (보안 이슈)

---

## 4. Router (라우터) — 컨트롤러에 URL을 연결

### Router의 역할

**"어떤 URL + 어떤 HTTP 메서드"로 요청이 오면 → "어떤 Controller 함수"를 실행할지** 연결한다.

```js
// routes/timetable.js — URL 구조가 한눈에 보임
router.get('/:timetableId', timetableController.getTimetable);
router.post('/', timetableController.createTimetable);
router.put('/', timetableController.updateTimetable);
router.delete('/:timetableId', timetableController.deleteTimetable);
```

### 왜 Controller와 분리하는가?

Router에서 로직까지 다 쓰면 URL 구조 파악이 어렵고, 파일이 수백 줄로 비대해진다.

> 프론트에서 컴포넌트(UI)와 커스텀 훅(로직)을 분리하는 것과 같은 원리다.
> Route ≈ 컴포넌트 (구조), Controller ≈ 커스텀 훅 (로직).
> 이를 **관심사의 분리 (Separation of Concerns)** 라고 한다.

### HTTP 메서드 + URL = 하나의 API

같은 URL이라도 **HTTP 메서드가 다르면 다른 API**다:

```js
router.get('/',  ...);    // GET  /api/user  → 유저 조회
router.post('/', ...);    // POST /api/user  → 유저 생성
router.put('/',  ...);    // PUT  /api/user  → 유저 수정
```

TIMO user 라우터의 전체 API 목록:

| 메서드 | 경로 | 컨트롤러 |
|--------|------|---------|
| GET | `/` | getUser |
| POST | `/feedback` | createFeedback |
| GET | `/bookmark` | getBookmarks |
| POST | `/bookmark/:lectureId` | bookmarkLecture |
| DELETE | `/bookmark/:lectureId` | unbookmarkLecture |
| POST | `/spike/:lectureId` | addSpikeLecture |
| DELETE | `/spike/:lectureId` | deleteSpikeLecture |

### URL 경로가 합쳐지는 구조

`routes/index.js`에서 각 라우터에 접두사를 붙인다:

```js
// routes/index.js
router.use('/user', userRouter);            // user.js의 '/'는 실제로 '/user/'
router.use('/timetable', timetableRouter);  // timetable.js의 '/'는 '/timetable/'
```

```
app.js         + routes/index.js  + routes/user.js    = 실제 URL
'/api'           '/user'            '/'                  /api/user/
                 '/user'            '/bookmark'          /api/user/bookmark
                 '/timetable'       '/:timetableId'      /api/timetable/42
```

### routes/index.js의 미들웨어 배치

```js
router.use('/auth', authRouter);       // 인증 불필요 (로그인 전)
router.use('/share', shareRouter);     // 인증 불필요 (공유 링크)

router.use(isValidJwtToken);           // ← 이 줄 아래는 전부 로그인 필수!

router.use('/timetable', timetableRouter);  // 로그인 필수
router.use('/user', userRouter);            // 로그인 필수
router.use('/review', reviewRouter);        // 로그인 필수
```

> `router.use(isValidJwtToken)` **한 줄로 아래의 모든 라우트에 인증을 적용**한다.
> 이것이 미들웨어의 힘이다.

### 핵심 요약

> **Router = "URL + HTTP 메서드"를 Controller 함수에 연결하는 역할.**
> Controller와 분리하면 URL 구조가 한눈에 보이고, 로직 수정 시 Router를 건드릴 필요 없다.

---

## 5. Middleware (미들웨어) — 요청 전후의 공통 처리

### 미들웨어란?

요청이 Controller에 도달하기 **전** (또는 응답 **후**) 에 거치는 중간 처리 단계다.
레스토랑의 입구 직원이 "예약 확인 → 드레스코드 체크 → 자리 안내"를 하는 것과 같다.

### 미들웨어의 기본 형태

```js
const myMiddleware = (req, res, next) => {
  // 1. 뭔가 처리 (인증 확인, 로그 기록 등)
  // 2. 통과시킬지 결정:
  next();                        // ← 다음 미들웨어/Controller로 진행
  // 또는
  res.status(401).send('거부');   // ← 여기서 끊고 응답 (next 안 부름)
};
```

```
요청 → 미들웨어A → next() → 미들웨어B → next() → Controller
                                                      ↓
응답 ←──────────────────────────────────────── res.send()
```

**`next()`를 호출하면** 다음 단계로 넘어가고, **호출하지 않으면** 요청이 거기서 끝난다.

### `app.use()`의 등록 순서 = 실행 순서

```js
// app.js — 위에서 아래 순서대로 실행됨
app.use(cors({ ... }));               // 1. 허용 도메인 확인
app.use(logger('dev'));                // 2. 요청 로그 출력
app.use(express.json());              // 3. req.body 사용 가능하게 파싱
app.use(express.urlencoded({ ... })); // 4. URL 인코딩 파싱
app.use(passport.initialize());       // 5. 인증 시스템 초기화
app.use('/api', router);              // 6. 라우터 연결 (+ isValidJwtToken)
app.use(errorMiddleware);             // 7. 에러 처리 (맨 마지막)
```

> `express.json()`이 Router보다 **먼저** 와야 Controller에서 `req.body`를 쓸 수 있다.
> 순서가 바뀌면 `req.body`가 `undefined`가 된다.

### TIMO의 인증 미들웨어 — `middlewares/auth.js`

```js
const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // 헤더에서 토큰 추출
  secretOrKey: process.env.JWT_SECRET,                        // 비밀키로 검증
};

const JWTVerify = async ({ userId }, done) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (user) done(null, user);      // 성공: req.user에 저장될 유저 정보 전달
    else done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
exports.isValidJwtToken = passport.authenticate('jwt', { session: false });
```

동작 순서:

```
프론트 요청 헤더: "Authorization: Bearer eyJhbGciOi..."
  ↓
1. 헤더에서 토큰 추출           → eyJhbGciOi...
2. 비밀키로 토큰 해독           → { userId: 42 }
3. userId로 DB에서 유저 조회    → User { id: 42, email: 'kim@handong.edu' }
4. 유저가 있으면 req.user에 저장 → req.user = { id: 42, email: '...' }
5. Controller에서 사용          → req.user.id
```

> 그래서 Controller에서 `req.user.id`를 바로 쓸 수 있었던 것이다. **미들웨어가 미리 넣어준 것.**

#### done()과 next()의 관계

`auth.js`에는 `next()`가 없고 `done()`만 있다. 이건 **Passport 라이브러리가 `next()`를 대신 호출**해주는 구조다:

```
직접 미들웨어를 만들면:              Passport를 쓰면:
(req, res, next) => {               Passport가 내부적으로 감싸줌:
  // 토큰 검증                        (req, res, next) => {
  // 유저 조회                          토큰 추출 + 해독
  req.user = user;                      JWTVerify(payload, done) 호출
  next();  ← 직접 호출                   done 결과에 따라:
}                                         성공 → req.user 설정 + next() 자동 호출
                                          실패 → 401 응답 (next 안 부름)
                                      }
```

> 이런 패턴을 **제어 역전(Inversion of Control)** 이라고 한다.
> 내가 `next()`를 직접 부르는 게 아니라, 프레임워크(Passport)가 적절한 시점에 대신 호출한다.

#### auth.js는 app.js에서 직접 호출하지 않는데 어떻게 동작하는가?

연결 경로를 추적하면:

```
app.js
  ↓ 39줄: passportConfig()          → lib/passport.js 실행 (Google OAuth + JWT 전략 등록)
  ↓ 40줄: app.use('/api', router)   → routes/index.js 연결
      ↓
      routes/index.js
        ↓ 3줄: require('../middlewares/auth')   → auth.js 로드 (JWT 전략 등록 + isValidJwtToken export)
        ↓ 15줄: router.use(isValidJwtToken)      → 미들웨어로 등록!
        ↓
        이 아래 라우트들은 모두 isValidJwtToken을 거침
```

`app.js`가 직접 호출하는 게 아니라, **`routes/index.js`가 `auth.js`를 가져와서 미들웨어로 등록**하는 것이다.

### TIMO의 에러 미들웨어 — `middlewares/error.js`

```js
exports.errorMiddleware = (err, req, res, next) => {
  console.log(err);
  console.log(err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.message.includes('undefined')) err.status = HTTP_STATUS.BAD_REQUEST;

  res.status(err.status || HTTP_STATUS.SERVER_ERROR);
  res.send(err.message);
};
```

> **에러 미들웨어**는 파라미터가 **4개** `(err, req, res, next)`다.
> 일반 미들웨어는 3개 `(req, res, next)`.
> Express는 **파라미터 개수로** 에러 미들웨어를 판별하므로, 4개를 유지하는 게 중요하다.

### 핵심 요약

> **Middleware = Controller 전후에 실행되는 공통 처리 함수.**
> `next()`를 호출하면 다음 단계로, 안 하면 여기서 끊긴다.
> `app.use()` 등록 순서가 곧 실행 순서이며, 인증/로깅/에러처리 등에 사용한다.

### 코드 평가

**잘 된 점:**
- Passport.js + JWT로 표준적인 인증 방식 사용
- `routes/index.js`에서 미들웨어 배치로 인증 필요/불필요 라우트를 깔끔하게 분리
- CORS가 환경별(개발/프로덕션)로 올바르게 설정됨

**아쉬운 점:**
- **JWT Strategy가 두 곳에 중복 정의** — `middlewares/auth.js`와 `lib/passport.js` 모두 JWT Strategy를 등록하여 하나가 다른 하나를 덮어씀. `lib/passport.js`에는 Google OAuth만 두고, JWT는 `auth.js`에서만 관리하는 게 깔끔
- **에러 미들웨어가 빈약** — `err.message.includes('undefined')`로 에러를 판별하는 건 불안정
- **Controller에 `try/catch` 없음** — async 에러가 에러 미들웨어까지 전달되지 않을 수 있음 (Express 4에서는 async 에러를 자동으로 잡지 않음. Express 5에서는 자동 처리)

---

## 6. app.js — 모든 걸 합치는 진입점

`app.js`는 서버의 "본체"로, 별도로 복잡한 로직은 없다. 역할은 세 가지:

### 1. DB 연결 + 테이블 동기화

```js
const { sequelize } = require('./models');  // models/index.js가 DB 연결 + 모델 로드
sequelize.authenticate();                    // 연결 확인
sequelize.sync({ alter: true });             // 모델 기반으로 테이블 동기화
```

### 2. 미들웨어 등록 (순서가 실행 순서)

```js
app.use(cors({ ... }));               // 허용 도메인
app.use(logger('dev'));                // 요청 로그
app.use(express.json());              // req.body 파싱
app.use(passport.initialize());       // 인증 시스템
```

### 3. 라우터 + 에러 핸들러 연결

```js
app.use('/api', router);              // 모든 API 라우트 연결
app.use(errorMiddleware);             // 에러 처리 (맨 마지막)
```

---

## 7. 전체 요청 흐름 (종합)

프론트에서 `GET /api/user`를 요청했을 때의 전체 흐름:

```
[프론트엔드] axios.get('/api/user', { headers: { Authorization: 'Bearer <token>' } })
    │
    ↓ ── HTTP 요청 ──
    │
[app.js 미들웨어 체인]
    │ cors()              → 허용된 도메인인지 확인
    │ logger('dev')       → "GET /api/user" 로그 출력
    │ express.json()      → req.body 파싱 (GET이라 비어있음)
    │ passport.initialize → Passport 시스템 준비
    │
    ↓
[routes/index.js]
    │ '/api' 매칭         → index.js로 진입
    │ isValidJwtToken     → 토큰 검증 → req.user = { id: 42, email: '...' }
    │ '/user' 매칭        → routes/user.js로 진입
    │
    ↓
[routes/user.js]
    │ GET '/' 매칭        → controllers/user.js의 getUser() 실행
    │
    ↓
[controllers/user.js] getUser()
    │ User.update(...)    → viewCount +1, lastLoggedInAt 업데이트
    │ User.findOne(...)   → 유저 + 시간표 + 즐겨찾기 + 이삭줍기 조회
    │                        (models/user.js의 include 관계 사용)
    │ attachReviewStats() → 각 강의에 리뷰 통계 계산
    │
    ↓
[models/] Sequelize → SQL 변환 → MySQL 실행 → 결과 반환
    │
    ↓
[controllers/user.js]
    │ res.send(userData)  → 응답 전송
    │
    ↓ ── HTTP 응답 ──
    │
[프론트엔드] response.data = { id: 42, email: '...', timetables: [...], bookmarks: [...] }
```

---

## 부록: 개선이 필요한 사항 목록

| 영역 | 문제 | 우선순위 |
|------|------|---------|
| **보안** | Controller에 권한 검증 없음 (남의 데이터 수정 가능) | 높음 |
| **안정성** | Controller에 try/catch 없음 (에러 시 서버 크래시) | 높음 |
| **DB** | `sync({ alter: true })` 프로덕션 사용 → Migration 전환 | 높음 |
| **코드 중복** | JWT Strategy가 `auth.js`와 `lib/passport.js`에 중복 정의 | 중간 |
| **일관성** | 응답 형식 비일관 (객체/문자열 혼재) | 중간 |
| **설계** | `getUser`가 너무 많은 일을 함 | 중간 |
| **네이밍** | 컬럼명 한국어 로마자/영어 혼재 (`gubun` vs `professor`) | 낮음 |
| **설정** | `models/index.js` pool 옵션이 mysql2 형식 (동작은 하지만 Sequelize 공식 형식과 다름) | 낮음 |

---

## 8. 인증 시스템 — OAuth, JWT, Session의 이해

### 왜 인증이 필요한가?

HTTP는 **무상태(Stateless)** 프로토콜이다. 서버는 매 요청을 독립적으로 처리하며, "이 요청이 아까 로그인한 그 사람인지" 기억하지 못한다. 그래서 **"나 로그인했어"를 매 요청마다 증명**해야 한다.

### 인증 방식 비교: Session vs JWT

```
Session 방식 (전통적):
1. 로그인 → 서버가 세션 ID 발급 → 쿠키에 저장
2. 매 요청 시 쿠키의 세션 ID를 서버가 확인
3. 서버가 세션 저장소(메모리/DB)에서 유저 정보 조회

JWT 방식 (TIMO가 사용):
1. 로그인 → 서버가 JWT 토큰 발급 → 클라이언트가 저장
2. 매 요청 시 토큰을 헤더에 담아 전송
3. 서버가 토큰 자체를 해독해서 유저 정보 확인 (DB 조회 불필요*)
```

| | Session | JWT |
|--|---------|-----|
| **저장 위치** | 서버 (메모리/DB) | 클라이언트 (localStorage 등) |
| **서버 부담** | 세션 저장소 필요 | 없음 (토큰 자체가 정보를 담고 있음) |
| **확장성** | 서버 여러 대면 세션 공유 필요 | 서버 여러 대여도 독립적으로 검증 가능 |
| **보안** | 서버가 세션 무효화 가능 | 토큰 발급 후 서버가 취소 불가 (만료까지 유효) |
| **사용처** | 전통적 웹 (SSR) | SPA, 모바일 앱, 마이크로서비스 |

> *TIMO에서는 JWT 해독 후 `User.findOne()`으로 DB 조회를 추가로 수행한다. 유저가 삭제되었을 수 있으므로 확인하는 것.

### JWT (JSON Web Token)란?

유저 정보를 **암호화된 문자열**로 만든 것. 세 부분으로 구성된다:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.abc123signature
│                      │                    │
Header (알고리즘)       Payload (데이터)      Signature (서명)
```

```js
// 서버가 토큰을 만들 때 (routes/auth.js)
const accessToken = JWT.sign(
  { userId: req.user.id },    // Payload: 이 데이터가 토큰 안에 들어감
  process.env.JWT_SECRET       // 비밀키: 이걸로 서명 (위조 방지)
);

// 서버가 토큰을 검증할 때 (middlewares/auth.js)
// Passport가 내부적으로 수행:
// 1. 비밀키로 서명 검증 → 위조 여부 확인
// 2. Payload 추출 → { userId: 42 }
// 3. JWTVerify 콜백 호출 → DB에서 유저 조회
```

> JWT 비밀키(`JWT_SECRET`)가 유출되면 **누구나 유효한 토큰을 만들 수 있다**. 절대 공개하면 안 된다.

### OAuth (Open Authorization)란?

"구글한테 로그인을 대신 맡기는 것". 직접 비밀번호를 받지 않아도 된다.

```
왜 쓰는가?
- 비밀번호를 직접 관리하면: 해싱, 암호화, 비밀번호 찾기, 보안 사고 대응...
- OAuth를 쓰면: 구글이 다 해줌. 우리는 "이 사람이 구글 계정 주인" 확인만 받음
```

### TIMO의 전체 인증 흐름 (OAuth + JWT)

```
[1] 유저가 "구글 로그인" 버튼 클릭
     ↓
[2] 프론트 → 서버 (GET /api/auth/google)
     ↓
[3] 서버 → 구글 OAuth 페이지로 리다이렉트
     ↓
[4] 유저가 구글에서 로그인 + 정보 제공 동의
     ↓
[5] 구글 → 서버 콜백 (GET /api/auth/google/callback)
     │  구글이 유저 프로필(이메일 등)을 서버에 전달
     ↓
[6] lib/passport.js의 GoogleStrategy 콜백 실행:
     │  - DB에서 이메일로 유저 검색
     │  - 없으면 새 유저 생성 + 기본 시간표 생성
     │  - 있으면 기존 유저 반환
     ↓
[7] routes/auth.js 콜백 실행:
     │  - JWT 토큰 발급: JWT.sign({ userId: user.id }, SECRET)
     │  - 프론트로 리다이렉트: /timetable?token=<jwt>
     ↓
[8] 프론트 (useAuth 훅):
     │  - URL에서 token 파라미터 추출
     │  - localStorage에 저장
     │  - 이후 모든 API 요청에 헤더로 첨부:
     │    Authorization: Bearer <token>
     ↓
[9] 이후 API 호출마다:
     middlewares/auth.js가 토큰 검증 → req.user 설정 → Controller 실행
```

> OAuth는 **"로그인 시 1회"** 만 사용된다. 이후에는 JWT로 인증한다.
> 즉, **OAuth = 신분증 발급소**, **JWT = 발급받은 신분증**으로 비유할 수 있다.

### 핵심 요약

> **Session**: 서버가 "이 사람 로그인함"을 기억하는 방식. 서버에 부담.
> **JWT**: 클라이언트가 "나 로그인했음" 증거를 들고 다니는 방식. 서버 부담 없음.
> **OAuth**: 로그인 자체를 구글 같은 외부 서비스에 맡기는 것.
> TIMO는 **OAuth로 로그인 → JWT 발급 → JWT로 인증** 패턴을 사용한다.

---

## 9. lib/passport.js — 인증 전략 설정의 중심

### Passport.js란?

Node.js에서 가장 많이 쓰이는 **인증 라이브러리**다.
"전략(Strategy)" 패턴으로, 인증 방식을 플러그인처럼 끼워넣을 수 있다.

```
passport.use(new GoogleStrategy(...))  → 구글 로그인 전략
passport.use(new JWTStrategy(...))     → JWT 토큰 검증 전략
passport.use(new LocalStrategy(...))   → 아이디/비밀번호 전략 (TIMO는 미사용)
```

### TIMO에서 Passport의 역할

`lib/passport.js`는 두 가지 전략을 등록한다:

#### 전략 1: Google OAuth — 로그인 시 실행

```js
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,         // 구글 개발자 콘솔에서 발급
      clientSecret: GOOGLE_CLIENT_SECRET, // 구글 개발자 콘솔에서 발급
      callbackURL: getCallbackURL(),      // 구글이 인증 후 돌려보낼 URL
    },
    function (accessToken, refreshToken, profile, next) {
      // 구글이 인증 성공 후 이 함수를 호출
      // profile에 유저 이메일 등 정보가 담겨있음

      User.findOne({ where: { email: profile.emails[0].value } })
        .then(async (user) => {
          if (user) {
            return next(null, user);           // 기존 유저: 그대로 반환
          } else {
            const user = await User.create({   // 새 유저: 계정 생성
              email: profile.emails[0].value,
            });
            await Timetable.create({           // + 기본 시간표 자동 생성
              userId: user.id,
              title: '시간표 1',
            });
            return next(null, user);
          }
        });
    },
  ),
);
```

> `clientID`와 `clientSecret`은 [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트를 만들고 OAuth 2.0 사용자 인증 정보를 발급받아야 한다.

#### 전략 2: JWT — 매 API 요청마다 실행

```js
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      // payload = JWT 토큰 안의 데이터 ({ userId: 42 })
      const result = await User.findOne({ where: { id: payload.userId } });
      if (!result) return done(null, false, '');
      return done(null, result.dataValues);   // req.user에 저장됨
    },
  ),
);
```

### lib과 middleware의 차이

| | `lib/` | `middlewares/` |
|--|--------|---------------|
| **역할** | 라이브러리 설정, 유틸리티 | 요청-응답 파이프라인에 끼어드는 함수 |
| **호출 시점** | 서버 시작 시 1번 | 매 HTTP 요청마다 |
| **Express와 관계** | 독립적 (Express 없어도 동작) | Express의 `(req, res, next)` 패턴에 종속 |
| **TIMO 예시** | `lib/passport.js` — 전략 등록 | `middlewares/auth.js` — 요청마다 토큰 검증 |

> `lib/passport.js`는 서버 시작 시 `passportConfig()`로 **한 번만 호출**되어 전략을 등록한다.
> `middlewares/auth.js`는 **매 요청마다** 그 전략을 사용해 토큰을 검증한다.

### 핵심 요약

> **lib/passport.js = 인증 전략을 등록하는 설정 파일.**
> Google OAuth 전략(로그인)과 JWT 전략(토큰 검증)을 정의한다.
> 서버 시작 시 한 번 실행되며, 이후 Passport가 필요할 때 등록된 전략을 사용한다.

---

## 10. 나머지 폴더들 — utils, config, services

### utils/ — 여러 곳에서 재사용하는 도우미 함수

`utils/`는 **특정 기능에 종속되지 않는 범용 유틸리티**를 모아두는 폴더다.

#### `utils/constants.js` — 매직 넘버 방지

```js
exports.HTTP_STATUS = {
  SUCCESS: 200,
  CREATE_SUCCESS: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  DUPLICATED: 409,
  SERVER_ERROR: 500,
};
```

이걸 왜 따로 파일로 만드는가?

```js
// 나쁜 예: 숫자만 보면 의미를 모름
res.status(409).send('...');

// 좋은 예: 의미가 명확함
res.status(HTTP_STATUS.DUPLICATED).send('...');
```

> 코드에서 의미 없이 등장하는 숫자를 **매직 넘버(Magic Number)** 라고 한다.
> 상수로 이름을 붙이면 코드를 읽을 때 "409가 뭐였지?" 하고 찾아볼 필요가 없다.
> 현업에서는 `constants/` 폴더를 따로 만들기도 한다. TIMO는 `utils/` 안에 포함.

#### `utils/query_helper.js` — 복잡한 DB 쿼리 로직 분리

```js
exports.searchWhereClause = (search) => {
  // 검색어를 콤마로 분리하고, 각 단어로 여러 컬럼을 검색하는 WHERE 조건 생성
  // "자료,김교수" → name LIKE '%자료%' OR professor LIKE '%김교수%' ...
};
```

이 함수가 `controllers/search.js`에 직접 있으면 컨트롤러가 너무 길어진다.
**쿼리 조건 생성**이라는 독립적인 작업이므로 `utils/`로 분리한 것.

> 현업에서 `utils/`에 들어가는 것들:
> - 날짜 포맷 변환, 문자열 처리
> - 로거 설정 (winston, pino)
> - 공통 에러 클래스
> - 이메일 발송, 파일 업로드 등 외부 서비스 연동

### config/ — TIMO에는 없지만 현업에서 자주 보는 폴더

현업 구조에서 `config/`는 **환경 설정을 한 곳에서 관리**하는 역할이다:

```js
// config/index.js — 현업 예시
module.exports = {
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};
```

TIMO는 `config/` 없이 각 파일에서 직접 `process.env.XXX`를 사용 중이다:

```js
// TIMO 현재 — 여러 파일에서 process.env를 직접 참조
// models/index.js
const { DB_HOST, DB_NAME, DB_USER, DB_PW } = process.env;

// lib/passport.js
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

// middlewares/auth.js
secretOrKey: process.env.JWT_SECRET,
```

| | `process.env` 직접 사용 (TIMO) | `config/` 폴더 사용 (현업) |
|--|-------------------------------|--------------------------|
| **장점** | 간단, 파일 적음 | 환경변수 한 곳에서 관리, 누락 시 즉시 발견 |
| **단점** | 환경변수명 오타 시 런타임에서야 발견 | 파일 하나 더 필요 |
| **적합한 규모** | 소규모 프로젝트 | 환경변수가 10개 이상일 때 |

### services/ — TIMO에는 없지만 현업에서 가장 중요한 레이어

현업 구조에서 가장 눈에 띄는 차이가 **Service 레이어**다.

```
TIMO 현재:          Controller → Model (직접 호출)
현업 구조:           Controller → Service → Model
```

왜 Service를 두는가? Controller에서 직접 Model을 호출하면:

```js
// TIMO의 getUser — Controller가 너무 많은 일을 함
exports.getUser = async (req, res) => {
  await User.update({ viewCount: ... });          // DB 조작 1
  const user = await User.findOne({ include: ... }); // DB 조작 2
  const stats = await attachReviewStats(...);       // DB 조작 3
  res.send(userData);                               // 응답
};
```

Service를 두면:

```js
// controllers/user.js — HTTP 요청/응답만 담당
exports.getUser = async (req, res) => {
  const userData = await userService.getUserWithDetails(req.user.id);
  res.send(userData);
};

// services/userService.js — 비즈니스 로직 담당
exports.getUserWithDetails = async (userId) => {
  await User.update({ viewCount: ... });
  const user = await User.findOne({ include: ... });
  return attachReviewStats(user);
};
```

| | Service 없이 (TIMO) | Service 있으면 (현업) |
|--|---------------------|---------------------|
| **Controller 역할** | HTTP 처리 + 비즈니스 로직 + DB 조작 | HTTP 처리만 |
| **Service 역할** | (없음) | 비즈니스 로직 + DB 조작 |
| **재사용** | 같은 로직이 필요하면 Controller 코드를 복붙 | Service 함수를 호출 |
| **테스트** | req, res를 모킹해야 함 (번거로움) | 순수 함수라 테스트 쉬움 |

> 프론트에서 비유하면:
> **Controller = 컴포넌트** (화면 렌더링만), **Service = 커스텀 훅** (로직 담당)

> TIMO 규모에서는 Service 없이도 문제없다. 하지만 기능이 늘어나면
> "이 로직을 다른 API에서도 쓰고 싶은데?" 하는 순간이 오고, 그때 Service가 필요해진다.

### 핵심 요약

> **utils/** = 여러 곳에서 재사용하는 범용 도우미 (상수, 쿼리 헬퍼, 로거 등)
> **config/** = 환경 설정을 한 곳에서 관리 (TIMO는 미사용)
> **services/** = Controller와 Model 사이의 비즈니스 로직 레이어 (TIMO는 미사용)

---

## 11. TIMO vs 현업 구조 비교

### 폴더 구조 비교

```
TIMO 현재                          현업 일반적 구조
server/                            src/
├── app.js                         ├── app.js
├── bin/www                        ├── server.js
├── models/         ✅ 동일         ├── models/
├── controllers/    ✅ 동일         ├── controllers/
├── routes/         ✅ 동일         ├── routes/
├── middlewares/    ✅ 동일         ├── middlewares/
├── lib/            ≈ config       ├── config/          ← 환경 설정 전담
├── utils/          ✅ 동일         ├── utils/
│                                  ├── services/        ← 비즈니스 로직 분리
│                                  ├── constants/       ← 상수 전담 (또는 utils 안에)
│                                  └── validators/      ← 입력값 검증
```

### TIMO에 있는 것 vs 없는 것

| 구성 요소 | TIMO | 현업 | 중요도 |
|-----------|------|------|--------|
| Model (ORM) | ✅ Sequelize | ✅ Sequelize/Prisma/TypeORM | 필수 |
| Controller | ✅ 있음 | ✅ 있음 | 필수 |
| Router | ✅ 있음 | ✅ 있음 | 필수 |
| Middleware | ✅ 인증 + 에러 | ✅ 인증 + 에러 + 검증 + 로깅 | 필수 |
| 상수 관리 | ✅ utils/constants.js | ✅ constants/ 폴더 | 필수 |
| 환경 설정 | △ process.env 직접 사용 | ✅ config/ 폴더 | 권장 |
| **Service 레이어** | ❌ 없음 | ✅ services/ 폴더 | **현업 핵심** |
| **입력값 검증** | ❌ 없음 | ✅ validators/ 또는 미들웨어 | **보안 필수** |
| **DB Migration** | ❌ sync 사용 | ✅ Migration 파일 | **프로덕션 필수** |
| **테스트** | ❌ 없음 | ✅ tests/ 폴더 | 현업 필수 |
| **로깅** | △ console.log | ✅ Winston/Pino | 권장 |

### 결론

> **TIMO의 기본 뼈대(Model-Controller-Route-Middleware)는 현업과 동일하다.**
> 빠져있는 Service/Validation/Migration/Test는 **프로젝트가 커지면서 추가하는 것**이지,
> 처음부터 다 갖추고 시작하는 게 아니다.
> 지금 TIMO 구조를 이해했다면, 현업 구조의 70%는 이미 아는 것이다.
> 나머지 30%는 "왜 필요한지"를 체감한 후에 추가하는 게 가장 효과적이다.