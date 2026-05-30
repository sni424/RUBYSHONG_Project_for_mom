import { Clock, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import contactHero from '@/assets/images/contact/contact-hero.webp';
import { createContactInquiry } from '@/api/ContactApi';

const STORE_PHONE_NUMBER = '01033938107';
const KAKAO_CHANNEL_URL = 'http://pf.kakao.com/_qHBbX/chat';

// 모바일 기기인지 확인
const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const Contact = () => {
  // 문의 폼 데이터
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    title: '',
    message: '',
  });

  // 문의 제출 중인지 확인
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 전화 문의
  const handlePhoneCall = () => {
    // PC에서는 전화 연결이 어려우니 안내
    if (!isMobileDevice()) {
      alert('전화 문의는 모바일에서 이용해주세요.\n전화번호: 010-3393-8107');
      return;
    }

    // 모바일 전화 앱 열기
    window.location.href = `tel:${STORE_PHONE_NUMBER}`;
  };

  // 카카오톡 상담
  const handleKakaoTalk = () => {
    // 카카오 채널 링크 열기
    window.open(KAKAO_CHANNEL_URL, '_blank');
  };

  // 문의 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 중복 제출 방지
    if (isSubmitting) return;
    // 필수값 검증
    if (!formData.name || !formData.phone || !formData.title || !formData.message) {
      alert('문의 정보를 모두 입력해주세요.');
      return;
    }

    try {
      // 문의 제출 시작
      setIsSubmitting(true);
      // 문의 등록 API 요청
      await createContactInquiry({
        name: formData.name,
        phone: formData.phone,
        title: formData.title,
        message: formData.message,
      });

      alert('문의가 접수되었습니다.');

      // 문의 폼 초기화
      setFormData({
        name: '',
        phone: '',
        title: '',
        message: '',
      });
    } catch (error) {
      console.error(error);
      alert('문의 접수에 실패했습니다.');
    } finally {
      // 문의 제출 종료
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#fbf8f4] text-[#342b24]">
      <section
        className="relative flex min-h-[420px] items-center overflow-hidden bg-cover bg-center px-6 md:min-h-[540px]"
        style={{
          backgroundImage: `url(${contactHero})`,
        }}
      >
        <div className="absolute inset-0 bg-white/25" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-xs uppercase tracking-[0.22em]">Contact</p>

          <h1 className="mt-8 font-serif text-5xl leading-tight md:text-7xl">
            We’re Here
            <br />
            For Your Moment
          </h1>

          <div className="mt-10 border-l border-[#9b7650] pl-7 text-sm leading-8 text-[#6f6258]">
            <p>루비송 주얼리에 대해 궁금하신 점이 있다면</p>
            <p>언제든 편하게 문의해주세요.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:py-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7b6f]">Contact Guide</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl">문의 안내</h2>
          <p className="mt-6 text-sm leading-7 text-[#7a6f66]">
            상담, 예약, 제품 문의까지 가장 편한 방법으로 연락주세요.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ContactGuideCard
            icon={<MessageCircle size={42} strokeWidth={1.4} />}
            title="카카오톡 상담"
            description="가장 빠르게 상담받을 수 있습니다."
            buttonText="상담하기"
            onClick={handleKakaoTalk}
          />

          <ContactGuideCard
            icon={<Phone size={42} strokeWidth={1.4} />}
            title="전화 문의"
            description="영업시간 내 전화 상담이 가능합니다."
            buttonText="전화하기"
            onClick={handlePhoneCall}
          />

          <ContactGuideCard
            icon={<MapPin size={42} strokeWidth={1.4} />}
            title="매장 방문"
            description="예약 후 방문하시면 더 편안하게 상담 가능합니다."
            buttonText="오시는 길"
            onClick={() => {
              window.open(
                'https://map.naver.com/v5/search/서울 강서구 하늘길 77 롯데백화점김포공항점',
                '_blank',
              );
            }}
          />
        </div>

        <div className="mt-12 grid border border-[#e2d8cf] bg-[#fffdf9] md:grid-cols-[0.42fr_1fr]">
          <aside className="relative border-b border-[#e2d8cf] p-8 md:border-b-0 md:border-r md:p-10">
            <p className="text-xs uppercase tracking-[0.2em]">Message</p>
            <h3 className="mt-5 font-serif text-4xl leading-tight">
              궁금한 내용을
              <br />
              남겨주세요
            </h3>

            <div className="mt-12 grid gap-7 text-sm text-[#6f6258]">
              <InfoRow icon={<Clock size={22} />} text={['10:30 - 20:00', '매달 수요일 휴무']} />
              <InfoRow icon={<Phone size={22} />} text={['010-3393-8107']} />
              <InfoRow icon={<MapPin size={22} />} text={['서울특별시 강서구 하늘길 38']} />
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="p-6 md:p-10">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="이름"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="성함을 입력해주세요"
              />

              <Input
                label="연락처"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="mt-5">
              <Input
                label="문의 제목"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="문의 제목을 입력해주세요"
              />
            </div>

            <label className="mt-5 block">
              <span className="mb-3 block text-sm font-medium text-[#4c4037]">문의 내용</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="문의 내용을 입력해주세요"
                className="h-44 w-full resize-none border border-[#e2d8cf] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#c0b5aa] focus:border-[#9b7650]"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 flex h-13 w-full items-center justify-center gap-2 bg-[#9b7650] text-sm font-semibold text-white transition hover:bg-[#876542] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <Send size={17} />
              {isSubmitting ? '문의 접수 중...' : '문의 남기기'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

type ContactGuideCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
};

const ContactGuideCard = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: ContactGuideCardProps) => {
  return (
    <article className="border border-[#e2d8cf] bg-[#fffdf9] px-6 py-10 text-center ">
      <div className="flex justify-center text-[#9b7650]">{icon}</div>

      <h3 className="mt-7 text-lg font-semibold text-[#342b24]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#7a6f66]">{description}</p>

      <button
        type="button"
        onClick={onClick}
        className="mt-8 text-sm text-[#9b7650] transition hover:text-[#6f4f31] cursor-pointer"
      >
        {buttonText} →
      </button>
    </article>
  );
};

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string[] }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-[#9b7650]">{icon}</div>
      <div className="leading-7">
        {text.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
};

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) => {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-[#4c4037]">{label}</span>
      <input
        {...props}
        className="h-12 w-full border border-[#e2d8cf] bg-white px-4 text-sm outline-none transition placeholder:text-[#c0b5aa] focus:border-[#9b7650]"
      />
    </label>
  );
};

export default Contact;
