<template>
    <div class="ascii-test-page">
        <!-- ASCII 로고 컨테이너 -->
        <div 
            ref="asciiContainer" 
            class="ascii-container"
        >
            <!-- AsciiEffect가 여기에 DOM 요소를 추가함 -->
        </div>
        
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading">
            Loading GLB model...
        </div>
        
        <!-- 에러 상태 -->
        <div v-if="error" class="error">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'

// 반응형 데이터
const asciiContainer = ref<HTMLElement | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string>('')
  
  // Three.js 변수들
  let scene: any = null
  let camera: any = null
  let renderer: any = null
  let asciiEffect: any = null
  let controls: any = null
  let animationId: number | null = null
  
  const mousePosition = {
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    hasMoved: false
  }
  
  // ASCII 로고 회전 상수들 - 적당한 반응성
  const ASCII_LOGO_ROTATION_SCALAR = 0.4  // 1.0 → 0.4로 조정 (적당한 민감도)
  const ASCII_AUTO_ROTATION_SPEED = 0.0005
  const ASCII_AUTO_ROTATION_MAX_DIST = 0.4
  const ASCII_LOGO_INIT = {
    rotation: { x: Math.PI / 11, y: 0, z: 0 }
  }
  const START_TIME = Date.now()
  const IS_TOUCH_DEVICE = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  
  let model: any = null
  
  //처음 THREEJS 세팅
  const initThreeJS = () => {
    // 1. Scene 생성 (3D 세계의 무대)
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xfafafa) //배경 설정
    console.log('scene.background::::', scene.background);
  
    // 2. Camera 생성
    camera = new THREE.PerspectiveCamera(
      75,  // 시야각 (넓을수록 더 많이 보임)
      window.innerWidth / window.innerHeight,  // 화면 비율
      0.1,  // 가까운 거리 (이것보다 가까우면 안보임)
      1000  // 먼 거리 (이것보다 멀면 안보임)
    )
    camera.position.z = 10 //카메라를 앞으로 10만큼 이동
    console.log('camera::::', camera);
  
    // 3. Render 생성
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('renderer::::', renderer);
  
    //4. AsciiEffect 생성 - 다양한 스타일 옵션들! 🎨
    
    // === 깔끔한 스타일 ===
    // 옵션 1: 매우 깔끔한 배경
    // asciiEffect = new AsciiEffect(renderer, ' .·∘○●', { invert: false, resolution: 0.15 })
    
    // 옵션 2: 미니멀한 배경
    // asciiEffect = new AsciiEffect(renderer, ' .-=+*#', { invert: false, resolution: 0.12 })
    
    // 옵션 3: 블록 스타일 (현재 적용됨)
    //asciiEffect = new AsciiEffect(renderer, ' ░▒▓█', { invert: false, resolution: 0.15 })
    
    // === 재미있는 스타일 ===
    // 옵션 4: 하트 스타일 ♡
    //asciiEffect = new AsciiEffect(renderer, ' .·♡♥', { invert: false, resolution: 0.20 })
    
    // 옵션 5: 별 스타일 ✦
    // asciiEffect = new AsciiEffect(renderer, ' .·✦★', { invert: false, resolution: 0.20 })
    
    // 옵션 6: 다이아몬드 스타일 ◇
    // asciiEffect = new AsciiEffect(renderer, ' .◇◆', { invert: false, resolution: 0.15 })
    
    // === 레트로 스타일 ===
    // 옵션 7: 클래식 ASCII - 배경 보이도록 수정
    asciiEffect = new AsciiEffect(renderer, '.:-=+*%@#', { invert: false, resolution: 0.20 })
    
    // === 배경이 잘 보이는 추천 설정들 ===
    // 추천 : 부드러운 배경  
    // asciiEffect = new AsciiEffect(renderer, '░▒▓█', { invert: false, resolution: 0.18 })
    
    // 추천 : 선명한 배경
    //asciiEffect = new AsciiEffect(renderer, ' .-=+*#@', { invert: false, resolution: 0.25 })
    
    // 옵션 8: 매트릭스 스타일
    // asciiEffect = new AsciiEffect(renderer, ' .:;|!1', { invert: false, resolution: 0.12 })
    
    // === 특수 효과 ===
    // 옵션 9: 파도 효과
    // asciiEffect = new AsciiEffect(renderer, ' ~∼≈', { invert: false, resolution: 0.15 })
    
    // 옵션 10: 점진적 원형
    // asciiEffect = new AsciiEffect(renderer, ' .∘○◯●', { invert: false, resolution: 0.15 })
    
    // 옵션 11: 기하학적
    // asciiEffect = new AsciiEffect(renderer, ' ▫▪◽◾', { invert: false, resolution: 0.15 })
    
    // 옵션 12: 화살표 스타일
    // asciiEffect = new AsciiEffect(renderer, ' .→⇒', { invert: false, resolution: 0.15 })
    asciiEffect.setSize(window.innerWidth, window.innerHeight)
    console.log('asciiEffect::::', asciiEffect);
  
    // 5. Ascii 효과를 HTML에 추가
    asciiContainer.value!.appendChild(asciiEffect.domElement)
  
    // 6. 마우스 이벤트 리스너 등록 (터치 디바이스가 아닌 경우만)
    if (!IS_TOUCH_DEVICE) {
      document.addEventListener('mousemove', handleMouseMove)
    }
  };
  
  
  const setupLights = () => {
    // 전체적으로 밝게 해주는 조명 (그림자 없음)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
  
    // 방향성 조명
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10,10,5);
    scene.add(directionalLight);
  }
  
  const glbLoading = () => {
     // 1. DRACO 로더 설정 (압축된 3D 파일용)
     const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
  
    // 2. gltf 로더 
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
  
    // 3. glb파일 로딩
    loader.load(
      '/models/s_logo.glb',  // 로딩할 파일 경로
      (gltf: any) => {
        console.log('GLB 로딩 성공!', gltf)
        
        // 로딩된 3D 모델을 scene에 추가
        model = gltf.scene
        scene.add(model);
  
        // 모델 초기 설정
        adjustModelSize(model)
        
        // 모델 초기 회전 설정
        model.rotation.set(
          ASCII_LOGO_INIT.rotation.x,
          ASCII_LOGO_INIT.rotation.y,
          ASCII_LOGO_INIT.rotation.z
        )
        //로딩 상태 변경
        isLoading.value = false;
         // 애니메이션 루프 시작 (OrbitControls를 위해 필요)
         animate()
      }
    )
  }
  
  const adjustModelSize = (model: any) => {
     // 모델의 경계 상자 계산 (모델이 얼마나 큰지 측정)
     const box = new THREE.Box3().setFromObject(model);
     const size = box.getSize(new THREE.Vector3()) // 모델의 실제 크기
     const center = box.getCenter(new THREE.Vector3()) // 모델의 중심점
  
     //가장 큰 축을 기준으로 스케일 계산
     const maxAxis = Math.max(size.x, size.y, size.z)
     const scale = 8 / maxAxis // copypage.vue와 비슷한 크기로 조정 
      
      // 모델 크기 조절
      model.scale.setScalar(scale);
      
      // 모델을 중앙으로 이동
      model.position.set(0, 0, 0)
  }
  
  // Matt Bierman 방식의 마우스 이동 핸들러 - 적당한 반응성
  const handleMouseMove = (e: MouseEvent) => {
    mousePosition.x = e.clientX
    mousePosition.y = e.clientY
    mousePosition.hasMoved = true
    
    // 애니메이션 루프에서 처리하도록 변경 (더 부드러운 움직임)
  }
  
  // ASCII 로고 회전 업데이트
  const updateAsciiLogoRotation = () => {
    const { x: initX, y: initY, z: initZ } = ASCII_LOGO_INIT.rotation
  
    if (!model) return
  
    // 터치 디바이스에서 자동 회전
    if (IS_TOUCH_DEVICE) {
      const timer = Date.now() - START_TIME
      model.rotation.set(
        initX + Math.sin(timer * ASCII_AUTO_ROTATION_SPEED) * ASCII_AUTO_ROTATION_MAX_DIST,
        initY,
        initZ + Math.cos(timer * ASCII_AUTO_ROTATION_SPEED) * ASCII_AUTO_ROTATION_MAX_DIST
      )
      return
    }
  
    // 마우스 기반 회전 - 더 자유로운 움직임
    const { height: vh, width: vw } = getWindowSize()
    
    // 마우스 위치를 -1 ~ 1 범위로 정규화
    const normalizedX = (mousePosition.x / vw) * 2 - 1
    const normalizedY = (mousePosition.y / vh) * 2 - 1
    
    // 적당한 회전 범위 적용 (자연스러운 움직임)
    model.rotation.set(
      initX + normalizedY * Math.PI * 1.2 * ASCII_LOGO_ROTATION_SCALAR,  // Y마우스 → X회전 (적당한 범위)
      initY + normalizedX * Math.PI * 0.8 * ASCII_LOGO_ROTATION_SCALAR,  // X마우스 → Y회전 (부드러운 Y축 회전)
      initZ + normalizedX * Math.PI * 0.3 * ASCII_LOGO_ROTATION_SCALAR   // X마우스 → Z회전 (약간의 Z축 회전)
    )
  }
  
  // 유틸리티 함수들
  const getWindowSize = () => ({
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    width: typeof window !== 'undefined' ? window.innerWidth : 1920
  })
  
  const render = () => {
    // ASCII 로고 회전 업데이트 (마우스가 움직였을 때만)
    if (mousePosition.hasMoved || IS_TOUCH_DEVICE) {
      updateAsciiLogoRotation()
    }
    
    // ASCII 효과 렌더링
    asciiEffect.render(scene, camera)
    
    // 마우스 이동 상태 리셋
    mousePosition.hasMoved = false
  }
  
  const animate = () => {
    // 다음 프레임에서 다시 이 함수 호출 (OrbitControls를 위한 연속 렌더링)
    animationId = requestAnimationFrame(animate)
    
    // 렌더링 실행
    render()
  }
  
  // copypage.vue 방식의 향상된 리사이즈 핸들러
  const handleResize = () => {
    if (!camera || !renderer || !asciiEffect) return
    
    const windowSize = getWindowSize()
    
    // 카메라 종횡비 조정
    camera.aspect = windowSize.width / windowSize.height
    camera.updateProjectionMatrix()
    
    // 렌더러 크기 조정
    renderer.setSize(windowSize.width, windowSize.height)
    
    // ASCII Effect 해상도 조정 (화면 크기에 따라)
    let resolution = 0.12
    
    // 모바일에서는 해상도 낮춤 (성능 최적화)
    if (windowSize.width < 768) {
      resolution = 0.08
    } else if (windowSize.width < 1200) {
      resolution = 0.10
    }
    
    asciiEffect.setSize(windowSize.width, windowSize.height)
    
    // 모바일에서 로고 스케일 조정
    if (model) {
      let scale = 10
      if (windowSize.width < 480) {
        scale = 6
      } else if (windowSize.width < 768) {
        scale = 8
      } else if (windowSize.width < 1200) {
        scale = 9
      }
      
      model.scale.set(scale, scale, scale)
    }
  }
  
  // 디바이스 방향 변경 감지
  const handleOrientationChange = () => {
    if (typeof window === 'undefined') return
    
    setTimeout(() => {
      handleResize()
    }, 100)
  }
  
  // 전체 초기화 함수
  const initGlbLoading = () => {
    // Three.js 초기화
    initThreeJS()
    
    // 조명 설정
    setupLights()
    // 화면 크기 변경 이벤트 등록
    window.addEventListener('resize', handleResize)
    
    // GLB 파일 로딩
    glbLoading()
  }
  
  // Vue 컴포넌트 생명주기에서 호출 - copypage.vue 방식
  onMounted(async () => {
    // 터치 디바이스가 아닌 경우에만 마우스 이벤트 등록
    if (!IS_TOUCH_DEVICE) {
      document.addEventListener('mousemove', handleMouseMove)
    }
    
    // GLB 모델 로딩 후 씬 초기화
    await initGlbLoading()
    
    // 리사이즈 및 방향 변경 이벤트 리스너
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    // 터치 이벤트 추가 (모바일 최적화)
    if (IS_TOUCH_DEVICE) {
      // 터치 시작 시 ASCII 로고 애니메이션 활성화
      document.addEventListener('touchstart', () => {
        if (model) {
          // 터치 시 약간의 스케일 효과
          model.scale.multiplyScalar(1.05)
          setTimeout(() => {
            if (model) {
              model.scale.multiplyScalar(1/1.05)
            }
          }, 150)
        }
      }, { passive: true })
      
      // 디바이스 방향 센서 지원
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
          if (model && event.beta !== null && event.gamma !== null) {
            // 디바이스 기울기에 따른 로고 회전
            const beta = (event.beta * Math.PI) / 180 // X축 회전
            const gamma = (event.gamma * Math.PI) / 180 // Y축 회전
            
            model.rotation.x = ASCII_LOGO_INIT.rotation.x + beta * 0.1
            model.rotation.z = ASCII_LOGO_INIT.rotation.z + gamma * 0.1
          }
        })
      }
    }
  })
  
  // 컴포넌트가 사라질 때 정리 - copypage.vue 방식
  onUnmounted(() => {
    // 애니메이션 루프 중단
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    // 이벤트 리스너 제거
    if (!IS_TOUCH_DEVICE) {
      document.removeEventListener('mousemove', handleMouseMove)
    }
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleOrientationChange)
    
    // Three.js 리소스 정리
    if (renderer) {
      renderer.dispose()
    }
    if (scene) {
      scene.clear()
    }
  })
</script>


<style scoped>
  .ascii-test-page {
    width: 100vw;
    height: 100vh;
    background: #fafafa;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 9999;
  }
  
  .ascii-container {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    user-select: none !important;
    transform-style: preserve-3d;
    perspective: 1000px;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  
  .loading, .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "Source Code Pro", monospace;
    font-size: 16px;
    z-index: 10;
  }
  
  .error {
    color: #ff6666;
  }
  
  .ascii-container canvas {
    letter-spacing: -0.6px !important;
    font-family: "Source Code Pro" !important;
    background-color: transparent !important;
  }
  
  .ascii-container :deep(div) {
    font-family: "Source Code Pro", 'Courier New', monospace !important;
    font-size: 8px !important;
    line-height: 8px !important;
    white-space: pre !important;
    color: #050505 !important;
    background: #fafafa !important;
    user-select: none !important;
    letter-spacing: -0.6px !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  @media (max-width: 1200px) {
    .ascii-container :deep(div) {
      font-size: 6px;
      line-height: 6px;
    }
  }
  
  @media (max-width: 768px) {
    .ascii-container :deep(div) {
      font-size: 4px;
      line-height: 4px;
    }
    
    .ascii-container {
      padding: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .ascii-container :deep(div) {
      font-size: 3px;
      line-height: 3px;
    }
  }
  
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .ascii-container {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }
  
  @media (prefers-color-scheme: dark) {
    .ascii-test-page {
      background-color: #050505;
      color: #fafafa;
    }
    
    .ascii-container :deep(div) {
      color: #fafafa;
      background: #050505;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .ascii-container {
      transition: none !important;
    }
  }
  
  @media (hover: none) and (pointer: coarse) {
    .ascii-container {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #050505;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
</style>