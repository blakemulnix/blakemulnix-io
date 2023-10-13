export const downloadFile = (fileUrl: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;
  link.click();
};
