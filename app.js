// 전역 변수로 PAPS_DATA 사용 가능 여부 확인
function checkPAPSData() {
    if (typeof window.PAPS_DATA === 'undefined') {
        console.error('PAPS_DATA가 정의되지 않았습니다.');
        return false;
    }
    return true;
}

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드됨');
    
    if (typeof PAPS_DATA === 'undefined') {
        console.error('PAPS_DATA가 정의되지 않았습니다.');
        return;
    }

    // 결과 확인 버튼 클릭 이벤트
    const 계산버튼 = document.getElementById('계산버튼');
    
    계산버튼.addEventListener('click', function() {
        console.log('버튼 클릭됨');
        
        // 입력값 가져오기 및 공백 제거
        const 체력요인 = document.getElementById('체력요인').value.trim();
        const 평가종목 = document.getElementById('평가종목').value.trim();
        const 학년 = document.getElementById('학년').value.trim();
        const 성별 = document.getElementById('성별').value.trim();
        const 학교과정 = document.getElementById('학교과정').value.trim();
        const 기록 = parseFloat(document.getElementById('기록').value);

        console.log('입력값:', {체력요인, 평가종목, 학년, 성별, 학교과정, 기록});

        // 입력값 검증
        if (!체력요인 || !평가종목 || !학년 || !성별 || !학교과정 || isNaN(기록)) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        // 평가 결과 찾기
        const 평가결과 = PAPS_DATA.평가기준.find(item => {
            // 모든 문자열 값에 trim() 적용
            const itemMatch = 
                item.체력요인.trim() === 체력요인 &&
                item.평가종목.trim() === 평가종목 &&
                item.학년.trim() === 학년 &&
                item.성별.trim() === 성별 &&
                item.학교과정.trim() === 학교과정;

            if (!itemMatch) return false;

            // 기록 범위 확인
            const [최소값, 최대값] = item.기록.split('~').map(str => parseFloat(str.trim()));
            const 기록범위일치 = 기록 >= 최소값 && 기록 <= 최대값;

            console.log('조건 비교:', {
                체력요인일치: item.체력요인.trim() === 체력요인,
                평가종목일치: item.평가종목.trim() === 평가종목,
                학년일치: item.학년.trim() === 학년,
                성별일치: item.성별.trim() === 성별,
                학교과정일치: item.학교과정.trim() === 학교과정,
                기록범위: `${최소값} ~ ${최대값}`,
                입력기록: 기록,
                기록범위일치: 기록범위일치
            });

            return itemMatch && 기록범위일치;
        });

        console.log('찾은 평가결과:', 평가결과);

        // 결과 표시
        const 등급결과 = document.getElementById('등급결과');
        const 점수결과 = document.getElementById('점수결과');

        if (평가결과) {
            등급결과.textContent = 평가결과.등급;
            점수결과.textContent = 평가결과.점수;
            console.log('결과 표시:', 평가결과.등급, 평가결과.점수);
        } else {
            등급결과.textContent = '해당 없음';
            점수결과.textContent = '-';
            console.log('해당하는 결과를 찾을 수 없음');
        }
    });

    // 체력요인 선택 이벤트
    document.getElementById('체력요인').addEventListener('change', function() {
        const 선택된체력요인 = this.value;
        const 평가종목Select = document.getElementById('평가종목');
        const optgroups = 평가종목Select.getElementsByTagName('optgroup');
        
        for(let optgroup of optgroups) {
            optgroup.style.display = 'none';
            const options = optgroup.getElementsByTagName('option');
            for(let option of options) {
                option.style.display = 'none';
            }
        }
        
        if(선택된체력요인) {
            const selectedOptgroup = 평가종목Select.querySelector(`optgroup[label="${선택된체력요인}"]`);
            if(selectedOptgroup) {
                selectedOptgroup.style.display = '';
                const options = selectedOptgroup.getElementsByTagName('option');
                for(let option of options) {
                    option.style.display = '';
                }
            }
        }
        
        평가종목Select.value = '';
    });
});

// 평가종목 업데이트 함수
function updatePapsItems(선택된체력요인) {
    const 평가종목Select = document.getElementById('평가종목');
    평가종목Select.innerHTML = '<option value="">평가종목 선택</option>';
    
    if (선택된체력요인) {
        const 평가종목매핑 = {
            "심폐지구력": ["왕복오래달리기", "스텝검사", "오래달리기-걷기"],
            "유연성": ["앉아윗몸앞으로굽히기", "종합유연성검사"],
            "근력근지구력": ["팔굽혀펴기", "윗몸말아올리기", "악력"],
            "순발력": ["50m달리기", "제자리멀리뛰기"],
            "비만": ["체질량지수"]
        };
        
        if (평가종목매핑[선택된체력요인]) {
            평가종목매핑[선택된체력요인].forEach(종목 => {
                const option = document.createElement('option');
                option.value = 종목;
                option.textContent = 종목;
                평가종목Select.appendChild(option);
            });
        }
    }
}