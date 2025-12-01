const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 커밋 메시지 파일 읽기
const COMMIT_MSG_FILE = process.argv[2];

if (!COMMIT_MSG_FILE) {
  process.exit(0);
}

// 프로젝트 루트 디렉토리 찾기 (package.json이 있는 곳)
// __dirname은 .husky 폴더이므로 한 단계 위로
let projectRoot = path.resolve(__dirname, '..');

// package.json 확인
if (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
  // 한 단계 더 위로 (혹시 모를 경우)
  projectRoot = path.resolve(projectRoot, '..');
}

// 프로젝트 루트로 이동
process.chdir(projectRoot);

// 커밋 메시지 파일 경로 정규화 (Windows 경로 처리)
const normalizedMsgFile = path.resolve(COMMIT_MSG_FILE);
let COMMIT_MSG = fs.readFileSync(normalizedMsgFile, 'utf-8').trim();

// Gitmoji 매핑 테이블
const GITMOJI_MAP = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '💄',
  refactor: '♻️',
  perf: '⚡',
  test: '✅',
  chore: '🔧',
  ci: '👷',
  ticket: '🎫',
  revert: '⏪',
  build: '📦',
  security: '🔒',
  ui: '🎨',
  hotfix: '🚑',
};

// 이미 이모지가 있는지 확인
const hasEmoji = /^[✨🐛📝💄♻️⚡✅🔧👷🎫⏪📦🔒🎨🚑]/.test(COMMIT_MSG);

if (!hasEmoji) {
  // 타입 추출 (feat : 또는 feat: 형식 지원)
  const typeMatch = COMMIT_MSG.match(/^([a-z]+)[ ]*:/);
  
  if (typeMatch) {
    const type = typeMatch[1];
    const emoji = GITMOJI_MAP[type];
    
    if (emoji) {
      // 이모지 추가 (공백 정리)
      COMMIT_MSG = COMMIT_MSG.replace(/^([a-z]+)[ ]*:/, `${emoji} $1:`);
    }
  }
}

// commitlint 검증을 위해 이모지 제거한 임시 메시지 생성
const CLEAN_MSG = COMMIT_MSG.replace(/^[✨🐛📝💄♻️⚡✅🔧👷🎫⏪📦🔒🎨🚑]\s+/, '');
const TEMP_FILE = path.join(path.dirname(normalizedMsgFile), `${path.basename(normalizedMsgFile)}.tmp`);

try {
  // 임시 파일에 깨끗한 메시지 저장
  fs.writeFileSync(TEMP_FILE, CLEAN_MSG, 'utf-8');
  
  // commitlint 검증 (임시 파일 사용)
  // Windows 경로 처리: 따옴표로 감싸기
  const tempFileQuoted = process.platform === 'win32' 
    ? `"${TEMP_FILE.replace(/\\/g, '/')}"` 
    : `"${TEMP_FILE}"`;
  
  execSync(`npx --no-install commitlint --edit ${tempFileQuoted}`, {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: true,
  });
  
  // 검증 통과 시 원본 파일에 이모지 포함 메시지 저장
  fs.writeFileSync(normalizedMsgFile, COMMIT_MSG, 'utf-8');
  
  // 임시 파일 삭제
  if (fs.existsSync(TEMP_FILE)) {
    fs.unlinkSync(TEMP_FILE);
  }
} catch (error) {
  // 에러 발생 시 임시 파일 삭제
  if (fs.existsSync(TEMP_FILE)) {
    try {
      fs.unlinkSync(TEMP_FILE);
    } catch (e) {
      // 무시
    }
  }
  process.exit(1);
}

