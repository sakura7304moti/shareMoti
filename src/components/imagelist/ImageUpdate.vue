<template>
  <q-btn
    round
    dense
    icon="edit"
    text-color="secondary"
    @click="modalView = true"
  />
  <q-dialog v-model="modalView">
    <q-card class="image-list-update-card">
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-pb-md">更新画面</div>
        <div class="q-pa-md">
          <q-input v-model="updateState.title" label="タイトル" stack-label />
          <q-input
            v-model="updateState.detail"
            label="詳細"
            stack-label
            type="textarea"
          />
        </div>
        <div style="width: 100%">
          <div style="text-align: right">
            <q-btn
              label="保存"
              flat
              color="primary"
              :disable="
                state.title == updateState.title &&
                state.detail == updateState.detail
              "
              @click="update"
            />
          </div>
        </div>
        <!--画像-->
        <div class="image-tweet-card-img">
          <img :src="downloadUrl" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import api from 'src/api/ImageListApi';
import { emit } from 'process';
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'image-list-update',
  props: {
    dataState: {
      type: Object as PropType<DataState>,
      required: true,
    },
    downloadUrl: {
      type: String,
    },
  },
  setup(props) {
    const quasar = useQuasar();
    const modalView = ref(false);
    const d = JSON.parse(JSON.stringify(props.dataState)) as DataState;
    const updateState = ref({
      id: d.id,
      title: d.title,
      detail: d.detail,
    } as UpdateState);
    const state = ref(props.dataState);

    const update = async function () {
      await api
        .update(updateState.value)
        .then((response) => {
          if (response) {
            console.log('update', response);
            if (response.success) {
              quasar.notify({
                message: '更新完了！',
                color: 'primary',
                position: 'top',
              });
              state.value.title = updateState.value.title;
              state.value.detail = updateState.value.detail;
              modalView.value = false;
            }
          }
        })
        .catch((e) => console.log('update err', e));
    };
    return { modalView, state, updateState, update };
  },
});

interface DataState {
  id: number;
  fileName: string;
  ext: string;
  title: string;
  detail: string;
  createAt: string;
  updateAt: string;
}
interface UpdateState {
  id: number;
  title: string;
  detail: string;
}
</script>
<style>
.image-list-update-card {
  width: 500px;
  height: 600px;
}
</style>
