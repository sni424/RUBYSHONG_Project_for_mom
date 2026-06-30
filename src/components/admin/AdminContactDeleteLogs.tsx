import { useEffect, useState } from 'react';
import { getContactInquiryDeleteLogs } from '@/api/ContactApi';
import { formatKoreanDateTime } from '@/constants/utils';
import type { ContactInquiryDeleteLog } from '@/constants/type';
import { useNavigate } from 'react-router';
import axios from 'axios';

const AdminContactDeleteLogs = () => {
  const navigate = useNavigate();
  // 문의 삭제 이력 목록
  const [deleteLogs, setDeleteLogs] = useState<ContactInquiryDeleteLog[]>([]);

  // 삭제 이력 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 삭제 이력 에러 메시지
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    // 문의 삭제 이력 조회
    getContactInquiryDeleteLogs()
      .then((data) => {
        if (!isMounted) return;
        setDeleteLogs(data);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error(error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/admin/login');
          return;
        }
        setErrorMessage('문의 삭제 이력을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {errorMessage && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
          {errorMessage}
        </div>
      )}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-220 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">삭제 문의</th>
              <th className="px-4 py-3">고객 정보</th>
              <th className="px-4 py-3">삭제한 관리자</th>
              <th className="px-4 py-3">삭제일</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {deleteLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{log.title}</p>
                  <p className="mt-1 text-xs text-slate-500">문의 ID: {log.contactInquiryId}</p>
                </td>

                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{log.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{log.phone}</p>
                </td>

                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-800">{log.deletedBy.email}</p>
                  <p className="mt-1 text-xs text-slate-500">{log.deletedBy.role}</p>
                </td>

                <td className="px-4 py-4 text-slate-500">{formatKoreanDateTime(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 lg:hidden">
        {deleteLogs.map((log) => (
          <div key={log.id} className="p-4">
            <p className="font-semibold text-slate-900">{log.title}</p>
            <p className="mt-1 text-sm text-slate-500">
              {log.name} / {log.phone}
            </p>
            <p className="mt-3 text-sm text-slate-700">
              삭제 관리자: {log.deletedBy.email} ({log.deletedBy.role})
            </p>
            <p className="mt-2 text-xs text-slate-400">{formatKoreanDateTime(log.createdAt)}</p>
          </div>
        ))}
      </div>

      {!isLoading && deleteLogs.length === 0 && (
        <div className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
          문의 삭제 이력이 없습니다.
        </div>
      )}

      {isLoading && (
        <div className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
          문의 삭제 이력을 불러오는 중입니다.
        </div>
      )}
    </>
  );
};

export default AdminContactDeleteLogs;
