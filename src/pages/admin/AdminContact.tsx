import { useEffect, useState } from 'react';
import { MessageCircle, Phone, RefreshCw, Trash2 } from 'lucide-react';
import { formatKoreanDateTime } from '@/constants/utils';
import type { ContactInquiry, ContactInquiryStatus } from '@/constants/type';
import {
  deleteContactInquiry,
  getAdminContactInquiries,
  updateContactInquiryStatus,
} from '@/api/ContactApi';
import AdminContactDeleteLogs from '@/components/admin/AdminContactDeleteLogs';
import axios from 'axios';
import { useNavigate } from 'react-router';

const statusLabel: Record<ContactInquiryStatus, string> = {
  pending: '대기',
  answered: '답변 완료',
  closed: '종료',
};

const statusStyle: Record<ContactInquiryStatus, string> = {
  pending: 'bg-amber-50 text-amber-600',
  answered: 'bg-emerald-50 text-emerald-600',
  closed: 'bg-slate-100 text-slate-500',
};

const AdminContact = () => {
  const navigate = useNavigate();
  // 현재 보고 있는 탭
  const [activeTab, setActiveTab] = useState<'inquiries' | 'deleteLogs'>('inquiries');
  // 문의 목록
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // 문의 목록 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 문의 목록 조회 에러 메시지
  const [errorMessage, setErrorMessage] = useState('');

  // 상세로 볼 문의
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // 문의 목록 새로고침
  const fetchInquiries = async () => {
    try {
      // 문의 목록 로딩 시작
      setIsLoading(true);
      setErrorMessage('');

      // 서버에서 문의 목록 가져오기
      const data = await getAdminContactInquiries();

      // 문의 목록 상태 저장
      setInquiries(data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/admin/login');
        return;
      }

      setErrorMessage('문의 목록을 불러오지 못했습니다.');
    } finally {
      // 문의 목록 로딩 종료
      setIsLoading(false);
    }
  };

  // 첫 진입 시 문의 목록 조회
  useEffect(() => {
    let isMounted = true;

    // 문의 목록 API 요청
    getAdminContactInquiries()
      .then((data) => {
        // 컴포넌트가 사라진 뒤에는 state 변경 막기
        if (!isMounted) return;

        // 문의 목록 상태 저장
        setInquiries(data);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(error);
        setErrorMessage('문의 목록을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!isMounted) return;

        // 초기 로딩 종료
        setIsLoading(false);
      });

    // 언마운트 시 비동기 응답 무시
    return () => {
      isMounted = false;
    };
  }, []);

  // 문의 상태 변경
  const handleChangeStatus = async (inquiryId: number, status: ContactInquiryStatus) => {
    try {
      // 문의 상태 변경 API 요청
      const updatedInquiry = await updateContactInquiryStatus(inquiryId, status);

      // 변경된 문의를 목록에 반영
      setInquiries((prev) =>
        prev.map((inquiry) => (inquiry.id === inquiryId ? updatedInquiry : inquiry)),
      );

      // 상세 모달이 열린 상태면 모달 데이터도 같이 갱신
      setSelectedInquiry((prev) => (prev && prev.id === inquiryId ? updatedInquiry : prev));
    } catch (error) {
      console.error(error);
      alert('문의 상태 변경에 실패했습니다.');
    }
  };

  // 문의 삭제
  const handleDeleteInquiry = async (inquiry: ContactInquiry) => {
    // 삭제 전 사용자 확인
    const isConfirmed = window.confirm(
      `"${inquiry.title}" 문의를 정말 삭제하시겠습니까?\n삭제된 문의는 복구할 수 없습니다.`,
    );

    if (!isConfirmed) return;

    try {
      // 문의 삭제 API 요청
      await deleteContactInquiry(inquiry.id);

      // 삭제된 문의를 목록에서 제거
      setInquiries((prev) => prev.filter((item) => item.id !== inquiry.id));

      // 삭제한 문의가 상세 모달에 열려 있으면 모달 닫기
      setSelectedInquiry((prev) => (prev?.id === inquiry.id ? null : prev));

      alert('문의가 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      alert('문의 삭제에 실패했습니다.');
    }
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">문의 관리</h1>
          <p className="mt-2 text-sm text-slate-500">
            고객 문의 내용을 확인하고 처리 상태를 관리할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          새로고침
        </button>
      </div>
      <div className="mb-5 border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto text-sm font-semibold">
          {[
            { label: '문의 목록', value: 'inquiries' },
            { label: '삭제 이력', value: 'deleteLogs' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value as 'inquiries' | 'deleteLogs')}
              className={`whitespace-nowrap border-b-2 px-1 pb-4 ${
                activeTab === tab.value
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {activeTab === 'inquiries' && (
          <>
            {errorMessage && (
              <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                {errorMessage}
              </div>
            )}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-250 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">고객 정보</th>
                    <th className="px-4 py-3">문의 제목</th>
                    <th className="px-4 py-3">문의 내용</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="px-4 py-3">문의일</th>
                    <th className="px-4 py-3 text-right">관리</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{inquiry.name}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Phone size={13} />
                          {inquiry.phone}
                        </p>
                      </td>

                      <td className="max-w-56 px-4 py-4 font-semibold text-slate-800">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="block max-w-56 truncate text-left transition hover:text-violet-600"
                        >
                          {inquiry.title}
                        </button>
                      </td>

                      <td className="max-w-md px-4 py-4 text-slate-600">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="block max-w-md truncate text-left transition hover:text-violet-600"
                        >
                          {inquiry.message}
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyle[inquiry.status]
                          }`}
                        >
                          {statusLabel[inquiry.status]}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-500">
                        {formatKoreanDateTime(inquiry.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="h-9 rounded-lg border border-violet-200 px-3 text-xs font-semibold text-violet-600 transition hover:bg-violet-600 hover:text-white"
                          >
                            상세보기
                          </button>

                          <select
                            value={inquiry.status}
                            onChange={(e) =>
                              handleChangeStatus(inquiry.id, e.target.value as ContactInquiryStatus)
                            }
                            className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700"
                          >
                            <option value="pending">대기</option>
                            <option value="answered">답변 완료</option>
                            <option value="closed">종료</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inquiry)}
                            className="flex h-9 items-center gap-1 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={14} />
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{inquiry.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{inquiry.phone}</p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyle[inquiry.status]
                      }`}
                    >
                      {statusLabel[inquiry.status]}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="mt-4 w-full rounded-xl bg-slate-50 p-3 text-left"
                  >
                    <p className="flex items-center gap-2 font-semibold text-slate-900">
                      <MessageCircle size={16} />
                      <span className="truncate">{inquiry.title}</span>
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {inquiry.message}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      {formatKoreanDateTime(inquiry.createdAt)}
                    </p>
                  </button>

                  <div className="mt-4 flex gap-2">
                    <select
                      value={inquiry.status}
                      onChange={(e) =>
                        handleChangeStatus(inquiry.id, e.target.value as ContactInquiryStatus)
                      }
                      className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700"
                    >
                      <option value="pending">대기</option>
                      <option value="answered">답변 완료</option>
                      <option value="closed">종료</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(inquiry)}
                      className="h-10 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && inquiries.length === 0 && (
              <div className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                등록된 문의가 없습니다.
              </div>
            )}

            {isLoading && (
              <div className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                문의 목록을 불러오는 중입니다.
              </div>
            )}
          </>
        )}

        {activeTab === 'deleteLogs' && <AdminContactDeleteLogs />}
      </div>

      {selectedInquiry && (
        <InquiryDetailModal inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />
      )}
    </section>
  );
};

type InquiryDetailModalProps = {
  inquiry: ContactInquiry;
  onClose: () => void;
};

const InquiryDetailModal = ({ inquiry, onClose }: InquiryDetailModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400">문의 상세</p>
            <h2 className="mt-2 break-words text-xl font-bold text-slate-900">{inquiry.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            닫기
          </button>
        </div>

        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm">
          <InquiryInfo label="고객명" value={inquiry.name} />
          <InquiryInfo label="연락처" value={inquiry.phone} />
          <InquiryInfo label="문의일" value={formatKoreanDateTime(inquiry.createdAt)} />
          <InquiryInfo label="상태" value={statusLabel[inquiry.status]} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-800">문의 내용</p>
          <div className="max-h-[45vh] overflow-y-auto whitespace-pre-line break-words rounded-xl border border-slate-200 p-4 text-sm leading-7 text-slate-700">
            {inquiry.message}
          </div>
        </div>
      </div>
    </div>
  );
};

const InquiryInfo = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between gap-4">
      <span className="shrink-0 text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
};

export default AdminContact;
