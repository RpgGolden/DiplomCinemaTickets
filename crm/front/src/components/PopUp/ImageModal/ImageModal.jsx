import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeImageModal } from '../../../store/MoviesSlice/MoviesSlice';

const ImageModal = () => {
  const dispatch = useDispatch();
  const { isImageModalOpen, selectedImage } = useSelector((state) => state.MoviesSlice);
  const handleClose = () => {
    dispatch(closeImageModal());
  };

  return (
    <Dialog open={isImageModalOpen} onClose={handleClose} maxWidth="md">
      <DialogContent style={{ padding: 0 }}>
        <img
          src={selectedImage}
          alt="fullscreen"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
