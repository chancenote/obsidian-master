const CURRICULUM = [
  // ========== WEEK 1: 기초 다지기 ==========
  {
    week: 1,
    title: "1주차: 기초 다지기 - Obsidian 핵심 익히기",
    description: "Obsidian 설치부터 기본 사용법, 마크다운, Vault 구조까지",
    days: [
      {
        day: 1,
        title: "Obsidian 설치 & Vault 설계",
        summary: "Obsidian 설치, Vault 생성, 기본 인터페이스 익히기",
        tags: ["core"],
        details: [
          "Obsidian 다운로드 및 설치",
          "첫 Vault 생성 (내 전문지식 Vault)",
          "인터페이스 구성: 사이드바, 에디터, 그래프뷰",
          "설정 메뉴 둘러보기 (외관, 에디터, 핫키)",
          "실습: 폴더 구조 만들기 - 00_Inbox, 01_Projects, 02_Areas, 03_Resources, 04_Archive"
        ],
        practice: "PARA 방법론에 기반한 5개 폴더(00_Inbox, 01_Projects, 02_Areas, 03_Resources, 04_Archive)를 만들고, 각 폴더 안에 README.md를 작성하세요. README에는 해당 폴더의 용도와 어떤 노트가 들어갈지 설명합니다. 추가로 Templates 폴더도 생성하세요.",
        prompt: "나는 옵시디언(Obsidian)을 처음 시작하는 초보자야. 내 전문 분야는 [여기에 본인 전문분야 입력]이야.\n\n다음을 도와줘:\n1. PARA 시스템(Projects, Areas, Resources, Archive) 기반으로 내 전문분야에 맞는 Vault 폴더 구조를 설계해줘\n2. 각 폴더(00_Inbox, 01_Projects, 02_Areas, 03_Resources, 04_Archive, Templates)의 README.md 내용을 마크다운으로 작성해줘 - 각 폴더의 용도, 어떤 노트가 들어가는지, 예시 포함\n3. 내 전문분야에서 처음 만들면 좋을 노트 10개를 제안해줘\n4. Obsidian 초기 설정 추천 (에디터 설정, 외관, 유용한 핫키)도 알려줘"
      },
      {
        day: 2,
        title: "마크다운 완전 정복",
        summary: "Obsidian에서 사용하는 마크다운 문법 마스터",
        tags: ["core"],
        details: [
          "제목(#), 볼드(**), 이탤릭(*), 취소선(~~)",
          "리스트, 체크박스, 인용문, 코드블록",
          "테이블 작성법",
          "각주, 하이라이트(==), 콜아웃(> [!note])",
          "실습: 자기소개 & 전문 분야 노트를 마크다운으로 작성"
        ],
        practice: "마크다운 문법을 총동원하여 '자기소개 & 전문분야 소개' 노트를 작성하세요. 반드시 포함할 요소: 제목(h1~h3), 볼드/이탤릭, 순서형/비순서형 리스트, 체크박스, 인용문, 코드블록, 테이블(경력/스킬 표), 콜아웃 박스, 하이라이트, 각주를 모두 사용해보세요.",
        prompt: "옵시디언에서 사용할 수 있는 마크다운 문법을 배우고 있어.\n\n다음을 해줘:\n1. 내 전문분야([여기에 입력])를 기반으로 '자기소개 & 전문분야 소개' 노트를 마크다운으로 작성해줘\n2. 이 노트에 마크다운 모든 문법을 활용해줘:\n   - h1~h3 제목 계층\n   - 볼드, 이탤릭, 취소선, ==하이라이트==\n   - 순서형/비순서형 리스트, 체크박스\n   - > 인용문, > [!tip] 콜아웃 박스 (note, tip, warning, example 등 다양하게)\n   - 코드블록 (```), 인라인 코드\n   - | 테이블 | (경력, 스킬 매트릭스 등)\n   - 각주[^1], 수평선(---)\n3. 각 문법 요소 옆에 <!-- 주석 -->으로 어떤 문법인지 설명을 달아줘\n4. 추가로 옵시디언 전용 마크다운(콜아웃, 임베드, 내부링크 등)도 예시를 보여줘"
      },
      {
        day: 3,
        title: "Internal Link & 백링크",
        summary: "[[위키링크]]와 백링크로 지식 연결하기",
        tags: ["core"],
        details: [
          "[[위키링크]] 생성법",
          "[[노트명#헤딩]] 특정 섹션 링크",
          "[[노트명|표시텍스트]] 별칭 링크",
          "백링크 패널 활용법",
          "아웃고잉 링크 vs 백링크 개념 이해",
          "실습: 전문 분야 노트 5개 만들고 서로 연결하기"
        ],
        practice: "전문 분야의 핵심 개념 5개를 각각 별도 노트로 만들고, 모든 노트를 [[위키링크]]로 서로 연결하세요. 각 노트에서 최소 2개 이상의 다른 노트를 참조해야 합니다. [[노트명#섹션]], [[노트명|별칭]] 형식도 각각 1번 이상 사용하세요. 완성 후 그래프 뷰에서 연결 상태를 확인하세요.",
        prompt: "옵시디언의 [[위키링크]]와 백링크 시스템을 연습하고 싶어. 내 전문 분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. 내 전문 분야의 핵심 개념 5개를 선정하고, 각각을 독립된 옵시디언 노트로 작성해줘\n2. 각 노트는 다음 형식을 포함해야 해:\n   - YAML 프론트매터 (title, tags, date)\n   - 개념 설명 (3~5문단)\n   - 관련 개념 섹션에서 다른 노트로 [[위키링크]] 연결\n   - 최소 하나의 [[노트명#특정섹션]] 형식 링크\n   - 최소 하나의 [[노트명|표시텍스트]] 별칭 링크\n3. 5개 노트 간의 연결 관계를 텍스트 다이어그램으로 보여줘\n4. 백링크가 어떻게 자동으로 생성되는지 설명해줘"
      },
      {
        day: 4,
        title: "태그 & 속성(Properties/YAML)",
        summary: "노트에 메타데이터 추가하고 분류하기",
        tags: ["core"],
        details: [
          "#태그 사용법과 중첩 태그(#주제/하위주제)",
          "YAML 프론트매터 작성 (---로 시작)",
          "Properties: tags, aliases, date, category 등",
          "태그 vs 링크 vs 폴더 - 언제 무엇을 사용할지",
          "실습: 기존 노트에 태그와 Properties 추가"
        ],
        practice: "Day 1~3에서 만든 모든 노트에 YAML 프론트매터를 추가하세요. 필수 속성: tags(중첩 태그 포함), aliases, date, category, status. 태그 체계를 설계하고(예: #분야/하위분야, #상태/진행중) 일관되게 적용하세요. 태그 vs 링크 vs 폴더를 언제 쓸지 정리한 '메타 가이드' 노트도 작성하세요.",
        prompt: "옵시디언의 태그 시스템과 YAML Properties를 체계적으로 설계하고 싶어. 내 전문 분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. 내 전문분야에 맞는 태그 체계를 설계해줘 (중첩 태그 활용):\n   - 주제별 태그 (예: #분야/하위분야)\n   - 상태 태그 (예: #status/draft, #status/review)\n   - 유형 태그 (예: #type/concept, #type/project)\n2. 모든 노트에 적용할 표준 YAML 프론트매터 템플릿을 만들어줘:\n   - tags, aliases, date, category, status, related 등 포함\n3. 태그 vs [[링크]] vs 폴더를 각각 언제 사용해야 하는지 비교표로 정리해줘\n4. 기존 노트에 Properties를 추가한 예시를 3개 보여줘\n5. '나의 Vault 메타데이터 가이드' 노트를 마크다운으로 작성해줘"
      },
      {
        day: 5,
        title: "검색 & 필터링 마스터",
        summary: "Obsidian 내장 검색 기능 완전 활용",
        tags: ["core"],
        details: [
          "기본 검색 (Ctrl+Shift+F)",
          "검색 연산자: tag:, file:, path:, section:",
          "정규식 검색 활용",
          "빠른 전환 (Ctrl+O)으로 노트 이동",
          "북마크 기능으로 자주 쓰는 노트 즐겨찾기",
          "실습: 다양한 검색 쿼리로 노트 찾아보기"
        ],
        practice: "Obsidian 검색 연산자를 모두 실습하세요. 최소 10개의 검색 쿼리를 작성하고 결과를 확인하세요: tag:#, file:, path:, section:, line:, content: 연산자와 AND/OR 조합, 정규식 검색. 유용한 검색 쿼리 모음을 '검색 치트시트' 노트에 정리하고 북마크에 등록하세요.",
        prompt: "옵시디언 검색 기능을 완전히 마스터하고 싶어. 내 Vault에는 [여기에 대략적인 노트 주제들 입력]에 관한 노트들이 있어.\n\n다음을 해줘:\n1. 옵시디언 검색 연산자를 모두 정리한 '검색 치트시트' 노트를 만들어줘:\n   - 기본 검색, tag:, file:, path:, section:, line:, content:\n   - AND, OR, NOT 조합법\n   - 괄호로 그룹핑하는 법\n   - 정규식(regex) 검색 예시 5개\n2. 내 전문분야에 맞는 실용적인 검색 쿼리 예시 15개를 만들어줘\n3. 검색을 저장하고 재활용하는 방법(북마크, 임베드 검색)도 알려줘\n4. 빠른 전환(Ctrl+O)과 검색(Ctrl+Shift+F)의 차이점과 각각 언제 쓰면 좋은지 설명해줘"
      },
      {
        day: 6,
        title: "그래프 뷰 & 노트 시각화",
        summary: "지식 그래프를 시각적으로 탐색하기",
        tags: ["core"],
        details: [
          "전체 그래프 뷰 사용법",
          "로컬 그래프 뷰 (현재 노트 중심)",
          "그래프 필터링: 태그, 폴더, 고아노트 등",
          "그래프 뷰 색상 그룹 설정",
          "실습: 10개 이상 노트를 연결하고 그래프 확인"
        ],
        practice: "Vault에 최소 15개 노트가 있도록 보충하고, 모든 노트가 최소 1개 이상 연결되도록 하세요. 그래프 뷰에서 태그별 색상 그룹을 3개 이상 설정하세요. 고아 노트(연결 없는 노트)를 찾아 연결하세요. 로컬 그래프를 캡처하여 기록하세요.",
        prompt: "옵시디언 그래프 뷰를 효과적으로 활용하는 방법을 배우고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. 내 전문분야에서 서로 연결되는 개념 15개를 선정하고, 어떻게 연결하면 좋을지 관계도를 텍스트로 그려줘\n2. 그래프 뷰 색상 그룹 설정 추천:\n   - 어떤 기준(태그, 폴더, 주제)으로 색상을 나누면 좋을지\n   - 구체적인 설정 방법 (검색쿼리 기반 색상 그룹)\n3. 그래프 뷰 필터링 팁: 특정 폴더만 보기, 태그 필터, 고아노트 찾기 방법\n4. 그래프가 유의미한 연결을 보여주려면 노트를 어떻게 작성해야 하는지 best practice\n5. 현재 15개 노트에 대한 마크다운 내용을 간략하게 작성해줘 (각 노트에 [[링크]] 2-3개씩 포함)"
      },
      {
        day: 7,
        title: "1주차 복습 & 나만의 Vault 구조 확립",
        summary: "1주차 총정리, PARA 시스템으로 Vault 재정비",
        tags: ["core", "system"],
        details: [
          "PARA 시스템 이해: Projects, Areas, Resources, Archive",
          "나만의 폴더 구조 최종 결정",
          "네이밍 컨벤션 정하기 (날짜 형식, 접두사 등)",
          "1주차 학습 내용 복습 노트 작성",
          "실습: 전체 Vault를 PARA 기반으로 재구성"
        ],
        practice: "1주차에 배운 모든 내용을 종합하여 Vault를 재정비하세요. PARA 구조로 모든 노트를 재배치하고, 네이밍 컨벤션 가이드를 작성하세요. '1주차 학습 복습' 노트를 만들고 배운 내용을 정리하세요. 현재 Vault 현황(노트 수, 태그 수, 연결 수)을 기록하세요.",
        prompt: "옵시디언 1주차 학습을 마무리하고 Vault를 체계적으로 정비하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. PARA 시스템(Projects, Areas, Resources, Archive)을 내 전문분야에 맞게 커스터마이즈해줘:\n   - 각 폴더에 들어갈 구체적인 하위 폴더와 예시 노트 목록\n   - Inbox 처리 규칙 (언제 어디로 이동시킬지)\n2. 나만의 네이밍 컨벤션 가이드를 만들어줘:\n   - 파일명 형식 (날짜 포함 여부, 접두사 규칙)\n   - 폴더명 규칙\n   - 태그 네이밍 규칙\n3. '1주차 학습 복습' 노트를 작성해줘: 마크다운, 링크, 태그, 검색, 그래프뷰에서 배운 핵심을 정리\n4. 2주차로 넘어가기 전 점검할 체크리스트를 만들어줘"
      }
    ]
  },
  // ========== WEEK 2: 중급 - 플러그인 & 워크플로우 ==========
  {
    week: 2,
    title: "2주차: 중급 - 핵심 플러그인 & 워크플로우",
    description: "커뮤니티 플러그인으로 생산성 극대화, 템플릿 시스템 구축",
    days: [
      {
        day: 8,
        title: "커뮤니티 플러그인 시작",
        summary: "커뮤니티 플러그인 설치, 필수 플러그인 소개",
        tags: ["plugin"],
        details: [
          "커뮤니티 플러그인 활성화 방법",
          "필수 플러그인 설치: Calendar, Periodic Notes",
          "데일리 노트 설정 및 활용",
          "Calendar 플러그인으로 일별 노트 관리",
          "실습: 데일리 노트 템플릿 만들고 일주일치 작성"
        ],
        practice: "커뮤니티 플러그인을 활성화하고 Calendar, Periodic Notes를 설치하세요. 데일리 노트 템플릿을 만드세요(날짜, 오늘의 목표, 할일, 메모, 회고 섹션 포함). 템플릿을 적용하여 오늘 포함 3일치 데일리 노트를 실제로 작성하세요.",
        prompt: "옵시디언에 Calendar와 Periodic Notes 플러그인을 설치했어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. 내 전문분야에 최적화된 데일리 노트 템플릿을 마크다운으로 작성해줘. 포함할 섹션:\n   - 날짜 & 요일 헤더\n   - 오늘의 핵심 목표 (3개)\n   - 할일 체크리스트\n   - 전문분야 학습/업무 로그\n   - 아이디어 & 인사이트 메모\n   - 저녁 회고 (잘한 점, 개선점)\n   - 내일 할 일\n2. 주간 노트(Weekly Note) 템플릿도 만들어줘: 주간 목표, 이번 주 데일리 노트 링크, 주간 회고\n3. Periodic Notes 플러그인 설정 가이드: 폴더 경로, 템플릿 경로, 날짜 형식 추천\n4. 데일리 노트를 습관으로 만드는 팁도 알려줘"
      },
      {
        day: 9,
        title: "Templater 플러그인 마스터",
        summary: "Templater로 자동화된 노트 템플릿 만들기",
        tags: ["plugin"],
        details: [
          "Templater 설치 및 기본 설정",
          "기본 명령어: tp.date, tp.file, tp.system",
          "날짜/시간 자동 삽입 템플릿",
          "프롬프트로 사용자 입력 받기",
          "폴더별 자동 템플릿 적용",
          "실습: 프로젝트 노트, 회의록, 독서노트 템플릿 3종 제작"
        ],
        practice: "Templater를 설치하고 3종 템플릿을 제작하세요: (1) 프로젝트 노트 - tp.system.prompt로 프로젝트명 입력받아 자동 세팅 (2) 회의록 - 날짜/시간 자동 삽입, 참석자 프롬프트 (3) 독서노트 - 책 제목, 저자 프롬프트. 각 템플릿에 tp.date.now, tp.file.title 등 Templater 문법을 3개 이상 사용하세요.",
        prompt: "옵시디언 Templater 플러그인을 설치했어. 내 전문분야는 [여기에 입력]이야.\n\n다음 3종 템플릿을 Templater 문법(<% %> 사용)으로 작성해줘:\n\n1. **프로젝트 노트 템플릿**:\n   - tp.system.prompt(\"프로젝트명?\")으로 이름 입력받기\n   - tp.date.now(\"YYYY-MM-DD\")로 생성일 자동 삽입\n   - YAML: title, status(active), start_date, tags\n   - 섹션: 목표, 마일스톤, 진행상황, 참고자료\n\n2. **회의록 템플릿**:\n   - tp.date.now(\"YYYY-MM-DD HH:mm\")으로 일시 자동기록\n   - tp.system.prompt(\"회의 주제?\")로 제목 설정\n   - 섹션: 참석자, 안건, 논의사항, 결정사항, Action Items\n\n3. **독서/학습 노트 템플릿**:\n   - tp.system.prompt로 제목, 저자 입력받기\n   - 섹션: 핵심 요약, 인상적인 구절, 내 생각, 연결되는 개념[[]], 실행 항목\n\n각 템플릿마다 사용된 Templater 문법에 대한 설명을 주석으로 달아줘.\nTemplater 폴더별 자동 적용(Folder Templates) 설정 방법도 알려줘."
      },
      {
        day: 10,
        title: "Dataview 플러그인 기초",
        summary: "Dataview로 노트를 데이터베이스처럼 쿼리하기",
        tags: ["plugin"],
        details: [
          "Dataview 설치, 인라인 필드 개념",
          "기본 쿼리: LIST, TABLE, TASK",
          "FROM, WHERE, SORT 사용법",
          "메타데이터 기반 필터링",
          "실습: 전문분야별 노트 목록 자동 생성 페이지 만들기"
        ],
        practice: "Dataview를 설치하고 기본 쿼리 3종을 작성하세요: (1) LIST - 특정 태그 노트 목록 (2) TABLE - 프론트매터 기반 테이블 (title, date, status 컬럼) (3) TASK - Vault 전체의 미완료 할일 모음. 이 쿼리들을 모아 '내 노트 인덱스' 페이지를 만드세요.",
        prompt: "옵시디언 Dataview 플러그인을 설치했어. 내 Vault에는 [여기에 노트 종류/태그 설명]에 관한 노트들이 있어.\n\n다음을 해줘:\n1. Dataview 기본 개념을 간결하게 설명해줘 (인라인 필드, 쿼리 블록)\n2. 내 Vault에 맞는 실용적인 Dataview 쿼리 예시를 각 유형별로 만들어줘:\n\n   **LIST 쿼리 3개:**\n   - 특정 태그의 노트 목록\n   - 최근 7일 내 생성된 노트\n   - 특정 폴더의 노트 목록\n\n   **TABLE 쿼리 3개:**\n   - 프로젝트 현황 테이블 (이름, 상태, 시작일)\n   - 전문분야별 노트 테이블 (제목, 태그, 수정일)\n   - 콘텐츠 진행 상황 테이블\n\n   **TASK 쿼리 2개:**\n   - Vault 전체 미완료 할일 모음\n   - 특정 프로젝트의 할일만 필터링\n\n3. 이 쿼리들을 조합한 '내 노트 인덱스' 페이지의 전체 마크다운을 작성해줘\n4. FROM, WHERE, SORT, LIMIT, GROUP BY 사용법을 예시와 함께 정리해줘"
      },
      {
        day: 11,
        title: "Dataview 중급 & 대시보드",
        summary: "Dataview 고급 쿼리와 나만의 대시보드 구축",
        tags: ["plugin"],
        details: [
          "DataviewJS 기초",
          "GROUP BY로 분류별 정리",
          "날짜 기반 쿼리 (최근 수정, 생성일 등)",
          "인라인 Dataview 쿼리",
          "실습: 홈 대시보드 노트 만들기 - 최근 노트, 프로젝트 현황, 태그 목록"
        ],
        practice: "홈 대시보드 노트를 만드세요. 포함할 Dataview 쿼리: (1) 최근 수정된 노트 TOP 10 (2) 프로젝트별 상태 테이블 (GROUP BY 활용) (3) 태그별 노트 개수 (4) 이번 주 생성된 노트 목록 (5) 미완료 태스크 모음. 인라인 Dataview(`= this.file.name` 등)도 2개 이상 사용하세요.",
        prompt: "옵시디언 Dataview 중급 기능을 활용해서 홈 대시보드를 만들고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 포함하는 완전한 '홈 대시보드' 노트를 마크다운으로 작성해줘:\n\n1. **헤더 영역**: 인라인 Dataview로 현재 Vault 통계 표시\n   - `= length(dv.pages())` 전체 노트 수\n   - `= length(dv.pages(\"#project\"))` 프로젝트 수\n\n2. **최근 활동**: 최근 수정된 노트 TOP 10 TABLE 쿼리\n\n3. **프로젝트 현황**: GROUP BY status로 프로젝트를 상태별 분류\n\n4. **이번 주 생성 노트**: 날짜 기반 필터링 쿼리\n\n5. **미완료 태스크**: TASK 쿼리로 전체 할일 모음\n\n6. **태그 기반 분류**: 주요 태그별 노트 카운트\n\n7. DataviewJS로 간단한 통계도 추가해줘 (예: 카테고리별 노트 수 표시)\n\n각 쿼리에 주석으로 설명을 달아줘."
      },
      {
        day: 12,
        title: "Canvas & 비주얼 사고",
        summary: "Obsidian Canvas로 시각적 브레인스토밍",
        tags: ["core"],
        details: [
          "Canvas 기본 사용법: 카드, 연결선, 그룹",
          "기존 노트를 Canvas에 임베드",
          "이미지, 링크, 미디어 추가",
          "Canvas로 콘텐츠 기획 보드 만들기",
          "실습: 내 전문 분야 지식맵을 Canvas로 시각화"
        ],
        practice: "Canvas 파일을 새로 만들고 전문 분야 지식맵을 시각화하세요. 최소 10개 카드(기존 노트 임베드 5개 + 새 텍스트 카드 5개)를 배치하고, 연결선으로 관계를 표시하세요. 색상 그룹을 3개 이상 사용하여 주제별로 구분하세요. 별도로 '콘텐츠 기획 보드' Canvas도 만들어보세요.",
        prompt: "옵시디언 Canvas 기능을 활용해서 내 전문분야([여기에 입력])의 지식맵을 만들고 싶어.\n\n다음을 해줘:\n1. 내 전문분야의 핵심 개념들을 체계적으로 정리해서 Canvas 지식맵 구조를 설계해줘:\n   - 대분류 3~4개 (색상 그룹으로 구분)\n   - 각 대분류 아래 중분류 2~3개\n   - 각 중분류 아래 핵심 개념 노트 2~3개\n   - 개념 간 연결 관계 (화살표 방향, 라벨)\n2. 이 구조를 텍스트 다이어그램으로 시각화해줘\n3. Canvas에서 효과적으로 작업하는 팁 (단축키, 정렬, 그룹핑)\n4. 콘텐츠 기획 보드 Canvas 구조도 설계해줘:\n   - 아이디어 → 기획 → 작성 중 → 리뷰 → 발행 단계\n   - 각 단계에 넣을 카드 예시"
      },
      {
        day: 13,
        title: "추가 필수 플러그인 세팅",
        summary: "생산성 플러그인 일괄 설치 및 설정",
        tags: ["plugin"],
        details: [
          "Excalidraw: 손그림/다이어그램 (Zsolt Viczian 개발)",
          "QuickAdd: 매크로 시스템 - 빠른 캡처 & 체인 액션",
          "Kanban: 마크다운 기반 칸반 보드로 프로젝트 관리",
          "Tasks: 고급 할일 관리 (마감일, 반복, 우선순위, Vault 전체 쿼리)",
          "Linter: 저장 시 마크다운 자동 포맷팅",
          "Commander: UI 어디든 커맨드 버튼 추가",
          "Style Settings: 테마 CSS 변수를 설정으로 조정",
          "실습: 각 플러그인으로 노트 작성해보기"
        ],
        practice: "7개 플러그인을 모두 설치하세요. 각각 실습: (1) Excalidraw로 간단한 다이어그램 1개 그리기 (2) QuickAdd로 빠른 메모 캡처 매크로 설정 (3) Kanban으로 할일 보드 만들기 (4) Tasks로 마감일 있는 할일 5개 작성 (5) Linter 자동 포맷 규칙 설정 (6) Commander로 사이드바에 자주 쓰는 커맨드 추가 (7) Style Settings 둘러보기.",
        prompt: "옵시디언에 생산성 플러그인 7개(Excalidraw, QuickAdd, Kanban, Tasks, Linter, Commander, Style Settings)를 설치했어. 내 전문분야는 [여기에 입력]이야.\n\n각 플러그인별로 다음을 해줘:\n\n1. **Excalidraw**: 내 전문분야 핵심 프로세스를 설명하는 다이어그램 구조를 텍스트로 설계해줘\n2. **QuickAdd**: 내 워크플로우에 맞는 매크로 3개를 설계해줘 (빠른 메모 캡처, 프로젝트 노트 생성, 독서 노트 생성). 설정 방법도 단계별로\n3. **Kanban**: 내 프로젝트/콘텐츠 관리용 칸반 보드 구조를 마크다운으로 작성해줘 (열: Backlog, In Progress, Review, Done)\n4. **Tasks**: Tasks 플러그인 문법 정리해줘 (마감일, 반복, 우선순위, 쿼리). 내 분야에 맞는 예시 할일 5개도 작성\n5. **Linter**: 추천 포맷팅 규칙 설정 (YAML 정리, 빈 줄, 헤딩 스타일)\n6. **Commander**: 사이드바에 추가하면 좋을 커맨드 TOP 5\n7. **Style Settings**: 추천 테마와 설정 조합"
      },
      {
        day: 14,
        title: "2주차 복습 & MOC 구축",
        summary: "MOC(Map of Content) 시스템으로 지식 허브 만들기",
        tags: ["system"],
        details: [
          "MOC 개념 이해: 주제별 색인 노트",
          "Nick Milo의 Linking Your Thinking 방법론",
          "상위 MOC → 하위 MOC → 개별 노트 구조",
          "전문 분야별 MOC 만들기",
          "실습: 최소 3개 주제별 MOC 노트 작성"
        ],
        practice: "전문 분야의 주제를 3개 이상 선정하고 각각 MOC(Map of Content) 노트를 작성하세요. 각 MOC에는: 주제 소개, 관련 노트 [[링크]] 목록(카테고리별 분류), 관련 MOC 간 상호 링크, Dataview 쿼리로 관련 태그 노트 자동 수집. 상위 '메인 MOC'도 만들어 하위 MOC들을 연결하세요.",
        prompt: "옵시디언 MOC(Map of Content) 시스템을 구축하고 싶어. 내 전문분야는 [여기에 입력]이야. Nick Milo의 Linking Your Thinking 방법론을 적용하고 싶어.\n\n다음을 해줘:\n1. 내 전문분야를 3~5개 핵심 주제로 나누고, 각 주제별 MOC 노트를 마크다운으로 작성해줘:\n   - 주제 소개 (2~3문장)\n   - 하위 개념 목록 ([[위키링크]] 사용, 카테고리별 분류)\n   - 관련 리소스 & 참고자료\n   - 하단에 Dataview 쿼리: 해당 태그의 노트를 자동 수집하는 쿼리\n2. 모든 MOC을 연결하는 '메인 MOC (Home MOC)' 노트를 작성해줘\n3. MOC 계층 구조를 다이어그램으로 보여줘: 메인 MOC → 하위 MOC → 개별 노트\n4. MOC을 유지보수하는 루틴 (언제, 어떻게 업데이트하는지) 가이드도 작성해줘\n5. 2주차 학습 회고 섹션도 포함해줘"
      }
    ]
  },
  // ========== WEEK 3: 고급 - 지식 관리 시스템 ==========
  {
    week: 3,
    title: "3주차: 고급 - 지식 관리 & 콘텐츠 시스템",
    description: "제텔카스텐, 콘텐츠 파이프라인, 고급 워크플로우 구축",
    days: [
      {
        day: 15,
        title: "Zettelkasten 방법론 적용",
        summary: "제텔카스텐 원리를 Obsidian에 구현하기",
        tags: ["system"],
        details: [
          "Zettelkasten 핵심 원리: 원자적 노트, 연결, 색인",
          "Fleeting Note → Literature Note → Permanent Note 워크플로우",
          "고유 ID 시스템 (날짜+시간 or 순번)",
          "하나의 노트 = 하나의 아이디어 원칙",
          "실습: 전문 서적 1챕터를 제텔카스텐으로 정리"
        ],
        practice: "전문 분야 서적 또는 아티클 1개를 선택하고, 제텔카스텐 3단계로 정리하세요: (1) Fleeting Note 3개 - 읽으며 떠오른 생각 메모 (2) Literature Note 1개 - 내용 요약 (3) Permanent Note 3개 - 내 관점으로 재작성한 원자적 아이디어. 모든 노트를 서로 연결하고, 기존 노트와도 링크하세요.",
        prompt: "옵시디언에서 Zettelkasten(제텔카스텐) 방법론을 적용하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. 제텔카스텐의 핵심 원리를 옵시디언 맥락에서 설명해줘:\n   - 원자적 노트(Atomic Note) 원칙\n   - Fleeting → Literature → Permanent 워크플로우\n   - 연결(Link)의 중요성\n\n2. 내 전문분야에서 예시를 들어 실습을 도와줘. [여기에 최근 읽은 책/아티클 제목 입력]을 기반으로:\n   - Fleeting Note 3개를 작성해줘 (짧은 생각 메모)\n   - Literature Note 1개를 작성해줘 (출처 포함 요약)\n   - Permanent Note 3개를 작성해줘 (내 관점으로 재작성, 각각 하나의 아이디어만)\n\n3. 각 노트에 YAML 프론트매터, [[위키링크]], 태그를 포함해줘\n4. 제텔카스텐 전용 Templater 템플릿 3종(Fleeting, Literature, Permanent)도 만들어줘\n5. 옵시디언에서 제텔카스텐을 운영하는 일일/주간 루틴을 제안해줘"
      },
      {
        day: 16,
        title: "콘텐츠 파이프라인 구축",
        summary: "아이디어에서 발행까지의 콘텐츠 제작 워크플로우",
        tags: ["system"],
        details: [
          "콘텐츠 상태 관리: draft → writing → review → published",
          "Kanban 플러그인으로 콘텐츠 보드 만들기",
          "콘텐츠 템플릿: 블로그, 뉴스레터, SNS, 영상 스크립트",
          "Dataview로 콘텐츠 현황 대시보드 구축",
          "실습: 콘텐츠 3개의 아이디어를 파이프라인에 등록"
        ],
        practice: "콘텐츠 파이프라인을 구축하세요: (1) Kanban 보드 생성 (열: Idea → Draft → Writing → Review → Published) (2) 콘텐츠 유형별 Templater 템플릿 2종 제작 (블로그 + 영상 스크립트) (3) Dataview 대시보드로 콘텐츠 현황 자동 집계 (4) 실제 콘텐츠 아이디어 3개를 등록하고 1개는 Draft까지 진행하세요.",
        prompt: "옵시디언에서 콘텐츠 제작 파이프라인을 구축하고 싶어. 내 전문분야는 [여기에 입력]이고, 만들고 싶은 콘텐츠 유형은 [블로그/뉴스레터/유튜브/SNS 중 선택]이야.\n\n다음을 해줘:\n1. 콘텐츠 파이프라인 시스템 설계:\n   - 상태 흐름: idea → outline → draft → writing → review → published\n   - 각 상태별 체크리스트 (다음 단계로 넘어가기 전 확인할 것)\n\n2. Kanban 보드 마크다운을 작성해줘 (Kanban 플러그인 형식)\n\n3. 콘텐츠 유형별 Templater 템플릿 작성:\n   - 블로그 포스트 템플릿 (제목, 타겟 독자, 키워드, 아웃라인, 본문, CTA)\n   - 영상 스크립트 템플릿 (훅, 인트로, 본론, 정리, 썸네일 아이디어)\n   - SNS 포스트 템플릿 (플랫폼, 핵심 메시지, 해시태그)\n\n4. Dataview 콘텐츠 대시보드 쿼리 작성:\n   - 상태별 콘텐츠 수 집계\n   - 최근 발행 콘텐츠 목록\n   - 드래프트 상태에서 오래 머문 콘텐츠 알림\n\n5. 내 전문분야에서 바로 쓸 수 있는 콘텐츠 아이디어 10개를 제안해줘"
      },
      {
        day: 17,
        title: "Obsidian Publish & 공유",
        summary: "노트를 외부에 공유하고 발행하는 방법",
        tags: ["core"],
        details: [
          "Obsidian Publish 소개 ($8/월, 커스텀 도메인, 검색, 그래프뷰)",
          "무료 대안 1: Digital Garden 플러그인 (GitHub + Vercel/Netlify)",
          "무료 대안 2: Quartz v4 - Obsidian 전용 정적 사이트 생성기",
          "무료 대안 3: Enveloppe (GitHub Publisher) - Hugo/Astro/Jekyll 연동",
          "노트를 PDF/이미지로 내보내기",
          "실습: Digital Garden 또는 Quartz로 무료 발행 설정"
        ],
        practice: "발행 방법을 하나 선택하여 설정하세요. 추천: Digital Garden 플러그인으로 GitHub Pages에 무료 배포. 노트 3개에 dg-publish: true를 추가하고 실제로 배포해보세요. 불가하면 노트 2개를 PDF로 내보내기하고 '발행 가이드' 노트를 작성하세요.",
        prompt: "옵시디언 노트를 외부에 공유/발행하는 방법을 설정하고 싶어.\n\n다음을 해줘:\n1. 발행 옵션 비교표를 만들어줘:\n   - Obsidian Publish (유료)\n   - Digital Garden (무료, GitHub+Vercel)\n   - Quartz v4 (무료, 정적사이트)\n   - Enveloppe (무료, Hugo/Astro 연동)\n   - 각각의 장단점, 난이도, 비용, 커스터마이징 수준\n\n2. Digital Garden 플러그인 설정 단계별 가이드:\n   - GitHub 레포 생성\n   - Vercel/Netlify 연동\n   - 플러그인 설정\n   - dg-publish: true로 노트 발행하기\n   - 커스텀 도메인 연결 (선택)\n\n3. 발행용 노트 프론트매터 템플릿을 만들어줘:\n   - dg-publish, dg-home, permalink 등 필드 설명\n\n4. 발행하면 좋을 노트 유형과 발행하면 안 되는 노트 구분 가이드\n5. SEO 기본 설정 팁도 포함해줘"
      },
      {
        day: 18,
        title: "고급 Templater & 자동화",
        summary: "Templater 고급 기능으로 노트 생성 자동화",
        tags: ["plugin", "claude"],
        details: [
          "Templater 스크립트: 조건문, 반복문",
          "외부 명령어 실행 (tp.system)",
          "노트 생성 시 자동 처리 (Folder Templates)",
          "QuickAdd + Templater 조합으로 원클릭 노트 생성",
          "실습: QuickAdd 매크로 3개 설정"
        ],
        practice: "고급 Templater 기능을 활용하세요: (1) 조건문으로 노트 유형에 따라 다른 내용을 삽입하는 템플릿 (2) 반복문으로 주간 할일 목록을 자동 생성하는 템플릿 (3) QuickAdd 매크로 3개 설정 - 빠른 아이디어 캡처, 새 프로젝트 생성, 콘텐츠 아이디어 등록. 각 매크로를 핫키에 바인딩하세요.",
        prompt: "옵시디언 Templater 고급 기능과 QuickAdd 매크로를 설정하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **고급 Templater 템플릿 3개:**\n   - 조건문(if/else) 활용: tp.system.suggester로 노트 유형 선택 → 유형에 따라 다른 섹션 자동 삽입\n   - 반복문(for) 활용: 이번 주 월~일 날짜 자동 생성 주간 플래너\n   - tp.system.command 활용: 외부 명령어로 현재 날씨/시간 가져오기\n\n2. **QuickAdd 매크로 3개 상세 설정 가이드:**\n   - 매크로 1: 빠른 아이디어 캡처 (입력 → Inbox에 노트 생성)\n   - 매크로 2: 새 프로젝트 생성 (프로젝트명 입력 → 템플릿 적용 → 폴더에 배치)\n   - 매크로 3: 콘텐츠 아이디어 등록 (제목+유형 입력 → 콘텐츠 파이프라인에 추가)\n   - 각 매크로의 QuickAdd 설정 화면에서 어떻게 설정하는지 단계별로\n\n3. QuickAdd에서 핫키 바인딩하는 방법\n4. Folder Templates 설정: 특정 폴더에 노트 생성 시 자동 템플릿 적용 방법"
      },
      {
        day: 19,
        title: "웹 클리핑 & 외부 정보 수집",
        summary: "외부 정보를 Obsidian으로 효율적으로 가져오기",
        tags: ["plugin"],
        details: [
          "Obsidian Web Clipper 브라우저 확장 프로그램",
          "Readwise + Obsidian 연동 (하이라이트 동기화)",
          "RSS 피드 수집 (Feedreader 플러그인)",
          "마크다운 변환기 활용",
          "실습: 관심 분야 기사 5개를 클리핑해서 정리"
        ],
        practice: "Obsidian Web Clipper를 브라우저에 설치하고, 전문 분야 관련 웹 기사/블로그 5개를 클리핑하여 Vault로 가져오세요. 각 클리핑 노트에 출처, 날짜, 핵심 요약, 내 생각을 추가하세요. 클리핑 전용 Templater 템플릿을 만들고, '읽기 목록' Dataview 쿼리도 작성하세요.",
        prompt: "옵시디언으로 외부 정보를 체계적으로 수집하는 시스템을 만들고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **웹 클리핑 워크플로우 설계:**\n   - Obsidian Web Clipper 설치 및 설정 가이드\n   - 클리핑 시 자동 적용할 템플릿 (출처, URL, 날짜, 태그, 요약, 내 생각 섹션)\n   - 도메인별 커스텀 템플릿 설정 (YouTube, Reddit, 블로그 등)\n\n2. **정보 수집 파이프라인:**\n   - Inbox → 읽기 → 하이라이트 → 정리 → 연결 단계\n   - 각 단계별 처리 방법\n\n3. **Readwise 연동 가이드** (사용하는 경우):\n   - Readwise → Obsidian 동기화 설정\n   - 하이라이트 자동 동기화 템플릿\n\n4. **읽기 목록 관리 시스템:**\n   - Dataview 쿼리: 읽을 것 / 읽는 중 / 완료 분류\n   - 출처 유형별(책, 논문, 아티클, 영상) 필터링\n\n5. 내 전문분야에서 팔로우하면 좋은 정보 소스(블로그, 뉴스레터, RSS) 10개를 추천해줘"
      },
      {
        day: 20,
        title: "모바일 & 동기화 설정",
        summary: "멀티 디바이스 환경 구축",
        tags: ["core"],
        details: [
          "Obsidian Sync 소개 (유료)",
          "무료 대안: iCloud, Google Drive, Syncthing",
          "Git 기반 동기화 (Obsidian Git 플러그인)",
          "모바일 앱 최적화 설정",
          "실습: 동기화 방식 선택 및 설정 완료"
        ],
        practice: "동기화 방식을 하나 선택하여 설정을 완료하세요. 추천: Obsidian Git 플러그인 (무료). GitHub Private Repo를 생성하고, 자동 백업(5분마다 auto-commit)을 설정하세요. 모바일에서도 Vault를 열어보세요. 동기화 충돌 해결 방법도 테스트하세요.",
        prompt: "옵시디언 멀티 디바이스 동기화를 설정하고 싶어. PC(Windows)와 모바일(아이폰/안드로이드)에서 같은 Vault를 사용하고 싶어.\n\n다음을 해줘:\n1. **동기화 옵션 비교표:**\n   - Obsidian Sync (유료, $4/월)\n   - iCloud (무료, Apple 전용)\n   - Google Drive (무료, 안드로이드)\n   - Obsidian Git (무료, 모든 플랫폼)\n   - Syncthing (무료, P2P)\n   - 각각의 장단점, 안정성, 설정 난이도\n\n2. **Obsidian Git 설정 완전 가이드 (추천):**\n   - GitHub Private Repo 생성\n   - Git 설치 및 초기 설정\n   - Obsidian Git 플러그인 설치 및 설정\n   - 자동 백업 간격 설정 (auto-commit, auto-push)\n   - .gitignore 파일 설정 (workspace, 플러그인 캐시 제외)\n   - 모바일에서 Git 동기화 방법\n\n3. **동기화 충돌 해결 가이드**: 같은 파일을 동시에 수정했을 때 대처법\n4. **모바일 앱 최적화 설정**: 모바일에서 유용한 플러그인, UI 설정 팁"
      },
      {
        day: 21,
        title: "3주차 복습 & 지식 체계 점검",
        summary: "전체 시스템 점검 및 최적화",
        tags: ["system"],
        details: [
          "Vault 전체 구조 리뷰",
          "고아 노트(연결 없는 노트) 정리",
          "태그 체계 정리 및 통일",
          "그래프 뷰로 지식 연결 상태 확인",
          "실습: 지식 체계 점검 체크리스트 완료"
        ],
        practice: "전체 Vault를 점검하세요: (1) 그래프 뷰에서 고아 노트를 찾아 연결 또는 정리 (2) 태그를 전체 리뷰하고 중복/비일관성 수정 (3) MOC이 모든 주요 노트를 포함하는지 확인 (4) Dataview로 Vault 통계 생성 (총 노트 수, 태그 수, 평균 연결 수) (5) '3주차 회고' 노트 작성.",
        prompt: "옵시디언 3주차 학습을 마무리하면서 Vault 전체를 점검하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **Vault 건강 점검 체크리스트**를 만들어줘:\n   - [ ] 고아 노트 찾기 (연결 없는 노트) - 검색 방법 포함\n   - [ ] 태그 일관성 점검 - 중복 태그, 오타 태그 찾기\n   - [ ] MOC 완전성 점검 - 누락된 노트 확인\n   - [ ] 프론트매터 일관성 점검\n   - [ ] 폴더 구조 리뷰\n   - [ ] 빈 노트, 미완성 노트 정리\n\n2. **Dataview Vault 통계 대시보드** 쿼리를 작성해줘:\n   - 총 노트 수, 폴더별 노트 수\n   - 태그별 노트 수 TOP 10\n   - 가장 많이 링크된 노트 TOP 10\n   - 최근 30일 생성/수정 활동 현황\n   - 고아 노트 목록\n\n3. **3주차 학습 회고 노트** 템플릿:\n   - 이번 주 배운 핵심 (Zettelkasten, 콘텐츠 파이프라인, 발행, 동기화)\n   - 잘한 점 / 개선할 점\n   - 4주차 목표 설정\n\n4. 그래프 뷰 분석 팁: 어떤 패턴을 보면 좋은 Vault인지, 개선이 필요한지"
      }
    ]
  },
  // ========== WEEK 4: 자동화 - Claude & AI ==========
  {
    week: 4,
    title: "4주차: 자동화 - Claude Code & AI 통합",
    description: "Claude Code로 Obsidian 자동화, AI 워크플로우 구축",
    days: [
      {
        day: 22,
        title: "Claude Code 기초 & Vault 연동",
        summary: "Claude Code로 Obsidian Vault 파일 다루기",
        tags: ["claude"],
        details: [
          "Claude Code CLI 기본 사용법",
          "Vault 폴더를 작업 디렉토리로 설정",
          "Claude Code로 마크다운 파일 읽기/쓰기/검색",
          "CLAUDE.md 파일에 Vault 규칙 설정 (네이밍, 태그, 폴더 규칙)",
          "Obsidian MCP Server 개념 소개 - Claude가 Vault를 직접 조작",
          "실습: Claude Code로 노트 3개 자동 생성"
        ],
        practice: "Claude Code CLI에서 Vault 폴더를 작업 디렉토리로 열고, CLAUDE.md 파일을 작성하세요 (Vault 규칙: 네이밍 컨벤션, 태그 체계, 폴더 구조 정의). Claude Code에게 '내 전문분야의 핵심 개념 노트 3개를 만들어줘'라고 요청하여 실제로 노트를 자동 생성하세요.",
        prompt: "나는 옵시디언 Vault를 Claude Code로 관리하고 자동화하려고 해. 내 전문분야는 [여기에 입력]이야. Vault 경로는 [여기에 Vault 경로 입력]이야.\n\n다음을 해줘:\n1. **CLAUDE.md 파일 작성**: 이 Vault의 규칙을 정의해줘:\n   - 폴더 구조 설명 (PARA 기반)\n   - 파일 네이밍 컨벤션\n   - YAML 프론트매터 필수 필드와 형식\n   - 태그 체계\n   - 노트 작성 시 지켜야 할 규칙 (마크다운 스타일, 링크 규칙)\n\n2. **내 전문분야의 핵심 개념 노트 3개를 실제로 생성해줘:**\n   - CLAUDE.md 규칙에 맞게\n   - YAML 프론트매터 포함\n   - 개념 설명, 관련 개념 [[링크]], 실무 적용 예시 포함\n   - 적절한 폴더에 배치\n\n3. 생성 후 Vault 구조를 확인하고 잘 배치되었는지 점검해줘"
      },
      {
        day: 23,
        title: "Claude Code로 템플릿 자동화",
        summary: "Claude Code 스크립트로 반복 작업 자동화",
        tags: ["claude"],
        details: [
          "일괄 노트 생성 스크립트",
          "기존 노트에 메타데이터 자동 추가",
          "노트 내용 기반 자동 태그 추출",
          "폴더 구조 자동 생성 및 정리",
          "실습: 특정 주제의 노트 10개를 Claude로 일괄 생성"
        ],
        practice: "Claude Code로 다음 자동화 작업을 수행하세요: (1) 전문분야 하위 주제 10개에 대한 노트를 일괄 생성 (2) 기존 노트 중 YAML이 없는 노트를 찾아 자동으로 프론트매터 추가 (3) 모든 노트를 스캔하여 자동 태그 제안 받기.",
        prompt: "Claude Code로 내 옵시디언 Vault에서 대량 자동화 작업을 하고 싶어. Vault 경로는 [여기에 입력]이야. 내 전문분야는 [여기에 입력]이야.\n\n다음 작업을 순서대로 해줘:\n\n1. **일괄 노트 생성**: 내 전문분야의 핵심 하위 주제 10개를 선정하고, 각각에 대한 노트를 자동 생성해줘:\n   - YAML 프론트매터 (title, tags, date, category, status: draft)\n   - 개요 (2~3문단)\n   - 핵심 포인트 (리스트)\n   - 관련 개념 [[링크]]\n   - 적절한 폴더에 배치\n\n2. **메타데이터 자동 추가**: Vault 내 YAML 프론트매터가 없는 노트를 찾아서, 파일명과 내용을 기반으로 적절한 프론트매터를 자동 추가해줘\n\n3. **자동 태그 추출**: 모든 노트를 스캔하고, 내용을 분석하여 추가하면 좋을 태그를 제안해줘 (파일명: 현재태그 → 추천태그 형식으로)\n\n4. 작업 완료 후 변경 사항 요약 리포트를 작성해줘"
      },
      {
        day: 24,
        title: "AI 기반 콘텐츠 생성 워크플로우",
        summary: "Claude를 활용한 콘텐츠 초안 작성 파이프라인",
        tags: ["claude"],
        details: [
          "전문 지식 노트 → 블로그 초안 자동 변환",
          "Claude로 노트 요약 및 정리 자동화",
          "시리즈 콘텐츠 아웃라인 자동 생성",
          "SEO 최적화 메타데이터 자동 생성",
          "실습: 기존 노트 3개를 블로그 초안으로 변환"
        ],
        practice: "Claude에게 Vault의 기존 전문지식 노트 3개를 읽게 하고, 각각을 (1) 블로그 포스트 초안 (2) SNS 요약 포스트 (3) 뉴스레터 섹션으로 변환하세요. 또한 전문분야에서 10편짜리 시리즈 콘텐츠 아웃라인을 생성하세요.",
        prompt: "내 옵시디언 Vault에 있는 전문지식 노트를 발행 가능한 콘텐츠로 변환하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **Vault 분석**: 내 Vault에서 콘텐츠로 변환하기 좋은 노트를 찾아줘 (내용이 충실하고, 독자에게 가치 있는 것)\n\n2. **블로그 포스트 변환**: 선택한 노트 3개를 각각 블로그 포스트 초안으로 변환해줘:\n   - 매력적인 제목 (3개 후보)\n   - 도입부 (훅 + 독자의 문제 공감)\n   - 본문 (전문지식을 쉽게 풀어서)\n   - 실행 가능한 조언\n   - 마무리 & CTA\n   - SEO 메타데이터 (description, keywords)\n\n3. **SNS 요약**: 각 포스트를 LinkedIn/Twitter용 요약 포스트로도 변환해줘\n\n4. **시리즈 콘텐츠 기획**: 내 전문분야에서 10편짜리 콘텐츠 시리즈를 기획해줘:\n   - 시리즈 제목\n   - 각 편의 주제, 핵심 메시지, 사용할 Vault 노트 참조\n   - 발행 순서와 일정 제안\n\n5. 모든 결과물을 옵시디언 노트로 저장해줘 (적절한 폴더와 프론트매터 포함)"
      },
      {
        day: 25,
        title: "Dataview + Claude 대시보드 고도화",
        summary: "AI로 대시보드와 인덱스 노트 자동 갱신",
        tags: ["claude", "plugin"],
        details: [
          "Claude Code로 Dataview 쿼리 자동 생성",
          "MOC 자동 업데이트 스크립트",
          "주간/월간 리뷰 노트 자동 생성",
          "통계 대시보드 자동 갱신",
          "실습: 자동 갱신되는 주간 리뷰 시스템 구축"
        ],
        practice: "Claude Code로: (1) 현재 Vault 상태를 분석하여 최적의 Dataview 쿼리 5개를 자동 생성 (2) MOC을 현재 노트 현황에 맞게 자동 업데이트 (3) 이번 주의 활동을 분석하여 주간 리뷰 노트를 자동 생성. Vault 통계 리포트도 생성하세요.",
        prompt: "Claude Code로 내 옵시디언 Vault의 대시보드와 인덱스를 자동 갱신하고 싶어. Vault 경로는 [여기에 입력]이야.\n\n다음을 순서대로 해줘:\n\n1. **Vault 분석**: 현재 Vault의 전체 구조를 분석해줘:\n   - 폴더별 노트 수\n   - 태그 빈도 TOP 20\n   - 가장 많이 링크된 노트 TOP 10\n   - 고아 노트 목록\n   - 최근 1주일 생성/수정 활동\n\n2. **최적 Dataview 쿼리 생성**: 내 Vault 구조에 맞는 맞춤형 Dataview 쿼리 5개를 만들어줘 (기존 대시보드 보강용)\n\n3. **MOC 자동 업데이트**: 기존 MOC 노트를 읽고, 새로 추가된 노트를 반영하여 MOC을 업데이트해줘\n\n4. **주간 리뷰 노트 자동 생성**: 이번 주 활동을 분석하여 주간 리뷰 노트를 만들어줘:\n   - 이번 주 생성한 노트 목록\n   - 이번 주 완료한 태스크\n   - 가장 활발했던 주제 영역\n   - 다음 주 제안 사항\n\n5. **Vault 통계 리포트**를 마크다운 노트로 저장해줘"
      },
      {
        day: 26,
        title: "AI 플러그인 & MCP 연동",
        summary: "Obsidian AI 플러그인과 MCP 서버 활용",
        tags: ["claude", "plugin"],
        details: [
          "Smart Connections 플러그인: AI 임베딩으로 유사 노트 자동 탐색",
          "Obsidian Copilot 플러그인: Vault 내용 기반 RAG 채팅",
          "Text Generator 플러그인: Claude/GPT API로 노트 내 텍스트 생성",
          "Obsidian Local REST API: 외부에서 HTTP로 Vault 조작 (포트 27123)",
          "Make/Zapier 연동: RSS→노트, 이메일→노트 자동화 플로우",
          "실습: AI 플러그인 1개 + 자동화 플로우 1개 구축"
        ],
        practice: "AI 플러그인 최소 1개를 설치하고 활용하세요 (추천: Smart Connections 또는 Text Generator). Smart Connections로 유사 노트 탐색을 해보거나, Text Generator로 노트 요약을 자동 생성해보세요. 추가로 Local REST API 플러그인을 설치하고 curl 명령으로 노트를 읽어보세요.",
        prompt: "옵시디언에 AI 플러그인을 설치하고 활용하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **AI 플러그인 비교 & 추천:**\n   - Smart Connections: 장단점, 설정법, 활용법\n   - Obsidian Copilot: 장단점, 설정법, 활용법\n   - Text Generator: 장단점, 설정법, 활용법\n   - 어떤 플러그인을 먼저 설치하면 좋을지 추천\n\n2. **Smart Connections 설정 가이드:**\n   - API 키 설정 (OpenAI/Claude/로컬 모델)\n   - 임베딩 생성\n   - 유사 노트 탐색 활용법\n   - 대화 기능으로 Vault에 질문하기\n\n3. **Text Generator 커스텀 프롬프트 템플릿 3개:**\n   - 노트 요약 생성\n   - 관련 질문 생성\n   - 콘텐츠 아이디어 확장\n\n4. **Local REST API 활용:**\n   - 플러그인 설치 및 설정\n   - curl 명령 예시: 노트 읽기, 검색, 생성\n   - 이것으로 가능한 자동화 시나리오\n\n5. **Make/Zapier 자동화 시나리오 1개 상세 설계:**\n   - RSS 피드 → 옵시디언 노트 자동 생성 플로우"
      },
      {
        day: 27,
        title: "Git 기반 버전관리 & 백업",
        summary: "Obsidian Vault를 Git으로 체계적으로 관리",
        tags: ["claude"],
        details: [
          "Obsidian Git 플러그인 설정",
          "자동 커밋 & 푸시 설정",
          "GitHub Private Repo와 연동",
          "Claude Code로 커밋 메시지 자동화",
          "실습: Git 기반 백업 시스템 완성"
        ],
        practice: "Obsidian Git 플러그인 또는 CLI로 Vault를 GitHub Private Repo에 연동하세요. .gitignore 파일을 설정하고(워크스페이스, 캐시 제외), 자동 커밋을 5분 간격으로 설정하세요. 첫 커밋을 완료하고, 의미 있는 변경을 만들어 두 번째 커밋도 하세요.",
        prompt: "옵시디언 Vault를 Git으로 버전관리하고 GitHub에 백업하고 싶어. Vault 경로는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **Git 초기 설정:**\n   - Vault 폴더에서 git init\n   - .gitignore 파일 생성 (제외할 파일/폴더 목록 포함)\n   - GitHub Private Repo 생성 가이드\n   - remote 연결 및 첫 push\n\n2. **Obsidian Git 플러그인 설정:**\n   - 자동 커밋 간격 (추천: 5분)\n   - 자동 push 설정\n   - 커밋 메시지 형식 설정\n   - startup pull 설정\n\n3. **.gitignore 최적 설정:**\n   - .obsidian/workspace.json (자주 변경되므로 제외)\n   - .obsidian/cache/\n   - .trash/\n   - 기타 제외 추천 파일\n\n4. **백업 & 복원 가이드:**\n   - 다른 기기에서 clone하여 Vault 복원하는 방법\n   - 실수로 삭제한 노트 복원하는 방법 (git checkout)\n   - 버전 히스토리 확인하는 방법\n\n5. 첫 커밋을 실행하고 결과를 확인해줘"
      },
      {
        day: 28,
        title: "전문 지식 아카이빙 시스템 완성",
        summary: "주제별 지식 아카이브 최종 구축",
        tags: ["system", "claude"],
        details: [
          "전문 분야별 최종 MOC 구조 완성",
          "Claude Code로 누락 링크 자동 탐지 및 연결",
          "지식 갭(gap) 분석 - 보충이 필요한 영역 식별",
          "레퍼런스 & 출처 관리 시스템 정리",
          "실습: 전문 분야 아카이브 최종 점검 및 보완"
        ],
        practice: "Claude Code로 Vault 전체를 분석하세요: (1) 모든 노트 간 링크를 검사하여 연결되어야 하지만 안 된 노트 쌍을 탐지 (2) 전문분야 지식맵에서 빠져있는 주제(gap) 식별 (3) 레퍼런스/출처 정보가 없는 노트 찾기. 결과를 바탕으로 보충 노트 3개를 생성하세요.",
        prompt: "내 옵시디언 Vault의 전문지식 아카이브를 최종 점검하고 완성하고 싶어. Vault 경로는 [여기에 입력]이야. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **링크 분석:**\n   - 모든 노트의 [[링크]]를 분석해줘\n   - 내용적으로 연결되어야 하지만 링크가 없는 노트 쌍을 찾아줘\n   - 깨진 링크(존재하지 않는 노트 참조)도 찾아줘\n\n2. **지식 갭 분석:**\n   - 현재 Vault에 있는 주제들을 맵핑하고\n   - 내 전문분야에서 빠져있는 중요한 주제를 식별해줘\n   - 보충이 필요한 영역 TOP 5를 제안해줘\n\n3. **보충 노트 생성:**\n   - 지식 갭 분석에서 나온 TOP 3 주제에 대한 노트를 생성해줘\n   - 기존 노트들과 [[링크]]로 연결해줘\n\n4. **출처 관리 점검:**\n   - 출처/레퍼런스가 없는 노트 목록\n   - 출처 관리 시스템 (별도 References 폴더 또는 인라인 출처) 추천\n\n5. **최종 MOC 업데이트**: 모든 변경사항을 반영하여 MOC을 갱신해줘"
      },
      {
        day: 29,
        title: "나만의 워크플로우 최적화",
        summary: "전체 시스템 최적화 및 단축키 세팅",
        tags: ["system"],
        details: [
          "자주 쓰는 액션 핫키 설정",
          "Commander 플러그인으로 커맨드 팔레트 최적화",
          "Workspace 플러그인으로 레이아웃 저장",
          "성능 최적화: 불필요한 플러그인 정리",
          "실습: 나만의 최적 워크플로우 문서화"
        ],
        practice: "자주 쓰는 액션 10개에 핫키를 설정하세요. Workspace 레이아웃 3개를 저장하세요 (글쓰기 모드, 리서치 모드, 리뷰 모드). 불필요한 플러그인을 비활성화하고, 성능 체감을 확인하세요. '나의 Obsidian 워크플로우 가이드' 노트를 작성하세요.",
        prompt: "옵시디언 워크플로우를 최적화하고 나만의 가이드를 만들고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **핫키 추천 TOP 15:**\n   - 가장 자주 쓰는 액션과 추천 단축키 조합\n   - 기본 핫키 + 커스텀 핫키 구분\n   - 플러그인별 핫키 (Templater, QuickAdd, Dataview 등)\n\n2. **Workspace 레이아웃 3개 설계:**\n   - 글쓰기 모드: 집중 모드, 최소 UI\n   - 리서치 모드: 사이드바+에디터+백링크 3분할\n   - 리뷰 모드: 그래프뷰+에디터+아웃라인\n\n3. **성능 최적화 가이드:**\n   - 비활성화해도 되는 플러그인 기준\n   - 큰 Vault에서 성능을 높이는 설정\n   - Dataview 쿼리 최적화 팁\n\n4. **나의 Obsidian 워크플로우 가이드** 노트를 작성해줘:\n   - 일일 루틴 (아침에 할 일, 저녁에 할 일)\n   - 주간 루틴 (주간 리뷰, MOC 업데이트)\n   - 월간 루틴 (아카이브 정리, 태그 점검)\n   - 각 상황별 사용할 도구와 워크플로우\n\n5. **커맨드 팔레트 최적화**: Commander로 추가하면 좋을 커맨드와 위치"
      },
      {
        day: 30,
        title: "마스터 졸업 & 지속 학습 계획",
        summary: "30일 학습 총정리 및 앞으로의 계획",
        tags: ["system"],
        details: [
          "30일 학습 회고 노트 작성",
          "앞으로의 주간/월간 루틴 설정",
          "Obsidian 커뮤니티 참여: Discord, 포럼",
          "플러그인 개발 입문 (선택사항)",
          "실습: 지속 학습 계획서 작성 & 시스템 최종 완성"
        ],
        practice: "30일 전체를 회고하는 종합 노트를 작성하세요. 포함할 내용: Day 1 Vault vs 현재 Vault 비교, 가장 유용했던 기능/플러그인 TOP 5, 앞으로의 주간/월간 루틴 계획, 다음에 도전할 고급 기능 목록. Vault 전체 현황 리포트를 최종 생성하세요.",
        prompt: "옵시디언 30일 마스터 과정을 완료했어! 최종 정리를 하고 싶어. 내 전문분야는 [여기에 입력]이야.\n\n다음을 해줘:\n1. **30일 학습 회고 노트** 작성:\n   - 1주차~4주차 학습 요약\n   - 가장 유용했던 기능/플러그인 TOP 5\n   - 가장 어려웠던 부분과 극복 방법\n   - Day 1 대비 현재 Vault 성장 측정 (노트 수, 연결 수, 시스템 완성도)\n\n2. **지속 학습 & 유지보수 계획:**\n   - 일일 루틴 (5분): 데일리 노트, Inbox 처리\n   - 주간 루틴 (30분): 주간 리뷰, MOC 업데이트, 태스크 정리\n   - 월간 루틴 (1시간): 아카이브 정리, 태그 점검, 그래프 분석\n   - 분기 루틴: 전체 시스템 재점검, 플러그인 업데이트\n\n3. **다음 단계 로드맵:**\n   - 도전할 고급 기능 (플러그인 개발, CSS 커스터마이징, API 연동)\n   - 참여할 커뮤니티 (Obsidian Discord, 포럼, Reddit)\n   - 참고할 고급 리소스 목록\n\n4. **최종 Vault 리포트**: 현재 Vault의 완전한 현황을 분석하고 리포트로 작성해줘\n\n5. 마스터 졸업 축하 & 동기부여 메시지도 포함해줘!"
      }
    ]
  }
];

const YOUTUBE_DATA = {
  korean: [
    {
      section: "입문/기초 강의",
      items: [
        { title: "옵시디언 완전 기초 - 처음 시작하기", channel: "생산성 연구소", desc: "설치부터 기본 사용법까지 친절한 설명", search: "옵시디언 기초 사용법 생산성" },
        { title: "옵시디언 입문 가이드 시리즈", channel: "테디노트 TeddyNote", desc: "개발자 관점의 체계적인 옵시디언 입문 강의", search: "테디노트 옵시디언" },
        { title: "옵시디언 시작하기 - 노트앱 끝판왕", channel: "노마드 코더 Nomad Coders", desc: "개발자를 위한 옵시디언 소개", search: "노마드 코더 옵시디언" },
        { title: "옵시디언 제텔카스텐 세팅", channel: "독서광 김겨울", desc: "독서 노트를 위한 제텔카스텐 실전 적용", search: "옵시디언 제텔카스텐 김겨울" },
        { title: "옵시디언으로 두 번째 뇌 만들기", channel: "슬기로운 생활 Sapientia", desc: "Second Brain 개념과 옵시디언 활용법", search: "옵시디언 두번째뇌 세컨드브레인" }
      ]
    },
    {
      section: "중급/플러그인 강의",
      items: [
        { title: "옵시디언 Dataview 플러그인 완전정복", channel: "코딩하는 약사", desc: "Dataview 쿼리 기초부터 고급까지", search: "옵시디언 dataview 플러그인 한글" },
        { title: "옵시디언 Templater 자동화", channel: "생산성 연구소", desc: "Templater 플러그인으로 노트 자동화하기", search: "옵시디언 templater 한글 강의" },
        { title: "옵시디언 캔버스 200% 활용법", channel: "지식 공장", desc: "Canvas 기능을 활용한 비주얼 사고 방법", search: "옵시디언 캔버스 활용" },
        { title: "옵시디언 + Notion 비교 & 워크플로우", channel: "올디Oldy", desc: "노션에서 옵시디언으로 이전하기", search: "옵시디언 노션 비교 이전" },
        { title: "옵시디언 Git 동기화 설정", channel: "코딩하는 약사", desc: "무료로 멀티디바이스 동기화하기", search: "옵시디언 git 동기화 한글" }
      ]
    },
    {
      section: "고급/시스템 강의",
      items: [
        { title: "옵시디언 PARA 시스템 구축", channel: "생산성 채널", desc: "Tiago Forte의 PARA 방법론 옵시디언 적용", search: "옵시디언 PARA 시스템 구축" },
        { title: "옵시디언 MOC 지식관리", channel: "생산성 채널", desc: "Map of Content로 지식 체계 만들기", search: "옵시디언 MOC 지식관리 한글" },
        { title: "옵시디언으로 블로그 운영하기", channel: "디지털 가든", desc: "Digital Garden / Quartz로 무료 블로그", search: "옵시디언 디지털가든 블로그 만들기" },
        { title: "옵시디언 + AI 활용법", channel: "AI/생산성 채널", desc: "ChatGPT/Claude와 옵시디언 연동 워크플로우", search: "옵시디언 AI chatgpt claude 활용법" },
        { title: "옵시디언 고급 자동화 워크플로우", channel: "자동화 채널", desc: "Templater + QuickAdd + Dataview 연동 자동화", search: "옵시디언 자동화 워크플로우 templater quickadd" }
      ]
    },
    {
      section: "직접 검색용 추천 키워드",
      items: [
        { title: "옵시디언 초보자 가이드", channel: "YouTube 검색", desc: "가장 기본적인 입문 영상을 찾을 수 있는 키워드", search: "옵시디언 초보자 가이드 시작하기 2025" },
        { title: "옵시디언 플러그인 추천 TOP", channel: "YouTube 검색", desc: "인기 플러그인 소개 영상 모음", search: "옵시디언 플러그인 추천 필수 TOP 2025" },
        { title: "옵시디언 제텔카스텐 세팅", channel: "YouTube 검색", desc: "Zettelkasten 방법론 한국어 적용 가이드", search: "옵시디언 제텔카스텐 세팅 방법" },
        { title: "옵시디언 세컨드브레인 만들기", channel: "YouTube 검색", desc: "Second Brain / 두 번째 뇌 구축 영상", search: "옵시디언 세컨드브레인 두번째뇌 노트정리" },
        { title: "옵시디언 노션 비교 이전", channel: "YouTube 검색", desc: "노션에서 옵시디언으로 전환하는 방법", search: "옵시디언 노션 비교 장단점 이전방법" }
      ]
    }
  ],
  international: [
    {
      section: "International (영어) 핵심 채널 - 필수 시청",
      items: [
        { title: "Linking Your Thinking (LYT) Workshop", channel: "Nick Milo", desc: "MOC 방법론 창시자의 무료 워크숍. 지식 관리의 바이블. Vault 설계 철학의 교과서", url: "https://www.youtube.com/@linkingyourthinking", search: "Nick Milo Linking Your Thinking Obsidian" },
        { title: "Obsidian for Beginners + 200 Episodes", channel: "Nicole van der Hoeven", desc: "가장 체계적인 옵시디언 시리즈. 플러그인 리뷰, 워크플로우, Dataview 튜토리얼 총집합", url: "https://www.youtube.com/@nicolevdh", search: "Nicole van der Hoeven Obsidian" },
        { title: "Obsidian Workflows & Tutorials", channel: "Danny Hatcher", desc: "실전 워크플로우 중심의 상세한 가이드. 초보자 친화적", url: "https://www.youtube.com/@DannyHatcher", search: "Danny Hatcher Obsidian workflow" },
        { title: "Zettelkasten in Obsidian", channel: "Bryan Jenks", desc: "제텔카스텐 방법론과 학술 연구 워크플로우의 최고 전문가", url: "https://www.youtube.com/@BryanJenks", search: "Bryan Jenks Obsidian Zettelkasten" },
        { title: "Visual PKM & Excalidraw", channel: "Zsolt Viczian", desc: "Excalidraw/ExcaliBrain 플러그인 제작자. 비주얼 사고와 다이어그램 마스터", url: "https://www.youtube.com/@VisualPKM", search: "Zsolt Visual PKM Obsidian Excalidraw" },
        { title: "Building a Second Brain", channel: "Tiago Forte", desc: "BASB(Building a Second Brain) & PARA 방법론 저자의 직강", url: "https://www.youtube.com/@TiagoForte", search: "Tiago Forte second brain Obsidian" },
        { title: "Obsidian Templates & CSS", channel: "From Sergio", desc: "Dataview 쿼리, 템플릿, CSS 스니펫 심층 튜토리얼", search: "From Sergio Obsidian Dataview tutorial" },
        { title: "Obsidian for Remote Workers", channel: "Santi Younger", desc: "초보자 친화적인 셋업 가이드와 생산성 워크플로우", search: "Santi Younger Obsidian setup guide" }
      ]
    }
  ]
};
