<template>
  <q-page class="">
    <div class="text-h5 q-pb-md">Twitter Scraper</div>
    <!--入力フォーム-->
    <div class="row q-gutter-md">
      <q-input
        label="検索ワード"
        v-model="condition.hashtag"
        class="form-model"
        stack-label
        dense
      />
      <q-input
        label="ツイート日"
        v-model="condition.startDate"
        class="form-model"
        stack-label
        dense
        type="date"
      />
      <div class="text-h6 q-pt-sm form-date-span">~</div>
      <q-input
        label="ツイート日"
        v-model="condition.endDate"
        class="form-model"
        stack-label
        dense
        type="date"
      />
    </div>
    <div class="row q-gutter-md q-pt-md">
      <q-input
        label="ユーザー名"
        v-model="condition.userName"
        class="form-model"
        stack-label
        dense
      />
      <q-select
        label="いいね数"
        v-model="condition.minLike"
        :options="selectItems"
        class="form-model"
        emit-value
        map-options
        dense
      />
      <div class="text-h6 q-pt-sm form-date-span">~</div>
      <q-select
        label="いいね数"
        v-model="condition.maxLike"
        :options="selectItems"
        class="form-model"
        emit-value
        map-options
        dense
      />
    </div>

    <!--botton-->
    <div class="row q-gutter-md q-pt-md">
      <q-btn
        label="検索"
        color="primary"
        dense
        icon="search"
        @click="search"
        :loading="isLoading"
      />
    </div>

    <!--pagi-->
    <div class="q-pt-sm" v-if="dataState.totalPages > 1">
      <q-pagination
        v-model="condition.pageNo"
        :max="dataState.totalPages"
        :max-pages="10"
        @click="search()"
      />
      <hr />
    </div>

    <!--gallery-->
    <div class="q-pt-md">
      <ul class="gallery q-pt-md">
        <li v-for="r in dataState.records" :key="r.image">
          <a
            :href="r.image"
            @click.prevent.stop="r.displayMenu = !r.displayMenu"
            class="image-container"
          >
            <img :src="r.image" />
            <div class="button-overlay" v-if="r.displayMenu">
              <span class="row button">
                <!--Download-->
                <a
                  href="#"
                  @click.prevent="fileDownload(r.image)"
                  class="q-pa-xs"
                >
                  <q-icon name="file_download" color="primary" size="md" />
                </a>
                <!--View-->
                <a
                  href="#"
                  @click.prevent="fullScViewClick(r.image)"
                  class="q-pa-xs"
                >
                  <q-icon name="image" color="secondary" size="md" />
                </a>
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!--View Modal-->
    <q-dialog v-model="fullSc">
      <q-card>
        <q-card-section>
          <div class="image-full-view"></div>
          <img :src="fullScreenViewUrl" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--pagi-->
    <div class="q-pt-sm" v-if="dataState.totalPages > 1 && !isLoading">
      <hr />
      <q-pagination
        v-model="condition.pageNo"
        :max="dataState.totalPages"
        :max-pages="10"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import { useViewSupport } from 'src/utils/viewSupport';
import { useTwitterModel } from 'src/models/TwitterModels';
import { defineComponent, ref, watch } from 'vue';
import { LocationQueryRaw, useRoute, useRouter } from 'vue-router';
export default defineComponent({
  name: 'twitter-page',
  props: {
    pageNo: {
      type: Number,
      required: false,
    },
    pageSize: {
      type: Number,
      required: false,
    },
    hashtag: {
      type: String,
      required: false,
    },
    startDate: {
      type: String,
      required: false,
    },
    endDate: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: false,
    },
    minLike: {
      type: Number,
      required: false,
    },
    maxLike: {
      type: Number,
      required: false,
    },
    fetch: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { fileDownload } = useViewSupport();

    const {
      condition,
      dataState,
      search,
      isLoading,
      holoList,
      getHoloList,
      dateModalShow,
      selectItems,
      imageLinkOpen,
    } = useTwitterModel();
    getHoloList();

    const handleProps = function () {
      console.log('props', props);
      if (props.hashtag) {
        condition.value.hashtag = props.hashtag;
      }
      if (props.startDate) {
        condition.value.startDate = props.startDate;
      }
      if (props.endDate) {
        condition.value.endDate = props.endDate;
      }
      if (props.userName) {
        condition.value.userName = props.userName;
      }
      if (props.minLike) {
        condition.value.minLike = props.minLike;
      }
      if (props.maxLike) {
        condition.value.maxLike = props.maxLike;
      }
      if (props.pageNo) {
        condition.value.pageNo = props.pageNo;
      }
      if (props.pageSize) {
        condition.value.pageSize = props.pageSize;
      }
      if (props.fetch) {
        search();
      }
    };

    handleProps();

    watch(props, () => {
      handleProps();
    });

    const onSearchClick = async function () {
      // パラメータと値を持つオブジェクトを作成
      const params = {
        p: condition.value.pageNo,
        ps: condition.value.pageSize,
      } as LocationQueryRaw;
      if (condition.value.hashtag != '') {
        params.h = condition.value.hashtag;
      }
      if (condition.value.startDate != '') {
        params.sd = condition.value.startDate;
      }
      if (condition.value.endDate != '') {
        params.ed = condition.value.endDate;
      }
      if (condition.value.userName != '') {
        params.u = condition.value.userName;
      }
      if (condition.value.minLike != 0) {
        params.min = condition.value.minLike;
      }
      if (condition.value.maxLike != 0) {
        params.max = condition.value.maxLike;
      }
      params.fetch = 1;

      // URLを変更してクエリパラメータを設定
      console.log('hey', route.params);
      router.push({ path: route.path, query: params });
    };

    const downloadMode = ref(false);

    const fullScreenViewUrl = ref('');
    const fullSc = ref(false);
    const fullScViewClick = function (url: string) {
      fullScreenViewUrl.value = url;
      fullSc.value = true;
    };

    return {
      condition,
      dataState,
      search,
      isLoading,
      holoList,
      getHoloList,
      dateModalShow,
      selectItems,
      imageLinkOpen,
      onSearchClick,
      fileDownload,
      downloadMode,
      fullSc,
      fullScreenViewUrl,
      fullScViewClick,
    };
  },
});
interface PropsState extends LocationQueryRaw {
  p: number;
  ps: number;
  h?: string;
  sd?: string;
  ed?: string;
  u?: string;
  min?: number | null;
  max?: number | null;
  fetch: number;
}
</script>
<style>
.form-model {
  width: 200px;
  height: 40px;
}
.form-date-span {
  width: 10px;
}
.gallery {
  columns: 4; /*段組みの数*/
  padding: 0 15px; /*ギャラリー左右に余白をつける*/
}

.gallery li {
  margin-bottom: 20px; /*各画像下に余白をつける*/
}

/*ギャラリー内のイメージは横幅100%にする*/
.gallery img {
  width: 100%;
  height: auto;
  vertical-align: bottom; /*画像の下にできる余白を削除*/
}
/*===== メニュー表示用 ===== */
.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  display: block;
  width: 100%;
  height: auto;
}

.button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.button-overlay .button {
  width: 100%;
  height: 40px;
  background-color: rgba(128, 128, 128, 0.3);
}

/*　横幅900px以下の段組み設定　*/
@media only screen and (max-width: 900px) {
  .gallery {
    columns: 3;
  }
}

@media only screen and (max-width: 768px) {
  .gallery {
    columns: 2;
  }
}

/*========= レイアウトのためのCSS ===============*/

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  color: #333;
}

a:hover,
a:active {
  text-decoration: none;
}

h1 {
  text-align: center;
  font-size: 6vw;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 30px 0;
}

p {
  margin: 0 10px 10px 10px;
  word-wrap: break-word;
}
</style>
