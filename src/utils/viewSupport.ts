import axios from 'axios';

export const useViewSupport = function () {
  const fileDownload = async function (url: string) {
    await axios.get(url, { responseType: 'blob' }).then((response) => {
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
  };
  return { fileDownload };
};
