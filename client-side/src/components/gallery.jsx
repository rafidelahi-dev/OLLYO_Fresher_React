//This component will handle the main logic for my image gallery, including the grid layout, reordering functionality, and deleting multiple images.

// src/components/Gallery.js
import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Alert, AlertIcon, Checkbox } from '@chakra-ui/react'
import ImageCard from './imageCard'
import './gallery.css'

function Gallery({ images }) {
  const [galleryImages, setGalleryImages] = useState(images)
  const [selectedImages, setSelectedImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDeletedImages, setSelectedDeletedImages] = useState([])

  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = galleryImages[dragIndex]
    const newImages = [...galleryImages]
    newImages.splice(dragIndex, 1)
    newImages.splice(hoverIndex, 0, draggedImage)
    setGalleryImages(newImages)
  }

  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedImages([...selectedImages, id])
    } else {
      setSelectedImages(
        selectedImages.filter((selectedId) => selectedId !== id)
      )
    }
  }

  const handleDelete = () => {
    const newImages = galleryImages.filter(
      (image) => !selectedImages.includes(image.id)
    )
    const deleted = galleryImages.filter((image) =>
      selectedImages.includes(image.id)
    )
    setGalleryImages(newImages)
    setDeletedImages([...deletedImages, ...deleted])
    setSelectedImages([])
  }

  const handleSetFeature = (id) => {
    const newImages = [...galleryImages]
    const featureIndex = newImages.findIndex((image) => image.id === id)
    const [featureImage] = newImages.splice(featureIndex, 1)
    newImages.unshift(featureImage)
    setGalleryImages(newImages)
  }

  const handleAddButtonClick = () => {
    setShowModal(true)
  }

  const handleDeletedImageSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedDeletedImages([...selectedDeletedImages, id])
    } else {
      setSelectedDeletedImages(
        selectedDeletedImages.filter((selectedId) => selectedId !== id)
      )
    }
  }

  const handleAddToGallery = () => {
    const newImages = [...galleryImages]
    selectedDeletedImages.forEach((id) => {
      const image = deletedImages.find((img) => img.id === id)
      if (image) {
        newImages.push(image)
      }
    })
    setGalleryImages(newImages)
    setDeletedImages(
      deletedImages.filter((img) => !selectedDeletedImages.includes(img.id))
    )
    setSelectedDeletedImages([])
    setShowModal(false)
  }

 const handleCloseModal = (e) => {
   if (e.target.classList.contains('modal')) {
     setShowModal(false)
   }
 }



  return (
    <DndProvider backend={HTML5Backend}>
      <div className='gallery-container'>
        <div className='header'>
          {selectedImages.length > 0 && (
            <span className='selected-count'>
              <Checkbox isChecked isReadOnly marginRight='2' />
              {selectedImages.length} items have been selected
            </span>
          )}
          <h1 className='title'>Image Gallery</h1>
          {selectedImages.length > 0 && (
            <button onClick={handleDelete} className='delete-button'>
              Delete Selected Images
            </button>
          )}
        </div>
        <div className='border'></div>
        <div className='gallery'>
          {galleryImages.map((image, index) => (
            <ImageCard
              key={image.id}
              index={index}
              id={image.id}
              image={image}
              isFeatured={index === 0}
              moveImage={moveImage}
              onSelect={handleSelect}
              onSetFeature={handleSetFeature}
            />
          ))}
          <button onClick={handleAddButtonClick} className='add-button'>
            Add Images
          </button>
        </div>
        {showModal && (
          <div className='modal' onClick={handleCloseModal}>
            <div className='modal-content'>
              <Alert status='success'>
                <AlertIcon boxSize='40' marginRight='4' />
                All images are in Display
              </Alert>
              <div className='deleted-images'>
                {deletedImages.map((image) => (
                  <div key={image.id} className='deleted-image'>
                    <img src={image.src} alt='' />
                    <input
                      type='checkbox'
                      onChange={(e) =>
                        handleDeletedImageSelect(image.id, e.target.checked)
                      }
                    />
                  </div>
                ))}
              </div>
              {selectedDeletedImages.length > 0 && (
                <button
                  onClick={handleAddToGallery}
                  className='add-to-gallery-button'
                >
                  Add to Gallery
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}


export default Gallery;



