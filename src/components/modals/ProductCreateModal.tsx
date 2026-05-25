import { X, ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductCreateModal = ({ isOpen, onClose }: ProductCreateModalProps) => {
  // 실제 서버로 전송할 이미지 파일
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 화면에 보여줄 이미지 미리보기 URL
  const [previewUrl, setPreviewUrl] = useState('');

  // 사용자가 이미지 영역에 파일을 드래그 중인지 확인
  const [isDragging, setIsDragging] = useState(false);

  // 상품 등록 폼 데이터
  const [formData, setFormData] = useState({
    // 상품명
    name: '',

    // 카테고리
    category: '',

    // 상품 원가
    price: '',

    // 할인율
    discountRate: '',

    // 최종 판매 가격
    finalPrice: '',

    // 재고 수량
    stock: '',

    // 상품 상태
    status: 'selling',

    // 상품 설명
    description: '',
  });

  // 모든 input/select/textarea 공통 변경 함수
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 이미지 파일 검증 + 미리보기 생성
  const handleImageFile = (file: File) => {
    // 이미지 파일이 아니면 처리하지 않음
    if (!file.type.startsWith('image/')) return;

    // 나중에 서버로 보낼 원본 파일 저장
    setImageFile(file);

    // 브라우저에서만 쓰는 임시 미리보기 URL 생성
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/45 px-4 py-6 sm:py-10 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6 lg:mx-0">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">상품 등록</h2>
            <p className="mt-1 text-sm text-slate-500">새로운 상품 정보를 입력해주세요.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={22} />
          </button>
        </div>

        <form className="grid gap-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <label
              // 드래그 중 브라우저 기본 동작 방지
              // 기본 동작을 막지 않으면 이미지가 브라우저에서 바로 열릴 수 있음
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              // 드래그가 업로드 영역 밖으로 나가면 스타일 원복
              onDragLeave={() => setIsDragging(false)}
              // 파일을 업로드 영역에 놓았을 때 실행
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);

                // 드롭된 파일 중 첫 번째 파일만 사용
                const file = e.dataTransfer.files?.[0];

                if (file) {
                  handleImageFile(file);
                }
              }}
              className={`flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 text-center transition sm:min-h-56 lg:min-h-64 ${
                isDragging
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/40'
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="상품 이미지 미리보기"
                  className="h-full max-h-64 w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <ImagePlus size={42} className="text-slate-400" />
                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    이미지를 클릭하거나 드래그하여 업로드
                  </p>
                  <p className="mt-2 text-xs text-slate-400">PNG, JPG, WEBP 파일</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                // 클릭해서 파일을 선택했을 때 실행
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleImageFile(file);
                  }
                }}
              />
            </label>

            <div className="grid gap-4">
              <Input
                label="상품명"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="상품명을 입력하세요"
              />

              <Select
                label="카테고리"
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="ring">반지</option>
                <option value="necklace">목걸이</option>
                <option value="earring">귀걸이</option>
                <option value="bracelet">팔찌</option>
              </Select>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  value={formData.price}
                  onChange={handleChange}
                  label="가격"
                  required
                  type="number"
                  placeholder="0"
                  unit="원"
                />
                <Input
                  value={formData.discountRate}
                  onChange={handleChange}
                  label="할인율"
                  type="number"
                  placeholder="0"
                  unit="%"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  value={formData.finalPrice}
                  onChange={handleChange}
                  label="최종 가격"
                  type="number"
                  placeholder="0"
                  unit="원"
                />
                <Input label="재고" required type="number" placeholder="0" unit="개" />
              </div>

              <Select
                label="상품 상태"
                required
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="selling">판매 중</option>
                <option value="soldout">품절</option>
                <option value="hidden">숨김</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">상품 설명</label>
            <textarea
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              placeholder="상품에 대한 설명을 입력하세요"
              className="h-32 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              취소
            </button>

            <button
              type="submit"
              className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  required,
  unit,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  unit?: string;
}) => {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div className="flex h-11 items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-violet-500">
        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
    </label>
  );
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

const Select = ({ label, required, children, ...props }: SelectProps) => {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <select
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-violet-500"
      >
        {children}
      </select>
    </label>
  );
};

export default ProductCreateModal;
