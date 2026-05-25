const API_BASE_URL = 'http://localhost:4000/api';

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error('상품 목록을 불러오지 못했습니다.');
  }

  const result = await response.json();

  return result.data;
};
