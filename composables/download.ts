export const useDownloadFile = async (url: string, fileName: string) => {
    const response = await $fetch<Blob>(url);

    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(response);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
