import { useQuasar } from 'quasar';
import api from 'src/api/HoloAlbumApi';
import { HoloSongApi } from 'src/api/HoloSongApi';
import { ref } from 'vue';

export function useHoloSongAlbumModel() {
  const songApi = new HoloSongApi();
  const quasar = useQuasar();
  const selectItem = ref({
    album: {
      albumName: '',
      artist: '',
      playlistLink: '',
      date: '',
      imageLink: '',
    },
    music: {
      musicName: '',
      artist: '',
      albumName: '',
      musicLink: '',
      playlistLink: '',
      imageLink: '',
    },
    musicList: [] as Music[],
  } as SelectItem);
  const pageState = ref({
    selectLink: '',
    pageNo: 1,
    pageSize: 20,
    records: [] as Album[],
  } as PageState);
  const loading = ref({
    album: false,
    music: false,
  } as LoadingState);
  const dataState = ref({
    albums: [] as Album[],
    musics: [] as Music[],
    clear(): void {
      this.albums.splice(0);
      this.musics.splice(0);
    },
  } as DataState);
  const holoMembers = ref([] as string[]);
  const getMembers = async function () {
    holoMembers.value.splice(0);
    await songApi
      .holoList()
      .then((response) => {
        if (response) {
          console.log('holo member', response);
          response.forEach((it) => holoMembers.value.push(it));
          console.log(
            'max length',
            Math.max(...holoMembers.value.map((it) => it.length))
          );
        }
      })
      .catch((e) => {
        console.log(e);
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });
      });
  };

  const getAlbums = async function () {
    loading.value.album = true;
    dataState.value.albums.splice(0);
    await api
      .searchAlbum()
      .then((response) => {
        if (response) {
          console.log('albums', response);
          response.records.forEach((it) => dataState.value.albums.push(it));
          //ページング用オブジェクトを準備
          pageState.value.totalPages = Math.ceil(
            dataState.value.albums.length / pageState.value.pageSize
          );
          selectPage();
        }
      })
      .catch((e) => {
        console.log(e);
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });
      });
    loading.value.album = false;
  };

  const selectAlbum = function () {
    selectItem.value.musicList.splice(0);
    dataState.value.musics
      .filter((it) => it.playlistLink == selectItem.value.album.playlistLink)
      .forEach((music) => selectItem.value.musicList.push(music));
    console.log('select item', selectItem.value);
  };

  const selectPage = function () {
    pageState.value.records.splice(0);
    //1ページ目 -> 0 ~ 19
    //2ページ目 -> 20 ~ 39
    //3ページ目 -> 40 ~ 59
    const startIndex =
      Math.max(pageState.value.pageNo - 1, -1) * pageState.value.pageSize;
    const lastIndex = Math.min(
      startIndex + pageState.value.pageSize - 1,
      dataState.value.albums.length
    );
    dataState.value.albums.slice(startIndex, lastIndex).forEach((rec) => {
      pageState.value.records.push(rec);
    });
    console.log('pageItem', pageState.value);
  };

  const getMusics = async function () {
    loading.value.music = true;
    dataState.value.musics.splice(0);
    await api
      .searchMusic()
      .then((response) => {
        if (response) {
          console.log('musics', response);
          response.records.forEach((it) => dataState.value.musics.push(it));
        }
      })
      .catch((e) => {
        console.log(e);
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });
      });
    loading.value.music = false;
  };

  return {
    loading,
    selectItem,
    dataState,
    pageState,
    holoMembers,
    getMembers,
    getAlbums,
    getMusics,
    selectPage,
    selectAlbum,
  };
}

interface DataState {
  albums: Album[];
  musics: Music[];
  clear(): void; //初期化
}

interface PageState {
  selectLink: string;
  pageNo: number;
  totalPages: number;
  pageSize: number;
  records: Album[];
}

interface SelectItem {
  album: Album;
  music: Music;
  musicList: Music[];
}

interface LoadingState {
  album: boolean;
  music: boolean;
}

interface Album {
  albumName: string;
  artist: string;
  playlistLink: string;
  date: string;
  imageLink: string;
}
interface Music {
  musicName: string;
  artist: string;
  musicLink: string;
  playlistLink: string;
  imageLink: string;
}
