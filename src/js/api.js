// Claude API 연동

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Claude API를 호출하여 캡션을 생성합니다
 * @param {string[]} keywords - 키워드 배열
 * @param {string} emoji - 선택된 이모지
 * @returns {Promise<string>} - 생성된 캡션
 */
export async function generateCaption(keywords, emoji) {
  if (!API_KEY) {
    console.error('API 키가 설정되지 않았습니다.');
    // 개발 중에는 더미 캡션 반환
    return generateDummyCaption(keywords, emoji);
  }

  try {
    const prompt = createCaptionPrompt(keywords, emoji);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();

  } catch (error) {
    console.error('캡션 생성 중 오류:', error);
    // 오류 시 더미 캡션 반환
    return generateDummyCaption(keywords, emoji);
  }
}

/**
 * 캡션 생성을 위한 프롬프트를 만듭니다
 */
function createCaptionPrompt(keywords, emoji) {
  return `당신은 건강·미용·생활 정보를 공유하는 SNS "아모그램"의 캡션 작성 AI입니다.

다음 정보를 바탕으로 따뜻하고 친근한 톤의 인스타그램 스타일 캡션을 작성해주세요:

- 키워드: ${keywords.join(', ')}
- 이미지: ${emoji}

작성 가이드:
1. 1-3문장 정도로 간결하게 작성
2. 친근하고 긍정적인 톤
3. 이모지를 적절히 활용 (2-3개)
4. 건강, 미용, 라이프스타일 관련 내용
5. 해시태그는 넣지 말 것

캡션만 작성해주세요:`;
}

/**
 * 더미 캡션 생성 (API 키가 없을 때 또는 오류 시)
 */
function generateDummyCaption(keywords, emoji) {
  const templates = [
    `오늘의 ${keywords[0]}! ${emoji} 건강하고 즐거운 하루를 시작해요 ✨`,
    `${keywords[0]}로 나를 위한 시간 💕 작은 셀프케어가 하루를 특별하게 만들어줘요!`,
    `새로운 ${keywords[0]} 루틴 시작! ${emoji} 꾸준히 하면 변화가 보일 거예요 🌟`,
    `${keywords[0]}와 함께하는 하루 ${emoji} 건강한 습관이 아름다운 삶을 만들어요 💫`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// 응원 캐릭터 정의
const CHARACTERS = [
  {
    name: '건강맘',
    avatar: '💚',
    persona: '따뜻하고 다정한 어머니. 항상 격려하고 응원하며, 건강을 챙기는 말투를 사용합니다.'
  },
  {
    name: '미보님',
    avatar: '✨',
    persona: '미용과 뷰티 전문가 선배. 전문적이면서도 친근하고, 구체적인 조언을 해줍니다.'
  },
  {
    name: '응원이',
    avatar: '⭐',
    persona: '에너지 넘치는 친구. 밝고 긍정적이며, 감탄사와 이모지를 많이 사용합니다.'
  },
  {
    name: '포근이',
    avatar: '🌼',
    persona: '포근하고 다정한 할머니. 부드럽고 따뜻한 말투로 칭찬과 격려를 해줍니다.'
  }
];

/**
 * 응원 댓글들을 생성합니다
 * @param {string[]} keywords - 키워드 배열
 * @param {string} caption - 생성된 캡션
 * @returns {Promise<Array>} - 생성된 댓글 배열
 */
export async function generateComments(keywords, caption) {
  if (!API_KEY) {
    console.log('API 키가 없어 더미 댓글을 생성합니다.');
    return generateDummyComments(keywords, caption);
  }

  try {
    // 랜덤하게 2-3명의 캐릭터 선택
    const numComments = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const selectedCharacters = shuffleArray([...CHARACTERS]).slice(0, numComments);

    // 각 캐릭터별로 댓글 생성
    const commentPromises = selectedCharacters.map(character =>
      generateSingleComment(character, keywords, caption)
    );

    const comments = await Promise.all(commentPromises);
    return comments;

  } catch (error) {
    console.error('댓글 생성 중 오류:', error);
    return generateDummyComments(keywords, caption);
  }
}

/**
 * 단일 캐릭터의 댓글을 생성합니다
 */
async function generateSingleComment(character, keywords, caption) {
  const prompt = `당신은 "${character.name}"이라는 캐릭터입니다.

캐릭터 페르소나: ${character.persona}

다음 게시물에 대해 응원 댓글을 작성해주세요:
- 키워드: ${keywords.join(', ')}
- 게시물 내용: ${caption}

작성 가이드:
1. 1-2문장으로 간결하게
2. ${character.name}의 페르소나에 맞는 말투 사용
3. 진심 어린 칭찬과 응원
4. 이모지 1-2개 포함
5. 자연스럽고 따뜻한 톤

댓글만 작성해주세요:`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    return {
      author: character.name,
      avatar: character.avatar,
      text: text
    };

  } catch (error) {
    console.error(`${character.name} 댓글 생성 오류:`, error);
    // 오류 시 더미 댓글 반환
    return generateDummyCommentForCharacter(character, keywords);
  }
}

/**
 * 배열을 섞습니다 (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 더미 댓글들 생성 (API 키가 없을 때)
 */
function generateDummyComments(keywords, caption) {
  const numComments = Math.floor(Math.random() * 2) + 2; // 2 or 3
  const selectedCharacters = shuffleArray([...CHARACTERS]).slice(0, numComments);

  return selectedCharacters.map(character =>
    generateDummyCommentForCharacter(character, keywords)
  );
}

/**
 * 특정 캐릭터의 더미 댓글 생성
 */
function generateDummyCommentForCharacter(character, keywords) {
  const templates = {
    '건강맘': [
      `어머, ${keywords[0]} 정말 좋아 보여요! 건강 챙기는 모습이 보기 좋네요 💕`,
      `와, 정말 건강한 선택이에요! 항상 응원할게요 🌟`,
      `${keywords[0]}로 건강 챙기다니 정말 대단해요! 계속 이렇게 관리하세요 💚`
    ],
    '미보님': [
      `${keywords[0]} 선택 정말 좋으시네요! 꾸준히 하시면 효과 보실 거예요 ✨`,
      `전문가 입장에서 봐도 훌륭한 선택이에요! 이렇게 관리하시면 완벽해요 💫`,
      `${keywords[0]}는 정말 중요하죠! 계속 이렇게 하시면 좋은 결과 있을 거예요 ✨`
    ],
    '응원이': [
      `와! 완전 멋져요! ${keywords[0]} 최고예요! 저도 따라할래요! 💪✨`,
      `대박! 진짜 열심히 하시네요! 응원합니다! 화이팅! 🔥⭐`,
      `우와! ${keywords[0]} 진짜 좋아 보여요! 완전 멋있어요! 👏✨`
    ],
    '포근이': [
      `참 좋은 습관이구나~ ${keywords[0]}도 잘하고 있네. 기특하단다 💗`,
      `어머, 정말 열심히 하는구나. ${keywords[0]}로 건강 챙기는 모습이 예쁘단다 🌼`,
      `아이고, 잘하고 있구나~ 계속 이렇게 건강하게 지내렴 💕`
    ]
  };

  const characterTemplates = templates[character.name];
  const randomTemplate = characterTemplates[Math.floor(Math.random() * characterTemplates.length)];

  return {
    author: character.name,
    avatar: character.avatar,
    text: randomTemplate
  };
}
