export const handleFileChange = (e, onChange) => {
  const files = Array.from(e.target.files);
  const currentFiles = form.getValues("media") || [];
  if (currentFiles.length + files.length > 4) {
    alert("You can only upload a maximum of 4 images.");
    return;
  }
  const fileData = files.map((file) => ({
    originalname: file.name,
    size: file.size,
    mimetype: file.type,
    blobUrl: URL.createObjectURL(file),
  }));
  onChange([...currentFiles, ...fileData]);
};

export const handleRemoveImage = (index, onChange) => {
  const currentFiles = form.getValues("media") || [];
  const updatedFiles = currentFiles.filter((_, i) => i !== index);
  onChange(updatedFiles);
};
