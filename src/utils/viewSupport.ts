import axios from 'axios';
import { APIClient } from 'src/api/BaseApi';

export const useViewSupport = function () {
  const fileDownload = async function (url: string) {
    if (url.includes('https://rts-pctr.c.yimg.jp')) {
      imageDownload(url);
    } else {
      await axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
        console.log(response);
        const blob = new Blob([response.data]);
        const blobURL = window.URL.createObjectURL(blob);

        const obj = document.createElement('a');
        obj.href = blobURL;
        const fileName =
          url.split('/')[url.split('/').length - 1].split('?')[0] + '.jpg';

        obj.download = fileName;
        document.body.appendChild(obj);
        obj.click();
        if (obj.parentNode) obj.parentNode.removeChild(obj);
      });
    }
  };
  const imageDownload = async function (url: string) {
    const model = new APIClient();
    const getUrl = model.combineUrl('/support/download_image?url=' + url);

    await axios
      .get(getUrl, { responseType: 'arraybuffer' })
      .then((response) => {
        if (response) {
          console.log('image download', response);
          //blobオブジェクトにしたい場合
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const blobURL = window.URL.createObjectURL(blob);

          const obj = document.createElement('a');
          obj.href = blobURL;
          const fileName = url
            .split('/')
            [url.split('/').length - 1].split('?')[0];

          obj.download = fileName;
          document.body.appendChild(obj);
          obj.click();
        }
      });
  };
  return { fileDownload, imageDownload };
};
