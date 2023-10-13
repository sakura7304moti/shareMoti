import api from 'src/api/ImageListApi';
import { ref } from 'vue';
export function useImageListModel() {
  const filter = ref('');
  const records = ref([] as DataState[]);
  return {};
}

export interface DataState {
  id: number;
  fileName: string;
  title: string;
  detail: string;
  createAt: string;
  updateAt: string;
}

interface Loading {
  search: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}
