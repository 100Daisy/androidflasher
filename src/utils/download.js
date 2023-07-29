export function downloadFileWithProgress(url, onprogress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob'; // Set the response type to 'blob' to handle binary data
  
      xhr.onprogress = function (event) {
        if (event.lengthComputable && typeof onprogress === 'function') {
          const percentComplete = (event.loaded / event.total);
          onprogress(percentComplete);
        }
      };
  
      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response]);
          resolve(blob);
        } else {
          reject(new Error('Failed to download file.'));
        }
      };
  
      xhr.onerror = function () {
        reject(new Error('Error occurred while downloading the file.'));
      };
  
      xhr.send();
    });
  }